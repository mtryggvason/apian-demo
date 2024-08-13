import { ButtonHTMLAttributes } from "react";

import StyledButton from "@/components/buttons/StyledButton";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "mdRoundedMdSquare" | "smRoundedMdSquare";
}

export const CloseButton = ({
  size = "mdRoundedMdSquare",
  ...props
}: CloseButtonProps) => (
  <StyledButton
    data-testid="close-button"
    size={size}
    {...props}
    bgColor="white"
  >
    <CloseIcon className={`h-[25px] w-[25px]`} />
  </StyledButton>
);
