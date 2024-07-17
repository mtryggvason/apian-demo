import { SVGProps } from "@/components/icons/svgHelpers";
export const CircleError = (props: SVGProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="1" y="1" width="30" height="30" rx="15" fill="#FF644F" />
    <rect
      x="1"
      y="1"
      width="30"
      height="30"
      rx="15"
      stroke="#FF644F"
      strokeWidth="2"
    />
    <path
      d="M11 21L21 11M11 11L21 21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
