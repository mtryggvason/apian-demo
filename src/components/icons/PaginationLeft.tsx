import { SVGProps } from "@/components/icons/svgHelpers";

export const PaginationLeft = (props: SVGProps) => (
  <svg
    width="13"
    height="8"
    viewBox="0 0 16 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 5L1 5M1 5L5.2 1M1 5L5.2 9"
      // stroke="#CBCAC9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
