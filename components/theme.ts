import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "rounded-md px-3 py-1 text-xs font-medium focus:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:bg-neutral-600",
  {
    variants: {
      variant: {
        primary: "bg-blue-700 text-white hover:bg-blue-600",
        secondary: "bg-neutral-600 text-neutral-50 hover:bg-neutral-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);
