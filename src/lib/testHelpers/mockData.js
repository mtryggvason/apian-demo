import {
  addMonths,
  nextFriday,
  nextSaturday,
  nextThursday,
  nextWednesday,
  setHours,
  setMinutes,
  startOfToday,
} from "date-fns";

export const transfersSimpleMockData = {
  requested_at: "2023-10-23T14:42:36.133605Z",
  transfer_count: 2,
  results: [
    {
      code: "06405f7f-f9ce-4783-91ed-123a779222ae",
      status: "100",
      priority: "N",
    },
    {
      code: "0b51a711-f4dc-4f60-83c5-4f9694f7e80f",
      status: "100",
      priority: "N",
    },
  ],
};

export const transferDetailSimpleMockData = {
  code: "06405f7f-f9ce-4783-91ed-123a779222ae",
  source_location: {
    code: "22e3da9a-0797-4db1-af2a-4da6463f92c7",
    coordinates: {
      lat: -9.012602,
      lon: 38.848017,
    },
    location_name: "Test Location #1",
  },
  destination_location: {
    code: "e134e1d1-040e-49fc-ab33-2aee9fcc8537",
    coordinates: {
      lat: -7.757607,
      lon: 37.258436,
    },
    location_name: "Test Location #2",
  },
};

export const locationsMockData = [
  {
    code: "22e3da9a-0797-4db1-af2a-4da6463f92c7",
    location_name: "Test Location #1",
    location_type: "040",
    coordinates: {
      lat: -9.012602,
      lon: 38.848017,
    },
    altitude: 0,
    location_contact_details: "",
  },
  {
    code: "e134e1d1-040e-49fc-ab33-2aee9fcc8537",
    location_name: "Test Location #2",
    location_type: "100",
    coordinates: {
      lat: -7.757607,
      lon: 37.258436,
    },
    altitude: 0,
    location_contact_details: "",
  },
];

export const locationsEndpointMockData = {
  links: { next: null, previous: null },
  page: 1,
  page_size: 10,
  count: 5,
  results: locationsMockData,
};

export const testLocation1 = {
  lat: 51.499421,
  lon: -0.118884,
};
export const testLocation2 = {
  lat: 51.504044,
  lon: -0.086691,
};

export const testTransferData = [
  {
    code: "f23b792c-57f4-4c1d-ab76-b2b3999e531a",
    status: "110",
    priority: "U",
    created_at: "2023-10-18T10:09:37.482652Z",
    created_by: "katie@test.com",
    operator: "96d2b991-3c5d-48d6-90e1-65af390245d1",
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    item_operator_safe_names: "Dummy payload",
    shipment: null,
    dangerous_goods: null,
    status_description: "Arrived at destination",
    priority_description: "Urgent",
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Site B",
      code: "a77e39d4-b08c-4f78-a271-895839e418d8",
      coords: [-74.71171874999999, 40.073139502837364],
      scheduled_earliest_source_departure_time: "2023-10-18T10:10:00Z",
      estimated_earliest_source_departure_time: "2023-10-18T10:10:00Z",
      actual_source_departure_time: "2023-10-18T10:15:00Z",
    },
    destination_location: {
      name: "James Cook Hospital",
      code: "65ae4b87-0cd9-4dd9-88e1-e97fc35396f0",
      coords: [-1.3726336055559385, 54.64509911863866],
      scheduled_earliest_destination_arrival_time: "2023-10-18T10:35:00Z",
      estimated_earliest_destination_arrival_time: "2023-10-18T10:35:00Z",
      actual_destination_arrival_time: "2023-10-18T10:30:00Z",
    },
  },
  {
    code: "c7eebd6d-8a4b-47bf-a663-d3d31de51825",
    status: "100",
    priority: "N",
    created_at: "2023-10-18T10:03:12.417248Z",
    created_by: "katie@test.com",
    operator: "96d2b991-3c5d-48d6-90e1-65af390245d1",
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    item_operator_safe_names: "Dummy payload",
    shipment: null,
    dangerous_goods: null,
    status_description: "Transfer cancelled by Apian",
    priority_description: "Normal",
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Site A",
      code: "b32cdc5e-6120-471d-9297-5953de4259d1",
      coords: [132.84140624999998, -24.70824598259412],
      scheduled_earliest_source_departure_time: "2023-10-18T12:00:00Z",
      estimated_earliest_source_departure_time: null,
      actual_source_departure_time: null,
    },
    destination_location: {
      name: "James Cook Hospital",
      code: "54441bff-d278-427d-ab57-7b8cebcf889f",
      coords: [-1.35747582142966, 54.69422801408879],
      scheduled_earliest_destination_arrival_time: "2023-10-18T12:30:00Z",
      estimated_earliest_destination_arrival_time: null,
      actual_destination_arrival_time: null,
    },
  },
  {
    code: "ff8ab266-cff0-4bf5-9447-ae0a6e5949df",
    status: "100",
    priority: "N",
    created_at: "2023-10-18T10:00:05.269532Z",
    created_by: "katie@test.com",
    operator: "96d2b991-3c5d-48d6-90e1-65af390245d1",
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    shipment: null,
    item_operator_safe_names: "Dummy payload",
    dangerous_goods: null,
    status_description: "Pending",
    priority_description: "Normal",
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Supply Store",
      code: "1fe30f74-632c-4827-8dcb-1d8a8fc4573c",
      coords: [-1.4440792901252164, 54.70890379775688],
      scheduled_earliest_source_departure_time: "2023-10-18T15:00:00Z",
      estimated_earliest_destination_arrival_time: null,
      actual_source_departure_time: null,
    },
    destination_location: {
      name: "James Cook Hospital",
      code: "65ae4b87-0cd9-4dd9-88e1-e97fc35396f0",
      coords: [-1.3726336055559385, 54.64509911863866],
      scheduled_earliest_destination_arrival_time: "2023-10-18T15:30:00Z",
      estimated_earliest_destination_arrival_time: null,
      actual_destination_arrival_time: null,
    },
  },
  {
    code: "a6c1914e-d66b-4c77-ad52-b0c8932e2eb2",
    status: "110",
    priority: "N",
    created_at: "2023-10-18T09:56:54.978828Z",
    created_by: "katie@test.com",
    operator: "96d2b991-3c5d-48d6-90e1-65af390245d1",
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    shipment: null,
    item_operator_safe_names: "Dummy payload",
    dangerous_goods: null,
    status_description: "Arrived at destination",
    priority_description: "Normal",
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Supply Store",
      code: "1fe30f74-632c-4827-8dcb-1d8a8fc4573c",
      coords: [-1.4440792901252164, 54.70890379775688],
      scheduled_earliest_source_departure_time: "2023-10-18T07:00:00Z",
      estimated_source_departure_time: null,
      actual_source_departure_time: "2023-10-18T07:10:00Z",
    },
    destination_location: {
      name: "James Cook Hospital",
      code: "54441bff-d278-427d-ab57-7b8cebcf889f",
      coords: [-1.35747582142966, 54.69422801408879],
      scheduled_earliest_destination_arrival_time: "2023-10-18T07:30:00Z",
      estimated_earliest_destination_arrival_time: "2023-10-18T07:30:00Z",
      actual_destination_arrival_time: "2023-10-18T07:32:00Z",
    },
  },
  {
    code: "27c5f081-e0d8-4e03-b4b7-9d9e821e3d24",
    status: "100",
    priority: "N",
    created_at: "2023-09-26T15:25:37.864041Z",
    created_by: "katie@test.com",
    operator: null,
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    shipment: null,
    item_operator_safe_names: "Dummy payload",
    dangerous_goods: true,
    status_description: null,
    priority_description: null,
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Supply Store",
      code: "b32cdc5e-6120-471d-9297-5953de4259d1",
      coords: [132.84140624999998, -24.70824598259412],
      scheduled_earliest_source_departure_time: null,
      estimated_source_departure_time: null,
      actual_source_departure_time: null,
    },
    destination_location: {
      name: "North Tees",
      code: "a77e39d4-b08c-4f78-a271-895839e418d8",
      coords: [-74.71171874999999, 40.073139502837364],
      scheduled_earliest_destination_arrival_time: null,
      estimated_earliest_destination_arrival_time: "2023-10-18T12:00:00Z",
      actual_destination_arrival_time: null,
    },
  },
  {
    code: "27c5f081-e0d8-4e93-b4b7-9d9e821e3d24",
    status: "100",
    priority: "N",
    created_at: "2023-09-31T15:25:37.864041Z",
    created_by: "katie@test.com",
    operator: null,
    operator_name: "Wing",
    current_location: null,
    current_location_confidence: null,
    shipment: null,
    item_operator_safe_names: "Dummy payload",
    dangerous_goods: true,
    status_description: null,
    priority_description: null,
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Supply Store",
      code: "b32cdc5e-6120-471d-9297-5953de4259d1",
      coords: [132.84140624999998, -24.70824598259412],
      scheduled_earliest_source_departure_time: "2023-10-30T12:00:00Z",
      estimated_source_departure_time: "2023-10-30T12:00:00Z",
      actual_source_departure_time: null,
    },
    destination_location: {
      name: "North Tees",
      code: "a77e39d4-b08c-4f78-a271-895839e418d8",
      coords: [-74.71171874999999, 40.073139502837364],
      scheduled_earliest_destination_arrival_time: "2023-10-31T12:00:00Z",
      estimated_earliest_destination_arrival_time: "2023-10-31T12:00:00Z",
      actual_destination_arrival_time: null,
    },
  },
];

//combined transfer and tracking data for slide panel page due to two separate SWRs in its children
export const combinedTransferAndTrackingTestData = {
  code: "100-200",
  response_valid_at: "2024-02-21T12:00:00Z",
  status: "140",
  tracking: {
    code: "123-456",
    current_heading: 1,
    current_position: { lat: 51.499421, lon: -0.118884 },
    current_velocity: 5,
    flight_path_coordinates: [
      [-0.110884, 51.499421],
      [-0.118884, 51.499421],
      [-0.118884, 51.499421],
    ],
    id: 1,
    last_polling_time: "2024-02-21T12:00:00Z",
  },
  destination_location: {
    name: "St Thomas",
    coordinates: { lat: 52.499421, lon: -0.119884 },
  },
  source_location: {
    name: "Guys Hospital",
    coordinates: { lat: 50.499421, lon: -0.110884 },
  },
  scheduled_earliest_source_departure_time: "2024-02-21T16:00:00Z",
  status_history: [
    { status: 140, status_datetime: "2024-02-19T06:43:42.942819Z" },
  ],
  operator_name: "OperatorXYZ",
};

export const duplicateCheckOrderDataWithWarnings = {
  errors: [],
  ok: true,
  warnings: [{ title: "Warning title", description: "Warning description" }],
  response_valid_at: "",
};

export const ordersMockData = [
  {
    code: "64fd16d1-a863-4a89-bf44-e4e5f5ebe514",
    order_notes: "",
    type: "3",
    sender_location: {},
    recipient_location: {},
    source_location: {
      name: "Guy's",
    },
    destination_location: {
      name: "St. Thomas",
    },
    type_description: "Transfer Order",
    status: 100,
  },
  {
    code: "02f85aa0-8456-4104-81a4-1983a94ae4c7",
    order_notes: "",
    type: "3",
    sender_location: {},
    recipient_location: {},
    source_location: {
      name: "Wing Test (source)",
    },
    destination_location: {
      name: "Wing Test (destination)",
    },
    type_description: "Transfer Order",
    status: 100,
  },
];

export const todayAtMidnight = startOfToday();

const wedAt930 = setMinutes(setHours(nextWednesday(todayAtMidnight), 9), 30);

const thursAt12 = setMinutes(setHours(nextThursday(todayAtMidnight), 12), 0);
const friAt1945 = setMinutes(setHours(nextFriday(todayAtMidnight), 19), 45);
const satAt930 = setMinutes(setHours(nextSaturday(todayAtMidnight), 9), 30);

export const mockWedHours = [
  setMinutes(setHours(wedAt930, 8), 0),
  setMinutes(setHours(wedAt930, 18), 0),
];
export const mockThursHours = [
  setMinutes(setHours(thursAt12, 0), 0),
  setMinutes(setHours(thursAt12, 23), 59),
];

export const mockFriHours = [
  setMinutes(setHours(friAt1945, 10), 10),
  setMinutes(setHours(friAt1945, 11), 50),
];

export const mockSatHours = [
  setMinutes(setHours(satAt930, 9), 30),
  setMinutes(setHours(satAt930, 17), 45),
];

export const recurringOrderDates = [wedAt930, thursAt12, friAt1945, satAt930];

const wedAt930PlusMonth = nextWednesday(addMonths(wedAt930, 1));
const thursAt12PlusMonth = nextThursday(addMonths(thursAt12, 1));
const friAt1945PlusMonth = nextFriday(addMonths(friAt1945, 1));
const satAt930PlusMonth = nextSaturday(addMonths(satAt930, 1));

export const recurringOrderDatesPlusOneMonth = [
  wedAt930PlusMonth,
  thursAt12PlusMonth,
  friAt1945PlusMonth,
  satAt930PlusMonth,
];

export const mockSenderSchedule = {
  schedule: {
    0: { end: "18:00:00", open: true, start: "08:00:00" },
    1: { end: "18:00:00", open: true, start: "08:00:00" },
    2: { end: "18:00:00", open: true, start: "08:00:00" },
    3: { end: "18:00:00", open: true, start: "08:00:00" },
    4: { end: "18:00:00", open: true, start: "08:00:00" },
    5: { end: "17:00:00", open: false, start: "09:00:00" },
    6: { end: "17:00:00", open: false, start: "09:00:00" },
  },
  schedule_description: "08:00 - 18:00, Monday - Friday",
};

export const mockSenderScheduleDiffTimes = {
  schedule: {
    0: { end: "17:00:00", open: true, start: "09:00:00" },
    1: { end: "16:30:00", open: true, start: "12:30:00" },
    2: { end: "18:00:00", open: true, start: "08:00:00" },
    3: { end: "23:59:00", open: true, start: "00:00:00" },
    4: { end: "11:50:00", open: true, start: "10:10:00" },
    5: { end: "17:45:00", open: true, start: "09:30:00" },
    6: { end: "17:00:00", open: false, start: "09:00:00" },
  },
  schedule_description: "We're open different times on different days",
};

export const mockSenderScheduleOpenAllDays = {
  schedule: {
    0: { end: "17:00:00", open: true, start: "09:00:00" },
    1: { end: "17:00:00", open: true, start: "09:00:00" },
    2: { end: "17:00:00", open: true, start: "09:00:00" },
    3: { end: "17:00:00", open: true, start: "09:00:00" },
    4: { end: "17:00:00", open: true, start: "09:00:00" },
    5: { end: "17:00:00", open: true, start: "09:00:00" },
    6: { end: "17:00:00", open: true, start: "09:00:00" },
  },
  schedule_description: "09:00 - 17:00, Monday - Sunday",
};

export const mockSenderScheduleOpenAllHours = {
  schedule: {
    0: { end: "23:59:00", open: true, start: "00:00:00" },
    1: { end: "23:59:00", open: true, start: "00:00:00" },
    2: { end: "23:59:00", open: true, start: "00:00:00" },
    3: { end: "23:59:00", open: true, start: "00:00:00" },
    4: { end: "23:59:00", open: true, start: "00:00:00" },
    5: { end: "23:59:00", open: true, start: "00:00:00" },
    6: { end: "23:59:00", open: true, start: "00:00:00" },
  },
  schedule_description: "Open 24/7",
};

export const mockSenderScheduleWeekend = {
  schedule: {
    0: { end: "18:00:00", open: false, start: "08:00:00" },
    1: { end: "18:00:00", open: false, start: "08:00:00" },
    2: { end: "18:00:00", open: false, start: "08:00:00" },
    3: { end: "18:00:00", open: false, start: "08:00:00" },
    4: { end: "18:00:00", open: false, start: "08:00:00" },
    5: { end: "17:00:00", open: true, start: "09:00:00" },
    6: { end: "17:00:00", open: true, start: "09:00:00" },
  },
  schedule_description: "08:00 - 18:00, Saturday - Sunday",
};

export const testLocationOptionsWithScheduleOpenAllDays = [
  {
    code: "A",
    name: "Test A",
    schedule: mockSenderScheduleOpenAllDays.schedule,
    schedule_description: mockSenderScheduleOpenAllDays.schedule_description,
  },
  {
    code: "B",
    name: "Test B",
    schedule: mockSenderScheduleOpenAllDays.schedule,
    schedule_description: mockSenderScheduleOpenAllDays.schedule_description,
  },
  {
    code: "C",
    name: "Test C",
    schedule: mockSenderScheduleOpenAllHours.schedule,
    schedule_description: mockSenderScheduleOpenAllHours.schedule_description,
  },
  {
    code: "D",
    name: "Test D",
    schedule: mockSenderScheduleOpenAllHours.schedule,
    schedule_description: mockSenderScheduleOpenAllHours.schedule_description,
  },
];

export const testLocationOptionsWithSchedule = [
  {
    code: "A",
    name: "Test A",
    schedule: mockSenderSchedule.schedule,
    schedule_description: mockSenderSchedule.schedule_description,
  },
  {
    code: "B",
    name: "Test B",
    schedule: mockSenderSchedule.schedule,
    schedule_description: mockSenderSchedule.schedule_description,
  },
];

export const mockTransfersNullValues = [
  {
    code: "123",
    status: "140",
    priority: "N",
    created_at: "2023-10-18T10:03:12.417248Z",
    created_by: "katie@test.com",
    operator: "96d2b991-3c5d-48d6-90e1-65af390245d1",
    operator_name: "Wing",
    item_operator_safe_names: "Dummy payload",
    status_description: "Transfer cancelled by Apian",
    priority_description: "Normal",
    type_description: "Transfer",
    max_departure_wait_duration: 20,
    source_location: {
      name: "Supply Store",
      code: "b32cdc5e-6120-471d-9297-5953de4259d1",
      coords: [132.84140624999998, -24.70824598259412],
      scheduled_earliest_source_departure_time: "2023-10-30T12:00:00Z",
      estimated_source_departure_time: null,
    },
    destination_location: {
      name: "James Cook Hospital",
      code: "54441bff-d278-427d-ab57-7b8cebcf889f",
      coords: [-1.35747582142966, 54.69422801408879],
      scheduled_earliest_destination_arrival_time: null,
      estimated_earliest_destination_arrival_time: null,
    },
  },
];

export const locationWithCameraMockData = {
  code: "22e3da9a-0797-4db1-af2a-4da6463f92c7",
  location_name: "Test Location #1",
  location_type: "040",
  coordinates: {
    lat: -9.012602,
    lon: 38.848017,
  },
  altitude: 0,
  location_contact_details: "",
  camera: {
    code: "123",
    name: "test camera",
    description: "camera for test location",
  },
};
