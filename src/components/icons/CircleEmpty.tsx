import { SVGProps } from "@/components/icons/svgHelpers";
export const CircleEmpty = (props: SVGProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="31"
      y="1"
      width="30"
      height="30"
      rx="15"
      transform="rotate(90 31 1)"
      fill="white"
    />
    <rect
      x="31"
      y="1"
      width="30"
      height="30"
      rx="15"
      transform="rotate(90 31 1)"
      stroke="#CBCAC9"
      strokeWidth="2"
    />
  </svg>
);
