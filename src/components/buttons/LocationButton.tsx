"use client";

import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";

import StyledButton from "@/components/buttons/StyledButton";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import Text from "@/components/typography/Text";
import { LOCATION_BTN_TXT } from "@/lib/constants/pageTextConstants";

const LocationButtonComponent = (
  { ...props }: ButtonHTMLAttributes<HTMLButtonElement>,
  ref: ForwardedRef<any>,
) => {
  return (
    <span ref={ref}>
      <StyledButton
        {...props}
        bgColor="white"
        size="custom"
        className="flex h-[26px] w-[90px] flex-row items-center justify-between rounded-full py-[5px] pl-1.5 pr-3"
      >
        <GlobeIcon />
        <Text textSize="body" tag="span" textColor="notSpecified">
          {LOCATION_BTN_TXT}
        </Text>
      </StyledButton>
    </span>
  );
};

const LocationButton = forwardRef(LocationButtonComponent);

export default LocationButton;
