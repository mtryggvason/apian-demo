import { SVGProps } from "@/components/icons/svgHelpers";
import { APIAN_GREEN } from "@/lib/constants/colors";

interface CircleSmallProps extends SVGProps {
  colour?: string;
}

export const CircleSmall = ({
  colour = APIAN_GREEN,
  ...props
}: CircleSmallProps) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="5" r="5" transform="rotate(90 5 5)" fill={colour} />
  </svg>
);
