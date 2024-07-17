import { SVGProps } from "@/components/icons/svgHelpers";
export const CircleCheckMark = (props: SVGProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="16" fill="#78D16A" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L14.7071 20.7071C14.3166 21.0976 13.6834 21.0976 13.2929 20.7071L9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929C9.68342 14.9024 10.3166 14.9024 10.7071 15.2929L14 18.5858L21.2929 11.2929C21.6834 10.9024 22.3166 10.9024 22.7071 11.2929Z"
      fill="white"
    />
  </svg>
);
