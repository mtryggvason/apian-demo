import { SVGProps } from "@/components/icons/svgHelpers";

interface SizeableConnectorProps extends SVGProps {
  lineHeight?: number | string;
}

export const SizeableConnector = ({
  lineHeight = 102,
  ...props
}: SizeableConnectorProps) => (
  <svg
    width="2"
    height={lineHeight}
    preserveAspectRatio="none"
    viewBox={`0 0 2 102`}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="2" height="100%" />
  </svg>
);

export const Connector = (props: SVGProps) => (
  <svg
    width="2"
    preserveAspectRatio="none"
    viewBox="0 0 2 72"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="2" height="100%" />
  </svg>
);
