import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";
import { ReloadIcon } from "@radix-ui/react-icons";

/**
 * border-radius: 1.875rem;
 * background: linear-gradient(180deg, #E1FF27 0%, #01F9CC 100%);
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-md font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-inherit",
  {
    variants: {
      variant: {
        default:
          "bg-[#AEFF5E] text-primary-foreground shadow hover:bg-[#CBFF96]",
        highlight:
          "bg-gradient-to-b from-[#E1FF27] to-[#01F9CC] text-primary-foreground shadow",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        main: "bg-black text-white shadow hover:bg-black/80",
      },
      size: {
        default: "h-[3.125rem] px-4 rounded-[1.875rem]",
        sm: "h-8 px-3 text-sm rounded-[1.875rem]",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
        "no-horizontal-padding": "px-0 h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  pending?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, pending, children, ...props },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={pending}
      >
        {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
