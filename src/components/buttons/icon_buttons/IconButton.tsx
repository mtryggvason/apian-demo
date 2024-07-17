import { ReactNode } from "react";

import StyledButton from "@/components/buttons/StyledButton";
import { ButtonIconProps } from "@/lib/types";

interface IconButtonProps extends ButtonIconProps {
  icon: ReactNode;
}

export default function IconButton({ icon, size, action }: IconButtonProps) {
  return (
    <StyledButton bgColor="white" size={size} action={action}>
      {icon}
    </StyledButton>
  );
}
