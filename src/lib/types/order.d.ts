import { ApianTransferStatusCodes } from "@/lib/constants/apianTransferStatuses";
import { RecurringOrderFrequency } from "@/lib/enums";

export type vehicle_type = "D" | "V" | "O";
export type priority = "N" | "U";
export type recurring = {
  frequency: RecurringOrderFrequency;
  interval: number;
  count: number;
} | null;
export type OrderInput = {
  created_by: string;
  operator: string;
  sender_location: string;
  recipient_location: string;
  scheduled_earliest_departure_time: string | Date;
  scheduled_earliest_source_departure_time: string;
  scheduled_pickup_datetime: string | Date;
  transfer_type: string;
  vehicle_type: vehicle_type;
  priority: priority;
  dangerous_goods: boolean;
  departure_contact: string;
  arrival_contact: string;
  order_on_behalf_of: string;
  description: string;
  items: OrderItem[];
  payload: { name: string; quantity: number }[];
  transfer_code: string;
  recurring_order: boolean;
  recurring?: recurring;
  asap: boolean;
};

export interface CancelOrderFormData {
  reason: string;
}

export interface OrderListResponse {
  page: number;
  page_size: number;
  count: number;
  results: OrderListItem[];
  response_valid_at: string;
}

interface SenderLocation {
  code?: string;
  name: string;
  parent_location: string;
  contact_name?: string;
  scheduled_pickup_datetime: string;
}

interface RecipientLocation {
  code?: string;
  name: string;
  parent_location: string;
  contact_name?: string;
  scheduled_earliest_recipient_arrival_time?: string;
  scheduled_latest_recipient_arrival_time?: string;
  estimated_earliest_recipient_arrival_time: string | null;
}

interface SourceLocation {
  scheduled_earliest_source_departure_time: string;
  scheduled_latest_source_departure_time: string;
  estimated_earliest_source_departure_time: string | null;
  estimated_latest_source_departure_time: string | null;
  actual_source_departure_time: string | null;
}

interface DestinationLocation {
  scheduled_earliest_destination_arrival_time: string;
  scheduled_latest_destination_arrival_time: string;
  estimated_earliest_destination_arrival_time: string | null;
  actual_destination_arrival_time: string | null;
}

interface OrderListItem {
  code: string;
  customer_reference: string;
  order_notes: string;
  order_on_behalf_of: string;
  departure_contact: string;
  arrival_contact: string;
  type: string;
  type_description: string;
  payload: string;
  transfer: string;
  status: ApianTransferStatusCodes;
  status_description: string;
  sender_location: SenderLocation;
  recipient_location: RecipientLocation;
  source_location: SourceLocation;
  destination_location: DestinationLocation;
}

export interface OrderDetailItem {
  code: string;
  order_notes: string;
  type: string;
  is_dangerous_goods: boolean;
  order_history: {};
  order_on_behalf_of: string;
  customer_reference: string;
  canceled: boolean;
  cancellation_reason: string;
  cancel_details?: {
    by: string;
    datetime: string;
    reason: string;
  };
  sender_location: SenderLocation;
  recipient_location: RecipientLocation;
  source_location: SourceLocation;
  destination_location: DestinationLocation;
  type_description: string;
  payload: OrderDetailResponsePayload[];
  status: ApianTransferStatusCodes;
  operator: OrderDetailResponseOperator;
  priority: string;
  vehicle_type: string;
  actual_departure_time: string;
  created: OrderDetailResponseCreated;
  status_history: StatusHistoryItem[];
  response_valid_at: string;
}

interface OrderDetailResponseLocation {
  code: string;
  name: string;
  contact_name: string;
  parent_location_name: string;
}

interface OrderDetailResponsePayload {
  code: string;
  name: string;
  quantity: number;
}

interface OrderDetailResponseOperator {
  code: string;
  name: string;
  operation: string;
}

interface OrderDetailResponseCreated {
  created_at: string;
  user_email: string;
  user_name: string;
}

interface StatusHistoryItem {
  status: string;
  status_datetime: string;
}

export interface OrderColumns {
  code: string;
  customer_reference: string;
  payload: string;
  scheduled_pickup_datetime: string;
  recipient_location: string;
  status: ApianTransferStatusCodes;
}

export type SimilarOrderWarning = {
  type: string;
  time_diff_min: number;
  pickup_time: string;
};

export interface CreatedOrderResponse {
  orders: OrderListItem[];
  response_valid_at: string;
  result: string;
}
