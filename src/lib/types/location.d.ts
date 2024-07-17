import { simpleCoord } from "@/lib/types/coordinates";

export interface LocationOptionsProps {
  name: string;
  code: string;
  schedule: LocationSchedule;
  schedule_description: string;
}

interface LocationSchedule {
  [key: number]: {
    end: string;
    open: boolean;
    start: string;
  };
}

export interface SenderPermittedWindowInfo {
  schedule: LocationSchedule;
  schedule_description: string;
}

export type LocationDetail = {
  code: string;
  location_name: string;
  parent_location_name: string;
  location_type: string;
  coordinates: simpleCoord;
  altitude: number;
  location_contact_details: string;
  schedule: LocationSchedule;
  camera: LocationCamera;
};

export interface SenderRecipientLocationMapping {
  code: string;
  sender_name: string;
  recipient_location_mappings: {
    code: string;
    name: string;
    schedule: LocationSchedule;
    schedule_description: string;
  }[];
}

export interface LocationCamera {
  code: string;
  name: string;
  description: string;
  interface: string;
}

export type LiveFeedData = {
  url: string;
  expires_at: number;
  response_valid_at: string;
};
