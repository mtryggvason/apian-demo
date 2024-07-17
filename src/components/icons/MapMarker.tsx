import { SVGProps } from "./svgHelpers";

export const Marker = (props: SVGProps) => (
  <svg
    {...props}
    viewBox="0 0 17 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{props.title}</title>
    <g filter="url(#filter0_d_23_433)">
      <path
        d="M4.15 4.31372C4.15 2.80835 4.728 1.77352 5.54392 1.11197C6.36461 0.446559 7.43749 0.15 8.43354 0.15C9.4296 0.15 10.5024 0.446559 11.3231 1.11195C12.139 1.77349 12.717 2.8083 12.717 4.31361C12.717 5.02116 12.331 6.00623 11.7622 7.06759C11.1973 8.12156 10.4665 9.22508 9.80533 10.1612C9.11977 11.1317 7.71697 11.1463 7.03984 10.1786C6.37537 9.22897 5.65001 8.10502 5.09143 7.04214C4.81214 6.51069 4.57585 5.99696 4.40967 5.52963C4.24285 5.06048 4.15 4.64712 4.15 4.31372Z"
        fill="#FFC03A"
        stroke="black"
        strokeWidth="0.3"
      />
    </g>
    <circle
      cx="8.44189"
      cy="4.27734"
      r="0.75"
      fill="#FFC03A"
      stroke="black"
      strokeWidth="0.5"
    />
    <defs>
      <filter
        id="filter0_d_23_433"
        x="0"
        y="0"
        width="16.8669"
        height="19.0468"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_23_433"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_23_433"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
