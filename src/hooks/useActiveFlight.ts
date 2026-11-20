import useSWR from "swr";
import { useRouter } from "next/router";
import { Flight, FlightsResponse } from "@/lib/types/flight";

const POLL_INTERVAL_MS = 5000;

const fetcher = async (url: string): Promise<FlightsResponse> => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch flights: ${response.status}`);
  return response.json();
};

// A flight is in the air once it has departed and before it has arrived.
export const isFlightActive = (flight: Flight) =>
  !!flight.source_location.actual_source_departure_time &&
  !flight.destination_location.actual_destination_arrival_time &&
  flight.status_description !== "Delivered";

/** Polls the Apian flights API and returns the first flight currently in the air. */
export const useActiveFlight = () => {
  // Pass ?mock=vienna on the page URL through to the API.
  const { query } = useRouter();
  const mock = typeof query.mock === "string" ? query.mock : null;
  const url = mock
    ? `/api/flights?mock=${encodeURIComponent(mock)}`
    : "/api/flights";
  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: POLL_INTERVAL_MS,
  });
  const activeFlight = data?.results.find(isFlightActive) ?? null;
  return { activeFlight, error, isLoading };
};
