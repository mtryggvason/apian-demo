import { SVGProps } from "./svgHelpers";

const Calendar = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M5.66667 5.45833V2.625M11.3333 5.45833V2.625M4.95833 8.29167H12.0417M3.54167 15.375H13.4583C13.8341 15.375 14.1944 15.2257 14.4601 14.9601C14.7257 14.6944 14.875 14.3341 14.875 13.9583V5.45833C14.875 5.08261 14.7257 4.72228 14.4601 4.4566C14.1944 4.19092 13.8341 4.04167 13.4583 4.04167H3.54167C3.16594 4.04167 2.80561 4.19092 2.53993 4.4566C2.27426 4.72228 2.125 5.08261 2.125 5.45833V13.9583C2.125 14.3341 2.27426 14.6944 2.53993 14.9601C2.80561 15.2257 3.16594 15.375 3.54167 15.375Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Calendar;