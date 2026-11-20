import { simpleCoord } from "@/lib/types/coordinates";

export type FlightLocation = {
  name: string;
  localisation: {
    address: string;
    coordinates: simpleCoord;
  };
};

export type Flight = {
  code: string;
  status_description: string;
  payload: string;
  payload_quantity: string;
  tracking: {
    last_polling_time: string;
    last_known_location: simpleCoord;
  };
  source_location: FlightLocation & {
    actual_source_departure_time: string | null;
  };
  destination_location: FlightLocation & {
    actual_destination_arrival_time: string | null;
  };
};

export type FlightsResponse = {
  count: number;
  page: number;
  page_size: number;
  results: Flight[];
};
