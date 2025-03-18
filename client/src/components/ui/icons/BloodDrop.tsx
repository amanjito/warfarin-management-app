import * as React from "react";
import { cn } from "@/lib/utils";

interface BloodDropProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  animated?: boolean;
}

export const BloodDrop = React.forwardRef<SVGSVGElement, BloodDropProps>(
  ({ 
    size = 24, 
    strokeWidth = 2, 
    className, 
    colorClass = "text-secondary", 
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
          {/* Blood drop shape */}
          <path
            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "group-hover:stroke-[var(--color-teal)]" : ""}
          />
          
          {/* Wave inside */}
          <path
            d="M8 14s1.5 2 4 2 4-2 4-2"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "group-hover:translate-y-[0.5px] transition-transform duration-300" : ""}
          />
        </g>
      </svg>
    );
  }
);

BloodDrop.displayName = "BloodDrop";

export default BloodDrop;