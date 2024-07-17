import { SVGProps } from "@/components/icons/svgHelpers";

export const RadioChecked = (props: SVGProps) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="7.5" cy="7.5" r="7.5" fill="#262626" />
    <circle cx="7.5" cy="7.5" r="3.5" fill="white" />
  </svg>
);
