import { nowPlusOneHourString, todayDateString } from "@/lib/dateHelpers";

export const mockOrderDetail = {
  customer_reference: "Ref test",
  status: "100",
  sender_location: {
    name: "sender",
    contact_name: "sender contact",
  },
  recipient_location: {
    name: "recipient",
    contact_name: "recipient contact",
  },
  scheduled_pickup_datetime: todayDateString,
  scheduled_earliest_source_departure_time: todayDateString,
  estimated_departure_time: todayDateString,
  actual_departure_time: todayDateString,
  scheduled_recipient_arrival_time: nowPlusOneHourString,
  estimated_recipient_arrival_time: nowPlusOneHourString,
  actual_arrival_time: nowPlusOneHourString,
  payload: [{ name: "Dummy item", quantity: 1 }],
  created: {
    created_at: todayDateString,
    user_name: "Test user",
    user_email: "user@test.com",
  },
};
