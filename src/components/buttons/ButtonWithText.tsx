import { cva, cx, VariantProps } from "class-variance-authority";

import { textVariant } from "@/components/typography/Text";
import { TextVariantProps } from "@/components/typography/Text";
import { ButtonActionCallback } from "@/lib/types";

export type ButtonVariantProps = VariantProps<typeof buttonVariant>;

const buttonVariant = cva("buttonVariant", {
  variants: {
    buttonSize: {
      full: ["w-full", "py-[8px]"],
      fit: ["w-fit", "h-fit"],
      sm: ["px-4", "py-2"],
    },
    buttonColor: {
      white: [
        "bg-white",
        "border",
        "border-apian-soft-black",
        "rounded",
        "hover:bg-apian-soft-black",
        "hover:text-white",
        "disabled:hover:text-apian-soft-black",
        "disabled:hover:bg-white",
        "disabled:hover:border-apian-soft-black",
        "disabled:opacity-25",
      ],
      softBlack: [
        "bg-apian-soft-black",
        "border",
        "border-white",
        "rounded-md",
        "hover:bg-apian-dark-grey",
        "hover:border-apian-dark-grey",
        "disabled:hover:text-white",
        "disabled:hover:bg-apian-soft-black",
        "disabled:hover:border-white",
        "disabled:opacity-25",
      ],
    },
  },
  defaultVariants: {
    buttonSize: "full",
    buttonColor: "white",
  },
});

//combining textVariant and buttonVariant so we didn't have to re-write the text styling
//ref: https://cva.style/docs/getting-started/composing-components
interface ButtonWithTextVariantProps
  extends ButtonVariantProps,
    TextVariantProps {}

export const buttonWithTextVariant = ({
  buttonSize,
  buttonColor,
  textColor,
  textSize,
}: ButtonWithTextVariantProps) =>
  cx(
    textVariant({ textSize, textColor }),
    buttonVariant({ buttonSize, buttonColor }),
  );
interface ButtonWithTextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonWithTextVariant> {
  buttonText: string;
  action?: ButtonActionCallback;
}

const ButtonWithText = ({
  buttonSize,
  buttonColor,
  buttonText,
  textSize,
  textColor,
  action,
  type,
  ...props
}: ButtonWithTextProps) => {
  return (
    <button
      type={type}
      className={buttonWithTextVariant({
        buttonSize,
        buttonColor,
        textSize,
        textColor,
      })}
      onClick={action}
      {...props}
    >
      {buttonText}
    </button>
  );
};

export default ButtonWithText;
