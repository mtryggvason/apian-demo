import { SVGProps } from "./svgHelpers";

export const CaretDown = (props: SVGProps) => (
  <svg
    {...props}
    width="13"
    height="7"
    viewBox="0 0 13 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 6L6.5 1L12 6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
