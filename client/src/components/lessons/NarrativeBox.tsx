import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const narrativeBoxVariants = cva(
  "border-l-4 p-4 rounded-r-lg mb-6",
  {
    variants: {
      variant: {
        story: "bg-gradient-to-r from-leather-800/50 to-leather-700/50 border-desert-500",
        challenge: "bg-gradient-to-r from-sage-800/30 to-sage-700/30 border-sage-600",
        success: "bg-gradient-to-r from-green-800/30 to-green-700/30 border-green-500",
        warning: "bg-gradient-to-r from-sunset-800/30 to-sunset-700/30 border-sunset-500"
      }
    },
    defaultVariants: {
      variant: "story"
    }
  }
);

interface NarrativeBoxProps extends VariantProps<typeof narrativeBoxVariants> {
  children: ReactNode;
  icon?: string;
  title?: string;
  className?: string;
}

export function NarrativeBox({ 
  children, 
  variant, 
  icon = "fa-user-cowboy", 
  title = "Sheriff's Instructions",
  className 
}: NarrativeBoxProps) {
  const getIconColor = () => {
    switch (variant) {
      case 'challenge':
        return 'text-sage-400';
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-sunset-400';
      default:
        return 'text-desert-400';
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'challenge':
        return 'text-sage-400';
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-sunset-400';
      default:
        return 'text-desert-400';
    }
  };

  return (
    <div className={cn(narrativeBoxVariants({ variant }), className)}>
      <div className="flex items-start space-x-3">
        <i className={`fas ${icon} ${getIconColor()} text-xl mt-1`} />
        <div>
          <h4 className={`font-deputy mb-2 ${getTitleColor()}`}>
            {title}
          </h4>
          <div className="text-gray-300 font-mono text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
