import { Priority, RecurringOrderFrequency, VehicleType } from "@/lib/enums";

export const vehicleTypeOptions = [
  { name: "Drone", value: VehicleType.Drone },
  { name: "Van", value: VehicleType.Van },
  { name: "Other", value: VehicleType.Other },
];

export const priorityOptions = [
  { name: "Normal", value: Priority.Normal },
  { name: "Urgent", value: Priority.Urgent },
];

export const recurringFrequencyOptions = Object.entries(
  RecurringOrderFrequency,
).map(([key, value]) => ({
  name: key,
  value,
}));

export const recurringIntervalOptions = Array.from(
  { length: 10 },
  (_, index) => ({
    name: (index + 1).toString(),
    value: index + 1,
  }),
);

export const recurringCountOptions = Array.from({ length: 11 }, (_, index) => ({
  name: index.toString(),
  value: index + 1,
}));
