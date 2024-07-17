//Login page
export const LOGIN_TITLE = "Log in to Apian platform";
export const LOGIN_GOOGLE_TEXT = "Sign in with Google";
export const LOGIN_NHS_TEXT = "Continue with NHS login";
export const EMAIL_TXT = "Email";
export const PASSWORD_TXT = "Password";
export const FORGOT_TXT = "Forgot password";
export const LOGIN_TXT = "LOG IN";

//transfer page
export const DAILY_SCHEDULE_TITLE = "Daily schedule";
export const VIEW_ALL_DESTINATIONS_TXT = "View all destinations";

// locations directory page
export const ALL_DESTINATIONS_TITLE = "All destinations";
export const DELIVERIES_THIS_WEEK_TXT = "deliveries this week";
export const LIVE_FEED_TXT = "Live feed";

//transfer locations page
export const BACK_TO_SCHEDULE_TXT = "Back to schedule";
export const MAP_VIEW_BUTTON_TXT = "Map view";
export const LIVE_FEED_BUTTON_TXT = "Live feed";
export const COULD_NOT_LOAD_STREAM = "Could not load stream";
export const TRYING_TO_CONNECT = "Trying to connect...";

//stats cards
export const COMPLETED_TRANSFERS_TXT = "Transfers completed";
export const IN_FLIGHT_TXT = "Drones in flight";
export const TIME_SAVED_TXT = "Time saved";
export const CO2_SAVED_TXT = "CO2 saved";
export const AVG_DISPATCH_TXT = "Avg. despatch time";
//note spelling despatch is intentional (UK variant and the spelling on figma)
//I've kept any other uses to be "dispatch" in our code, as this is what is in our backend to try and reduce confusion/mistakes

//day selector card
export const CHOOSE_DATE_TXT = "Choose date";

//transfer tables
export const UPCOMING_TRANSFERS_TITLE = "Upcoming transfers";
export const PREV_TRANSFERS_TITLE = "Previous transfers";
export const NO_UPCOMING_TRANSFERS_TXT = "No upcoming transfers";
export const NO_PREVIOUS_TRANSFERS_TXT = "No previous transfers";
// order tables
export const UPCOMING_ORDERS_TITLE = "Upcoming orders";
export const PREV_ORDERS_TITLE = "Previous orders";
export const NO_UPCOMING_ORDERS_TXT = "No deliveries scheduled";
export const NO_PREV_ORDERS_TXT = "No previous orders";

//London/Ireland toggle
export const LDN_TXT = "London";
export const DUBLIN_TXT = "Dublin";
export const NORTHUMBERLAND_TXT = "Northumberland";
export const ALL_LOCATIONS_TXT = "All locations";
export const LOCATION_BTN_TXT = "Location";

//search bar
export const SEARCH_TRANSFERS_TXT = "Search transfers";
export const SEARCH_TODAY_TRANSFERS_TXT = "Search today's transfers";

// orders / order detail
export const ORDER_PAGE_TITLE = "Orders";
export const ORDER_DETAIL_PAGE_TITLE = "Order details";
export const NONE_PROVIDED_TXT = "(none provided)";
export const NEXT_ORDER_TITLE = "Next delivery";
export const EST_TXT = "est.";
export const DUE_TXT = "Due";
export const EST_ARRIVAL_TXT = "Est. arrival:";
export const ORDER_CONTENTS_TXT = "Order contents";
export const SENDER_TXT = "Sender";
export const RECIPIENT_TXT = "Recipient";
export const CUSTOMER_REF_TXT = "Customer reference";
export const SCHEDULED_PICKUP_TXT = "Scheduled pickup";
export const DELIVERY_TIME_TXT = "Delivery time";
export const ITEMS_TXT = "Items";
export const QUANTITY_TXT = "Quantity";
export const ADDITIONAL_DETAILS_TXT = "Additional details";
export const ORDER_REFERENCE_TXT = "Order reference";
export const ORDER_NOTES_TXT = "Order notes";
export const ORDER_CREATED_AT_TXT = "Order created on";
export const PICKUP_FROM_TXT = "Pickup from";
export const PICKUP_FOR_TXT = "for";
export const SHIPMENT_DEPARTED_TXT = "Shipment departed";
export const SHIPMENT_ARRIVED_TXT = "Shipment arrived";
export const CANCELLED_BY_TXT = "Cancelled by";
export const CANCELLED_BY_OPERATOR_TXT = "Transfer was cancelled by operator";
export const REJECTED_BY_OPERATOR_TXT = "Transfer was rejected by operator";
export const FAILED_BY_OPERATOR_TXT = "Transfer was failed by operator";
export const FAILED_REQ_WITH_OPERATOR_TXT =
  "Failed to request transfer with operator";
export const ORDER_UPDATES_TXT = "Order updates";
export const CANCEL_REASON_TXT = "Reason:";
export const BACK_TO_ORDERS_TXT = "Back to orders";
export const REASON_FOR_CANCELLING_TXT = "Reason for cancelling";
export const ORDER_WHERE_WHEN_TITLE = "Where & when";
export const APIAN_ORDER_ID_TXT = "Apian order ID";
export const ORDER_CANCELLED_TXT = "Order cancelled";
export const ORDER_WAS_CANCELED_ON = "This order was cancelled on";
export const BY_TXT = "by";
export const ORDER_CANCELED_REASON_GIVEN = "Reason given";
export const DUPLICATE_ORDER_BTN_TXT = "Duplicate order";

// cancel order form / popover
export const ORDER_NOT_REQ_TXT = "No longer required";
export const ORDER_DETAILS_INCORRECT_TXT = "Details are incorrect";
export const ACCIDENTAL_DUPLICATE_ORDER_TXT = "Accidental duplicate order";
export const ORDER_NEEDS_RESCHEDULE_TXT = "Needs to be rescheduled";
export const CANCEL_SCHEDULED_ORDER_TITLE = "Cancel scheduled order?";
export const CANCEL_SCHEDULED_ORDER_INFO_TXT =
  "You will permanently cancel this order.";
export const CANCEL_ORDER_BUTTON_TXT = "Cancel order";
export const CANCEL_GO_BACK_BUTTON_TXT = "Go back";
export const ORDER_CANT_CANCEL_TXT =
  "Order cannot be cancelled as it is already in transit to the destination";

//Create order form
export const CREATE_ORDER_TITLE = "Create a new order";
export const SELECT_TXT = "Select";
//Create order form - where and when section
export const WHERE_WHEN_TITLE = "Where & when";
export const SENDER_LABEL_TXT = "Sender";
export const SENDER_NAME_TXT = "Sender name";
export const RECIPIENT_LABEL_TXT = "Recipient";
export const RECIPIENT_NAME_TXT = "Recipient name";
export const OPTIONAL_NAME_FIELD_TXT = "(Optional)";
export const CHECKBOX_LABEL_TXT = "Ready for pickup";
export const DATE_TIME_INPUT_LABEL_TXT = "Schedule pickup for";

//Create order form - order contents section
export const ORDER_CONTENTS_TITLE = "Order contents";
export const CUST_REF_LABEL_TXT = "Order reference";
export const CUST_REF_EXTRA_LABEL_TXT = "(Optional)";
export const OPTIONAL_FIELD_LABEL_TXT = "Optional";
export const ITEMS_LABEL_TXT = "Items";
export const QUANTITY_LABEL_TXT = "Quantity";
export const ADD_ITEM_TXT = "Add item";
export const CUST_REF_PLACEHOLDER_TXT = "e.g 23-HST150";

//Create order form - recurring order section
export const REC_ORDER_TITLE = "Duplicate order";
export const REC_ORDER_INT_TXT = "Schedule every";
export const REC_ORDER_COUNT_TXT = "Duplicate this order";
export const REC_ORDER_TIME_TXT = "time(s)";
export const REC_ORDERS_DISABLED_TXT = `Duplicate orders are not possible if 'Ready for pickup' is selected.`;
export const ENABLE_REC_ORDERS_TXT =
  "Please choose a scheduled pickup time above to enable.";
export const SCHEDULED_REC_ORDERS_TXT = "This will create";
export const SCHEDULED_REC_ORDERS_TOTAL_TXT = "orders in total";

//Create order form - addtional details section
export const ADDITIONAL_DETAILS_TITLE = "Additional details";
export const ORDER_NOTES_LABEL_TXT = "Order notes";
export const ORDER_NOTES_EXTRA_LABEL_TXT = "Only visible in Apian platform";
export const ORDER_NOTES_PLACEHOLDER_TXT =
  "e.g. Submitted on behalf of Dr. J Bloggs";
//Create order form - review and order section
export const SIMILAR_ORDER_ALERT_TITLE = "Similar order already exists";
export const SIMILAR_ORDERS_ALERT_TITLE = "Similar orders already exist";
export const SIMILAR_ORDER_MSG_TXT =
  "An order with the same sender, recipient and contents is already scheduled for this time";
export const SIMILAR_ORDER_AT_MSG_TXT =
  "An order with the same sender, recipient and contents is already scheduled for";
export const SIMILAR_NUM_ORDERS_MSG_TXT =
  "orders with the same sender, recipient and contents are already scheduled for this time";
export const SIMILAR_NUM_ORDERS_INCLUDING_MSG_TXT =
  "orders with the same sender, recipient and contents are already scheduled close to this time";
export const SIMILAR_ORDER_QUESTION_TXT =
  "Are you sure you want to place the order again?";
export const EARLIER_TXT = "earlier";
export const LATER_TXT = "later";
export const PLACE_SIMILAR_ORDER_TXT = "Place order anyway";
export const CHANGE_SIMILAR_ORDER_TXT = "Go back and edit";
export const REVIEW_ORDER_INFO_TXT =
  "Ensure all information is correct and no patient data has been disclosed before proceeding";
export const FAILED_SUBMISSION_TXT = "Your order could not be scheduled";
export const FAILED_SUBMISSION_CONTACT_TXT = `Sorry, it was not possible to place your order due to a network issue. Please try again below. If the problem persists contact Apian support directly on`;
export const CREATE_1_ORDER_BUTTON_TXT = "Create order";
//Create order loading
export const CREATE_NEW_ORDER_TXT = "Create a new order";
export const CREATING_ORDER_TXT = "Creating order";
export const REQ_TO_OPERATOR_TXT = "Placing request with operator";
export const ORDER_CREATED_TXT = "Order created";
export const ORDERS_CREATED_TXT = "Orders created";
export const CREATE_ANOTHER_ORDER_TXT = "Create another order";
export const VIEW_ORDER_TXT = "View order";

//orders dashboard
export const NEW_ORDER_TXT = "Create new order";

// transfer status history
export const DEPARTURE_SCHEDULED_FOR_TXT = "Departure scheduled for";
export const ESTIMATED_ARRIVAL_TIME_TXT = "Estimated arrival time";
export const DELIVERY_ARRIVED_AT_DESTINATION_TXT =
  "Delivery arrived at destination";
export const DELIVERY_SITE_IMAGE_CAPTURED_AT = "Delivery site image captured";

// Simulator
export const SIMULATOR_PAGE_TITLE = "Apian Flight Simulator";
export const SIMULATOR_PAGE_EXPLANATION =
  "This is the Apian drone flight simulator. Track orders in NHS drone delivery network. Find out more about this simulator ";
export const SIMULATOR_PAGE_FAQ_LINK = "below";

// Welcome Page
export const WELCOME_PAGE_BEING_PREPARED_TXT =
  "Welcome to Apian’s platform! You’ve successfully logged in and your account is being prepared. We’ll be in touch shortly to let you know when it’s ready.";
export const WELCOME_PAGE_QUESTIONS_TXT =
  "If you’ve any questions in the meantime, please get in touch via";
// profile
export const PROFILE_SIGN_OUT_BUTTON_TXT = "Sign out";
export const PROFILE_REPORT_BUG_BUTTON_TXT = "Report bug";

// status messages
export const FAILED_LOAD_DATA_RETRYING_TXT =
  "Failed to load data\n Retrying in";
export const LAST_UPDATED_TXT = "Last updated:";
export const AGO_TXT = "ago";
export const ZERO_SECONDS_TXT = "0 seconds";

// error page
export const BACK_TO_PREVIOUS_PAGE = "Back to previous page";

// support
export const APIAN_SUPPORT_PHONE = "+44 20 7170 4439";
export const APIAN_SUPPORT_EMAIL = "support@apian.aero";
