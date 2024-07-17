import IconButton from "@/components/buttons/icon_buttons/IconButton";
import { PlusMedium } from "@/components/icons/PlusMedium";
import { PlusSmall } from "@/components/icons/PlusSmall";
import { ButtonIconProps } from "@/lib/types";

export default function PlusIconButton({ size, action }: ButtonIconProps) {
  return (
    <IconButton
      size={size}
      icon={size === "iconMedium" ? <PlusMedium /> : <PlusSmall />}
      action={action}
    />
  );
}
