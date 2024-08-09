import { ApianTransferStatusCodes } from "@/lib/constants/apianTransferStatuses";
import { ResponseValidAt } from "@/lib/types";
import { simpleCoord } from "@/lib/types/coordinates";
import { priority } from "@/lib/types/order";

export interface Transfer extends ResponseValidAt {
  code: string;
  type: string;
  status: ApianTransferStatusCodes;
  actual_arrival_time: string | null;
  load_time: string | null;
  unload_time: string | null;
  vehicle_type: string;
  canceled: boolean;
  priority: string;
  transfer_request: string;
  source_location: SourceLocation;
  destination_location: DestinationLocation;
  loaded_by: string | null;
  unloaded_by: string | null;
  operator: string;
  operator_name: string;
  vehicle: string | null;
  status_history: StatusHistoryItem[];
  shipment_list: ShipmentListItem[];
  order_items: OrderItem[];
  max_departure_wait_duration: number;
}

export interface NearbyTransfer {
  code: string;
  current_position: simpleCoord;
  current_velocity: null;
  current_heading?: number;
}

export interface TransferDetails extends ResponseValidAt {
  code: string;
  type: string;
  status: ApianTransferStatusCodes;

  // Arrival Times
  actual_destination_arrival_time: string | null;
  estimated_earliest_destination_arrival_time: string | null;
  estimated_latest_destination_arrival_time: string | null;
  scheduled_earliest_destination_arrival_time: string;
  scheduled_latest_destination_arrival_time: string;

  //Departures
  estimated_earliest_source_departure_time: string | null;
  estimated_latest_source_departure_time: string | null;

  status_reason: string;
  actual_source_departure_time: string | null;
  scheduled_earliest_source_departure_time: string;
  scheduled_latest_source_departure_time: string;

  load_time: string | null;
  unload_time: string | null;
  vehicle_type: string;
  canceled: boolean;
  priority: priority;
  transfer_request: string;
  source_location: SourceLocation;
  destination_location: DestinationLocation;
  loaded_by: string | null;
  unloaded_by: string | null;
  operator: string;
  operator_name: string;
  vehicle: string | null;
  status_history: StatusHistoryItem[];
  shipment_list: ShipmentListItem[];
  shipment: string;
  order_items: OrderItem[];
  response_valid_at: string;
  max_departure_wait_duration: number;
}

export interface Location {
  name: string;
  coordinates: simpleCoord;
  code: string;
  address: string;
}

export interface SourceLocation extends Location {
  scheduled_earliest_source_departure_time: string;
  scheduled_latest_source_departure_time: string;
  estimated_earliest_source_departure_time: string | null;
  estimated_latest_source_departure_time: string | null;
  actual_source_departure_time?: string | null;
}

export interface DestinationLocation extends Location {
  scheduled_latest_destination_arrival_time: string | null;
  scheduled_earliest_destination_arrival_time: string | null;
  estimated_earliest_destination_arrival_time: string | null;
  estimated_latest_destination_arrival_time: string | null;
  actual_destination_arrival_time?: string | null;
}

interface StatusHistoryItem {
  status: string;
  status_datetime: string;
}

interface ShipmentListItem {
  shipment_code: string;
}

interface OrderItem {
  quantity: number;
  code: string;
  name: string;
  dangerous_goods: boolean;
}

interface CompletedTransfersStatsResponse extends ResponseValidAt {
  transfers_completed: string;
}

interface DelayedTransfersStatsResponse extends ResponseValidAt {
  result: string;
  duration: string;
}

interface TransferStats {
  total_transfers: number;
  total_transfer_distance_km: number;
  total_transfer_duration_mins: number;
}

interface AllTransferStatsResponse extends ResponseValidAt {
  stats: TransferStats;
}

interface InflightTransfersStatsResponse extends ResponseValidAt {
  transfers_inflight: number;
}

interface GenericStatisticResponse extends ResponseValidAt {
  result: string;
}

interface TransfersCO2SavedResponse extends ResponseValidAt {
  transfers_co2: number;
}

export interface Tracking {
  code: string;
  current_heading: number;
  current_position: simpleCoord;
  current_velocity: number;
  flight_path_coordinates: Array<Array<number>>;
  id: number;
  last_polling_time: string;
}

export interface TransferTrackingResponse extends ResponseValidAt {
  code: string;
  status: ApianTransferStatusCodes;
  tracking?: Tracking;
}

export interface AvgDispatchTimeResponse extends ResponseValidAt {
  average_dispatch_time_minutes: number | null;
}

export interface TimeSavedResponse extends ResponseValidAt {
  result: string;
}

export interface TransferListResponse {
  page: int;
  page_size: int;
  transfer_count: int;
  results: Transfer[];
  response_valid_at: string;
}
