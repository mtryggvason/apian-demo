import { SVGProps } from "@/components/icons/svgHelpers";

const PackageCheck = (props: SVGProps) => (
  <svg
    className="h-[32px] w-[40px]"
    width="52"
    height="44"
    viewBox="0 0 52 44"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="3.20508"
      width="39"
      height="34.7949"
      rx="1"
      fill="#737373"
      stroke="#737373"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 6V4C14 2.89543 14.8954 2 16 2H26C27.1046 2 28 2.89543 28 4V6"
      stroke="#737373"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M29 35.2984L34.5323 40.8306L48.3629 27"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M29 35.2984L34.5323 40.8306L48.3629 27"
      stroke="#737373"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="19.4492"
      y="12.7188"
      width="3.15385"
      height="16.8205"
      rx="1"
      fill="white"
    />
    <rect
      x="29.4375"
      y="19.5527"
      width="3.15385"
      height="16.8205"
      rx="1"
      transform="rotate(90 29.4375 19.5527)"
      fill="white"
    />
  </svg>
);

export default PackageCheck;
