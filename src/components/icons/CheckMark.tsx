import { SVGProps } from "@/components/icons/svgHelpers";
const CheckMark = (props: SVGProps) => (
  <svg
    className="h-[20px] w-[20px] md:h-[30px] md:w-[30px] lg:h-[40px] lg:w-[40px]"
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="22.5" cy="22.5" r="22.5" fill="#737373" />
    <path
      d="M14.834 23.1665L19.5007 27.8332L31.1673 16.1665"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckMark;
