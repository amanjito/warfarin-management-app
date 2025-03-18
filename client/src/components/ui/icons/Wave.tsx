import * as React from "react";
import { cn } from "@/lib/utils";

interface WaveProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  animated?: boolean;
  amplitude?: number;
  frequency?: number;
}

export const Wave = React.forwardRef<SVGSVGElement, WaveProps>(
  ({ 
    size = 24, 
    strokeWidth = 1.5, 
    className, 
    colorClass = "text-accent", 
    animated = true,
    amplitude = 3,
    frequency = 20,
    ...props 
  }, ref) => {
    // Generate wave path
    const generateWavePath = (
      amplitude: number,
      frequency: number,
      width: number = 100, 
      height: number = 20,
      offset: number = 0
    ) => {
      let path = `M 0 ${height / 2}`;
      
      for (let x = 0; x <= width; x += 0.5) {
        const y = amplitude * Math.sin((x + offset) / frequency) + height / 2;
        path += ` L ${x} ${y}`;
      }
      
      return path;
    };
    
    return (
      <svg
        ref={ref}
        width={size}
        height={size / 3}
        viewBox="0 0 100 20" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transition-all duration-300", className)}
        {...props}
      >
        <g className={cn(
          colorClass,
          animated && "group hover:scale-105 transition-transform duration-300"
        )}>
          <path
            d={generateWavePath(amplitude, frequency)}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className={animated ? "group-hover:stroke-[var(--color-teal)]" : ""}
          />
          
          {animated && (
            <path
              d={generateWavePath(amplitude * 0.7, frequency - 2, 100, 20, 10)}
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray="1 3"
              opacity="0.6"
              className="group-hover:opacity-80 transition-opacity duration-300"
            />
          )}
        </g>
      </svg>
    );
  }
);

Wave.displayName = "Wave";

export default Wave;