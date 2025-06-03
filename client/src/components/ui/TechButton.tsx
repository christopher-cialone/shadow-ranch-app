import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const techButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-tech",
  {
    variants: {
      variant: {
        primary: "btn-tech-primary",
        secondary: "btn-tech-secondary", 
        accent: "btn-tech-accent",
        outline: "border border-tech-purple-500 bg-transparent text-tech-purple-500 hover:bg-tech-purple-500 hover:text-white",
        ghost: "text-tech-cyan-400 hover:bg-tech-cyan-400/10 hover:text-tech-cyan-300",
        link: "text-tech-purple-500 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        purple: "shadow-lg shadow-tech-purple-500/25 hover:shadow-tech-purple-500/40",
        cyan: "shadow-lg shadow-tech-cyan-500/25 hover:shadow-tech-cyan-500/40",
        pink: "shadow-lg shadow-tech-pink-500/25 hover:shadow-tech-pink-500/40",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      glow: "none",
    },
  }
);

export interface TechButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof techButtonVariants> {}

const TechButton = forwardRef<HTMLButtonElement, TechButtonProps>(
  ({ className, variant, size, glow, ...props }, ref) => {
    return (
      <button
        className={cn(techButtonVariants({ variant, size, glow, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TechButton.displayName = "TechButton";

export { TechButton, techButtonVariants };