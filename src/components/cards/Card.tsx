import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariant = cva("cardVariant", {
  variants: {
    rounded: {
      all: ["rounded-lg"],
      top: ["rounded-t-[10px]"],
    },
  },
  defaultVariants: {
    rounded: "all",
  },
});

interface CardProps extends VariantProps<typeof cardVariant> {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, rounded, className, ...props }: CardProps) => {
  return (
    <div
      className={cardVariant({
        rounded,
        className: `w-full ${className} border border-white bg-white shadow-apian-card`,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
