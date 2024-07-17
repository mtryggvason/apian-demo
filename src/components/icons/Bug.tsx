import { SVGProps } from "@/components/icons/svgHelpers";

interface BugPros extends SVGProps {
  width?: number | string;
  height?: number | string;
}

export const Bug = ({ width = 21, height = 27, ...props }: BugPros) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 21"
    fill="none"
    stroke="#262626"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_10402_27311)">
      <path d="M5.42969 7.52747C5.42969 5.6629 6.94122 4.15137 8.8058 4.15137H12.6207C14.4853 4.15137 15.9968 5.6629 15.9968 7.52748V14.1475C15.9968 17.0655 13.6313 19.431 10.7132 19.431C7.79522 19.431 5.42969 17.0655 5.42969 14.1475V7.52747Z" />
      <path
        d="M6.83558 1.09379L7.22387 1.0007L6.83558 1.09379Z"
        strokeWidth="2"
      />
      <rect
        x="1.80035"
        y="11.1578"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="15.941"
        y="11.1578"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="15.941"
        y="14.5865"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="1.80035"
        y="14.5865"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="15.941"
        y="7.73199"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="8.65973"
        y="9.01715"
        width="4.11182"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="8.65973"
        y="12.8726"
        width="4.11182"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="1.80035"
        y="7.73199"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        strokeWidth="0.600708"
      />
      <rect
        x="14.179"
        y="0.879374"
        width="3.68341"
        height="0.600708"
        rx="0.300354"
        transform="rotate(105 14.179 0.879374)"
        strokeWidth="0.600708"
      />
    </g>
    <defs>
      <clipPath id="clip0_10402_27311">
        <rect width="20" height="20" transform="translate(0.5 0.222656)" />
      </clipPath>
    </defs>
  </svg>
);
