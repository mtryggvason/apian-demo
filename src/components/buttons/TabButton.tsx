import React, { ForwardedRef, ReactNode } from "react";

import Text from "@/components/typography/Text";

interface ToggleOverlayButtonProps {
  selected: boolean;
  text: string;
  selectedIcon: ReactNode;
  unselectedIcon: ReactNode;
}

const TabButtonComponent = (
  {
    selected,
    text,
    selectedIcon,
    unselectedIcon,
    ...props
  }: ToggleOverlayButtonProps,
  ref: ForwardedRef<any>,
) => {
  return (
    <button
      {...props}
      ref={ref}
      className={`focus:none group flex w-[100px] flex-row items-center justify-between whitespace-nowrap bg-white px-[13px] py-[7px] font-inter text-xs text-apian-soft-black shadow-apian-modal hover:opacity-100 active:bg-apian-soft-black active:text-white active:opacity-100  ${selected ? "pointer-events-none font-bold text-black" : "font-normal text-apian-dark-grey/80 opacity-85 hover:text-apian-soft-black hover:opacity-100"}`}
    >
      {selected ? selectedIcon : unselectedIcon}
      <Text
        textSize="custom"
        tag="span"
        textColor="notSpecified"
        className={`group-hover:text-black/100 group-active:text-white ${selected ? "text-black" : "text-apian-dark-grey/80 "} `}
      >
        {text}
      </Text>
    </button>
  );
};

const TabButton = React.forwardRef(TabButtonComponent);

export default TabButton;
