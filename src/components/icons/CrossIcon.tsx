import { SVGProps } from "./svgHelpers";

export const CrossIcon = (props: SVGProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 25 25"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-[22px] w-[22px] stroke-apian-dark-grey hover:stroke-apian-red"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);
