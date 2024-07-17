import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export type TextVariantProps = VariantProps<typeof textVariant>;
export const textVariant = cva("textVariant", {
  variants: {
    textSize: {
      h1: ["font-poppins", "text-4xl", "font-medium"],
      h2: ["font-poppins", "text-lg", "font-normal", "leading-[26px]"],
      h2Bold: ["font-poppins", "text-lg", "font-semibold", "leading-[26px]"],
      body: ["font-inter", "text-xs", "font-normal", "leading-[14px]"],
      bodyBold: ["font-inter", "text-xs", "font-bold", "leading-[14px]"],
      custom: [""], //for one off text sizes
    },
    textColor: {
      white: ["text-white"],
      black: ["text-black"],
      softBlack: ["text-apian-soft-black"],
      darkGrey: ["text-apian-dark-grey"],
      lightGrey: ["text-apian-light-grey"],
      mediumGrey: ["text-apian-medium-grey"],
      red: ["text-apian-red"],
      darkRed: ["text-red-800"],
      notSpecified: [""], //allows parent to control colour
    },
  },
  defaultVariants: {
    textSize: "body",
    textColor: "black",
  },
});

interface TextProps
  extends React.AllHTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariant> {
  tag?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "label"
    | "span"
    | "a"
    | "div";
}

const Text = ({
  tag = "p",
  children,
  textSize,
  textColor,
  className,
  ...props
}: TextProps) => {
  const TagName = ({ ...props }: React.AllHTMLAttributes<HTMLElement>) =>
    React.createElement(tag, props, children);
  return (
    <TagName
      className={textVariant({ textSize, textColor, className })}
      {...props}
    >
      {children}
    </TagName>
  );
};

export default Text;
