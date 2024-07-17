import { SVGProps } from "@/components/icons/svgHelpers";

const Dots = (props: SVGProps) => (
  <svg
    {...props}
    width="2"
    height="8"
    viewBox="0 0 2 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    {props.title && <title>{props.title}</title>}
    <circle cx="1" cy="1" r="1" />
    <circle cx="1" cy="4" r="1" />
    <circle cx="1" cy="7" r="1" />
  </svg>
);

export default Dots;
