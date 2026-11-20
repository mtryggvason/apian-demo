import { simpleCoord } from "@/lib/types/coordinates";
import { Flight, FlightsResponse } from "@/lib/types/flight";

type MockRoute = {
  code: string;
  source: { name: string; address: string; coordinates: simpleCoord };
  destination: { name: string; address: string; coordinates: simpleCoord };
  /** How long one leg takes; the drone loops back to the start afterwards. */
  durationMs: number;
};

export const MOCK_ROUTES: Record<string, MockRoute> = {
  vienna: {
    code: "mock-vienna-schonbrunn-westbahnhof",
    source: {
      name: "Schönbrunn",
      address: "Schönbrunner Schloßstraße 47, 1130 Wien, Austria",
      coordinates: { lat: 48.18485, lon: 16.31224 },
    },
    destination: {
      name: "Westbahnhof",
      address: "Europaplatz 2, 1150 Wien, Austria",
      coordinates: { lat: 48.19656, lon: 16.33799 },
    },
    durationMs: 5 * 60 * 1000,
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Builds an in-flight mock flight whose position moves along the route in real time. */
export const getMockFlightsResponse = (
  routeName: string,
  now = Date.now(),
): FlightsResponse | null => {
  const route = MOCK_ROUTES[routeName];
  if (!route) return null;

  const elapsed = now % route.durationMs;
  const progress = elapsed / route.durationMs;
  const departedAt = new Date(now - elapsed);
  const arrivesAt = new Date(departedAt.getTime() + route.durationMs);
  const { source, destination } = route;

  const flight: Flight = {
    code: route.code,
    status_description: "In flight",
    payload: "Mock",
    payload_quantity: "1",
    tracking: {
      last_polling_time: new Date(now).toISOString(),
      last_known_location: {
        lat: lerp(
          source.coordinates.lat,
          destination.coordinates.lat,
          progress,
        ),
        lon: lerp(
          source.coordinates.lon,
          destination.coordinates.lon,
          progress,
        ),
      },
    },
    source_location: {
      name: source.name,
      localisation: {
        address: source.address,
        coordinates: source.coordinates,
      },
      actual_source_departure_time: departedAt.toISOString(),
    },
    destination_location: {
      name: destination.name,
      localisation: {
        address: destination.address,
        coordinates: destination.coordinates,
      },
      actual_destination_arrival_time: null,
    },
  };

  // Estimated arrival isn't in the Flight type yet, but mirror the real API shape.
  (flight.destination_location as Record<string, unknown>)[
    "estimated_latest_destination_arrival_time"
  ] = arrivesAt.toISOString();

  return { count: 1, page: 1, page_size: 10, results: [flight] };
};
