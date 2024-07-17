import { SVGProps } from "@/components/icons/svgHelpers";
export const Clock = (props: SVGProps) => (
  <svg
    className="h-[40px] w-[40px]"
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    {...props}
  >
    <circle
      cx="21.8074"
      cy="21.8074"
      r="20.3074"
      fill="#737373"
      stroke="#737373"
      strokeWidth="3"
    />
    <path
      d="M21.8086 7.85156V21.8083H34.0207"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
