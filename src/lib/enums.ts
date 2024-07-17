/* eslint-disable no-unused-vars */
enum UserProfile {
  None = "N",
  LogisticsViewOnly = "LVO",
  Logistics = "L",
  HealthcareViewOnly = "HVO",
  Healthcare = "H",
  ApianViewOnly = "AVO",
  Apian = "A",
}

export enum HealthCarePermissions {
  ViewOrders,
  CreateOrders,
  EditOrders,
  CancelOrders,
}

export { UserProfile };

export enum VehicleType {
  Drone = "D",
  Van = "V",
  Other = "O",
}

export enum Priority {
  Normal = "N",
  Urgent = "U",
}

export enum RecurringOrderFrequency {
  Hour = "HOURLY",
  Weekday = "WEEKDAYS",
  Day = "DAILY",
  Week = "WEEKLY",
}

export enum FeatureFlagsEnum {
  Test = "feature-example-test",
  OrderManagement = "order-management",
  SimulatorPage = "simulator-page",
  DeliveryCompleteImage = "delivery-complete-image",
  LiveVideoFeed = "live-video-feed",
}

export enum AlertPanelTypeEnum {
  Info = "info",
  Error = "error",
  Warning = "warning",
}
