import { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";

import { ButtonActionCallback } from "@/lib/types";

interface StyledButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styledButtonVariants> {
  action?: ButtonActionCallback;
  children: React.ReactNode;
}

interface StyledButtonLinkProps
  extends LinkProps,
    VariantProps<typeof styledButtonVariants> {
  children: React.ReactNode;
  className?: string;
}

const styledButtonVariants = cva("styledButtonVariants", {
  variants: {
    size: {
      xsRoundedMd: ["px-2", "py-1", "rounded"],
      xsRoundedMdSquare: ["px-[3px]", "py-[3px]", "rounded"],
      smRoundedMd: ["px-3", "py-2", "rounded"],
      smRoundedMdSquare: ["px-1", "py-1", "rounded"],
      mdRoundedMd: ["px-4", "py-3", "rounded"],
      mdRoundedMdSquare: ["px-[7px]", "py-[7px]", "rounded"],
      lgRoundedMd: ["px-[17px]", "py-[9px]", "rounded", "shadow-sm"],
      xlRoundedMd: ["px-[7px]", "sm:[px-10]", "py-[12px]", "rounded"],
      xsRoundedFull: ["px-1", "py-1", "rounded-full"],
      smRoundedFull: ["px-3", "py-[5px]", "rounded-full"],
      mdRoundedFull: ["px-4", "py-3", "rounded-full"],
      iconSmall: [
        "h-[17px]",
        "w-[17px]",
        "rounded-sm",
        "shadow-apian-card",
        "flex",
        "items-center",
        "justify-center",
      ],
      iconMedium: [
        "h-[26px]",
        "w-[26px]",
        "rounded",
        "shadow-apian-card",
        "flex",
        "items-center",
        "justify-center",
      ],
      custom: [""], //for one off sizes
    },
    bgColor: {
      white: [
        "bg-white",
        "border",
        "border-apian-soft-black",
        "text-apian-soft-black",
        "active:bg-apian-soft-black",
        "active:text-white",
        "active:border-apian-soft-black",
        "hover:bg-apian-soft-black",
        "hover:text-white",
        "hover:stroke-white",
        "hover:border-apian-soft-black",
        "disabled:hover:text-apian-soft-black",
        "disabled:hover:bg-white",
        "disabled:hover:border-apian-soft-black",
        "disabled:opacity-25",
      ],
      lightWithRedHover: [
        "bg-white",
        "border",
        "border-apian-soft-black",
        "text-apian-soft-black",
        "hover:bg-apian-red",
        "hover:text-white",
        "hover:font-bold",
        "hover:stroke-white",
        "hover:border-apian-red",
        "disabled:text-apian-soft-black",
        "disabled:bg-white",
        "disabled:border-apian-soft-black",
        "disabled:hover:font-normal",
        "disabled:opacity-25",
      ],
      redVariant: [
        "bg-apian-red",
        "border",
        "border-apian-red",
        "text-white",
        "font-bold",
        "hover:border-apian-soft-black",
        "hover:bg-apian-soft-black",
        "disabled:text-apian-soft-black",
        "disabled:bg-white",
        "disabled:border-apian-soft-black",
        "disabled:opacity-25",
      ],
      whiteWithGreyOutline: [
        "bg-white",
        "border",
        "border-apian-medium-grey",
        "text-black",
        "active:bg-black",
        "active:text-white",
        "active:border-black",
        "hover:bg-apian-soft-black",
        "hover:text-white",
        "hover:stroke-white",
        "hover:border-apian-soft-black",
        "disabled:hover:text-black",
        "disabled:hover:bg-white",
        "disabled:hover:border-black",
        "disabled:opacity-25",
      ],
      redOutline: [
        "bg-transparent",
        "border",
        "border-apian-red",
        "text-apian-red",
        "hover:bg-apian-red",
        "hover:bg-opacity-50",
        "hover:font-medium",
        "disabled:border-apian-medium-grey",
        "disabled:text-apian-medium-grey",
        "disabled:pointer-events-none",
      ],
      red: [
        "bg-apian-red",
        "bg-opacity-50",
        "border",
        "border-apian-red",
        "disabled:opacity-50",
        "disabled:pointer-events-none",
      ],
      softBlack: [
        "bg-apian-soft-black",
        "border",
        "border-apian-soft-black",
        "text-white",
        "hover:bg-apian-dark-grey",
        "hover:border-apian-dark-grey",
        "active:bg-apian-soft-black",
        "disabled:hover:text-white",
        "disabled:hover:bg-apian-soft-black",
        "disabled:hover:border-white",
        "disabled:opacity-25",
      ],
      nhsBlue: ["bg-apian-nhs-blue", "text-white", "border-apian-nhs-blue"],
    },
  },
  defaultVariants: {
    size: "xsRoundedMd",
    bgColor: "white",
  },
});

export default function StyledButton({
  action,
  size,
  bgColor,
  children,
  className,
  ...props
}: StyledButtonProps) {
  return (
    <button
      type="button"
      className={styledButtonVariants({ size, className, bgColor })}
      onClick={action}
      {...props}
    >
      {children}
    </button>
  );
}

export function StyledButtonLink({
  size,
  bgColor,
  children,
  className,
  href,
  ...props
}: StyledButtonLinkProps) {
  return (
    <Link
      href={href}
      type="button"
      className={styledButtonVariants({ size, className, bgColor })}
      {...props}
    >
      {children}
    </Link>
  );
}
