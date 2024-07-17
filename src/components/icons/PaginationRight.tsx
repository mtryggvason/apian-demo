import { SVGProps } from "@/components/icons/svgHelpers";

export const PaginationRight = (props: SVGProps) => (
  <svg
    width="13"
    height="8"
    viewBox="0 0 15 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 5L14 5M14 5L10.1 9M14 5L10.1 1"
      // stroke="#262626"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
