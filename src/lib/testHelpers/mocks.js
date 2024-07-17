import { getSession, signOut, useSession } from "next-auth/react";

import { getCurrentEpochTime } from "@/lib/dateHelpers";

import {
  duplicateCheckOrderDataWithWarnings,
  testLocationOptionsWithScheduleOpenAllDays,
} from "./mockData";

jest.mock("next-auth/react");

function useSessionNotAuthed() {
  // useSession.mockReturnValue([false, false]);
  useSession.mockReturnValue({
    data: null,
    status: "unauthenticated",
  });
}

function useSessionOnUnauthenticated(session) {
  useSession.mockImplementation(({ onUnauthenticated }) => {
    onUnauthenticated();
    return (
      session ?? { data: null, status: "unauthenticated", update: mockUpdate }
    );
  });
}

function useSessionAuthenticated() {
  useSession.mockReturnValue({
    data: {
      name: "Mrs Test",
      user: {
        username: "test_user@test.com",
        email: "test_user@test.com",
      },
      access_token: "test_token",
      ref: getCurrentEpochTime() + 100000,
    },
    status: "authenticated",
  });
}

export const mockUpdate = jest.fn();
function useSessionExpired() {
  useSession.mockReturnValue({
    update: mockUpdate,
    data: {
      name: "Mrs Test",
      user: {
        username: "test_user@test.com",
        email: "test_user@test.com",
      },
      access_token: "test_token",
      ref: 0,
    },
    status: "authenticated",
  });
}

function useSessionAuthenticatedWithPicture() {
  useSession.mockReturnValue({
    data: {
      name: "Mrs Test",
      user: {
        username: "test_user@test.com",
        email: "test_user@test.com",
      },
      picture: "/apian_logo.png",
      access_token: "test_token",
    },
    status: "authenticated",
  });
}

function getSessionAuthenticated() {
  getSession.mockReturnValue({
    data: {
      name: "Mrs Test",
      user: {
        username: "test_user@test.com",
        email: "test_user@test.com",
      },
      access_token: "test_token",
      ref: getCurrentEpochTime() + 100000,
    },
    status: "authenticated",
  });
}

function useSessionAuthenticatedWithProfile(profile) {
  useSession.mockReturnValue({
    data: {
      name: "Busy Bee",
      user: {
        email: "test_user@test.com",
        profile: profile,
      },
      ref: getCurrentEpochTime() + 100000,
    },
    status: "authenticated",
  });
}

function useSessionLoading() {
  useSession.mockReturnValue({
    data: {
      user: {
        username: "test_user@test.com",
      },
    },
    status: "loading",
  });
}

const mockFetchWithEmptyData = () => {
  return jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    );
};

const mockFetchWithError = (json = {}) => {
  return jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ ok: false, status: 500, json: () => json }),
    );
};

const mockFetchWithNoContent = () => {
  return jest
    .fn()
    .mockImplementation(() => Promise.resolve({ ok: true, status: 204 }));
};

const mockFetchWithData = (data) => {
  return jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(data) }),
    );
};

const mockSimplePostOrderSuccess = () => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () =>
        Promise.resolve({
          status: "success",
          message: "Order created successfully",
        }),
    }),
  );
};

const mockSimplePostOrderFailure = () => {
  return jest.fn().mockImplementation(() =>
    Promise.reject({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      message: "failed to create order",
    }),
  );
};

const mockSimpleCheckDuplicateOrderWarning = () => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(duplicateCheckOrderDataWithWarnings),
    }),
  );
};

const mockOrder = () => ({
  customer_reference: "order test ref",
  order_notes: "test order notes",
  code: "2c2a34a9-e24e-41da-86c0-eb67055d3b67",
  type: "3",
  status: "020",
  scheduled_earliest_source_departure_time: "2023-11-23T14:10:00Z",
  estimated_departure_time: null,
  actual_departure_time: null,
  scheduled_earliest_destination_arrival_time: "2023-11-23T14:20:00Z",
  estimated_earliest_recipient_arrival_time: null,
  actual_arrival_time: null,
  load_time: null,
  unload_time: null,
  vehicle_type: "D",
  canceled: false,
  priority: "U",
  transfer_request: "cc639888-ad51-4224-ae5e-24179926fd08",
  sender_location: {
    name: "Test A",
    code: "location_b",
    contact_name: "Contact A",
    scheduled_pickup_datetime: new Date(),
    coordinates: {
      lat: -0.027448,
      lon: -0.032633,
    },
  },
  recipient_location: {
    name: "Test B",
    code: "location_b",
    contact_name: "Contact B",
    coordinates: {
      lat: -0.006542,
      lon: 0.004216,
    },
  },
  loaded_by: null,
  unloaded_by: null,
  operator: "operator1",
  operator_name: "operator1",
  vehicle: null,
  status_history: [
    {
      status: "020",
      status_datetime: "2023-11-21T13:11:06.153333Z",
    },
    {
      status: "010",
      status_datetime: "2023-11-21T13:11:05.983630Z",
    },
  ],
  shipment_list: [
    {
      shipment_code: "761afdb6-319c-4631-a2fd-b738b3ef0a36",
    },
  ],
  payload: [
    {
      quantity: 2,
      code: "item1",
      name: "Insulin",
      dangerous_goods: false,
    },
    {
      quantity: 5,
      code: "item1",
      name: "Blood",
      dangerous_goods: true,
    },
  ],
  response_valid_at: "2023-11-21T13:31:44.827623Z",
});

const mockOperators = () => [
  { name: "Operator 1", code: "operator1" },
  { name: "Operator 2", code: "operator2" },
];

const mockItems = () => [
  {
    name: "Item 1",
    code: "item1",
    recipient_location_codes: ["A", "B", "D"],
  },
  { name: "Item 2", code: "item2", recipient_location_codes: ["A", "B"] },
  { name: "Item 3", code: "item3", recipient_location_codes: ["A"] },
];

const mockLocations = () => testLocationOptionsWithScheduleOpenAllDays;

const mockSenderLocations = () => testLocationOptionsWithScheduleOpenAllDays;

const mockRecipientLocations = () => [
  { name: "Test B", code: "B" },
  { name: "Test D", code: "D" },
];

const mockSenderRecipientMappings = () => [
  {
    code: "A",
    sender_name: "Test A",
    recipient_location_mappings: [{ name: "Test B", code: "B" }],
  },
  {
    code: "C",
    sender_name: "Test C",
    recipient_location_mappings: [{ name: "Test D", code: "D" }],
  },
];

const mockSignOut = () => {
  signOut.mockReturnValue({ error: null });
};

const mockTestProfileNoPicture = {
  name: "Test user",
  user: {
    email: "user@test.com",
  },
};

const mockTestProfileWithPicture = {
  picture: "/apian_logo.png",
  name: "Test user",
  user: {
    email: "user@test.com",
  },
};

export {
  getSessionAuthenticated,
  mockFetchWithData,
  mockFetchWithEmptyData,
  mockFetchWithError,
  mockFetchWithNoContent,
  mockItems,
  mockLocations,
  mockOperators,
  mockOrder,
  mockRecipientLocations,
  mockSenderLocations,
  mockSenderRecipientMappings,
  mockSignOut,
  mockSimpleCheckDuplicateOrderWarning,
  mockSimplePostOrderFailure,
  mockSimplePostOrderSuccess,
  mockTestProfileNoPicture,
  mockTestProfileWithPicture,
  useSessionAuthenticated,
  useSessionAuthenticatedWithPicture,
  useSessionAuthenticatedWithProfile,
  useSessionExpired,
  useSessionLoading,
  useSessionNotAuthed,
  useSessionOnUnauthenticated,
};
