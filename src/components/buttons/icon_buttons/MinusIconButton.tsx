import IconButton from "@/components/buttons/icon_buttons/IconButton";
import { MinusMedium } from "@/components/icons/MinusMedium";
import { MinusSmall } from "@/components/icons/MinusSmall";
import { ButtonIconProps } from "@/lib/types";

export default function MinusIconButton({ size, action }: ButtonIconProps) {
  return (
    <IconButton
      size={size}
      icon={size === "iconMedium" ? <MinusMedium /> : <MinusSmall />}
      action={action}
    />
  );
}
