import * as React from "react";
import { cn } from "@/lib/utils";

interface MedicalHeartProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  secondaryColorClass?: string;
  animated?: boolean;
}

export const MedicalHeart = React.forwardRef<SVGSVGElement, MedicalHeartProps>(
  ({ 
    size = 24, 
    strokeWidth = 2, 
    className, 
    colorClass = "text-secondary",
    secondaryColorClass = "text-accent",
    animated = true,
    ...props 
  }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transition-all duration-300", className)}
        {...props}
      >
        <g className={cn(
          colorClass,
          animated && "group hover:scale-105 transition-transform duration-300"
        )}>
          {/* Main heart shape */}
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "group-hover:stroke-[var(--color-teal)]" : ""}
          />
          
          {/* Cross in heart */}
          <g className={cn(
            secondaryColorClass,
            animated && "transition-all duration-300 group-hover:translate-y-[0.5px]"
          )}>
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="16"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="8"
              y1="12"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    );
  }
);

MedicalHeart.displayName = "MedicalHeart";

export default MedicalHeart;