import { SVGProps } from "@/components/icons/svgHelpers";

interface SignOutProps extends SVGProps {
  width?: number | string;
  height?: number | string;
}
export const SignOut = ({
  width = 21,
  height = 27,
  ...props
}: SignOutProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 23 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-apian-soft-black"
    {...props}
  >
    <path
      d="M11.5 14.5H22M22 14.5L17.5 19M22 14.5L17.5 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 5.5V4C22 2.34314 20.6569 1 19 1H4C2.34315 1 1 2.34314 1 4V25C1 26.6569 2.34315 28 4 28H19C20.6569 28 22 26.6569 22 25V23.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
