import { SVGProps } from "@/components/icons/svgHelpers";
export const GlobeIcon = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g stroke="currentColor" clipPath="url(#clip0_56_25)">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.75"
        d="M5.813 15l2.625-2.625 2.187.438h2.188v.437M1.438 4.938l1.75 1.312.437-1.313 1.75-.875V1m6.125.875L9.75 3.188l.875.437 2.625-.438m0 .438l-.875 1.313h-1.75L9.75 6.25l.438.875H11.5l.875 3.5L15 7.125M3.187 8.438l1.313.437.438 3.063 2.625-4.376L4.938 6.25l-1.75.438v1.75z"
      ></path>
      <circle cx="8" cy="8" r="7.5"></circle>
    </g>
    <defs>
      <clipPath id="clip0_56_25">
        <path fill="currentColor" d="M0 0H16V16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
