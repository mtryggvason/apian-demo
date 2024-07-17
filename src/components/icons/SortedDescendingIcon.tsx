import React from "react";

import { SVGProps } from "@/components/icons/svgHelpers";

const SortedDescendingIcon = ({ onClick, ...props }: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height="16"
      width="16"
      aria-label="Sorted in descending order, click to unsort"
      onClick={onClick}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
      />
    </svg>
  );
};

export default SortedDescendingIcon;
