const transfersEndpoint = "transfers/";
const itemsEndpoint = "items/";
const locationsEndpoint = "locations/";
const senderLocationsEndpoint = locationsEndpoint + "sender/";
const senderRecipientLocationMappingsEndpoint =
  senderLocationsEndpoint + "recipient-mappings/";
const recipientLocationsEndpoint = locationsEndpoint + "recipient/";
const sourceLocationsEndpoint = locationsEndpoint + "source/";
const destinationLocationsEndpoint = locationsEndpoint + "destination/";
const operatorsEndpoint = "operators/";
const ordersEndpoint = "orders/";
const nextOrderEndpoint = ordersEndpoint + "next-delivery/";
const simpleOrderEndpoint = ordersEndpoint + "simple/";
const simpleOrderCheckEndpoint = simpleOrderEndpoint + "check/";
const googleAuthEndpoint = "auth/google/";
const tokenRefreshEndpoint = "auth/token/refresh/";
const userProfileEndpoint = "auth/user/";
const transfersProximityEndpoint = transfersEndpoint + "proximity/";

const transferTrackingEndpoint = (code: string) => {
  return transfersEndpoint + `${code}` + "/track";
};

const statsTransfersEndPoint = "stats/" + transfersEndpoint;

const statsTransfersInFlightEndpoint = statsTransfersEndPoint + "in-flight/";

const statsTransfersCo2Endpoint = statsTransfersEndPoint + "co2/";

const statsTransfersAvgDispatchTimeEndpoint =
  statsTransfersEndPoint + "average-dispatch-time/";

const statsTransfersMinsSavedEndpoint =
  statsTransfersEndPoint + "minutes-saved/";

const statsTransfersMinsDelayedEndpoint =
  statsTransfersEndPoint + "minutes-delayed/";

const statsTransfersCompletedEndpoint = statsTransfersEndPoint + "completed/";

export const PREVIOUS = "previous";
export const UPCOMING = "upcoming";
export const PAGE = "page";
export const PAGE_SIZE = "page_size";
export const ORDERING = "ordering";
export const SMALL_PAGE_SIZE = "10";
export const DEFAULT_PAGE_SIZE = "80";
const statsTransfersDestinationDeliveriesWeekEndpoint =
  statsTransfersEndPoint + "destination-deliveries-week/";

export {
  destinationLocationsEndpoint,
  googleAuthEndpoint,
  itemsEndpoint,
  locationsEndpoint,
  nextOrderEndpoint,
  operatorsEndpoint,
  ordersEndpoint,
  recipientLocationsEndpoint,
  senderLocationsEndpoint,
  senderRecipientLocationMappingsEndpoint,
  simpleOrderCheckEndpoint,
  simpleOrderEndpoint,
  sourceLocationsEndpoint,
  statsTransfersAvgDispatchTimeEndpoint,
  statsTransfersCo2Endpoint,
  statsTransfersCompletedEndpoint,
  statsTransfersDestinationDeliveriesWeekEndpoint,
  statsTransfersEndPoint,
  statsTransfersInFlightEndpoint,
  statsTransfersMinsDelayedEndpoint,
  statsTransfersMinsSavedEndpoint,
  tokenRefreshEndpoint,
  transfersEndpoint,
  transfersProximityEndpoint,
  transferTrackingEndpoint,
  userProfileEndpoint,
};
