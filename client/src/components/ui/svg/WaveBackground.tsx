import * as React from "react";
import { cn } from "@/lib/utils";

interface WaveBackgroundProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  colorClass?: string;
  secondaryColorClass?: string;
  height?: string;
  preserveAspectRatio?: string;
  animated?: boolean;
}

export const WaveBackground = React.forwardRef<SVGSVGElement, WaveBackgroundProps>(
  ({ 
    className, 
    colorClass = "fill-primary/80", 
    secondaryColorClass = "fill-primary/40",
    height = "140",
    preserveAspectRatio = "none",
    animated = true,
    ...props 
  }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 1440 320"
        height={height}
        width="100%"
        preserveAspectRatio={preserveAspectRatio}
        className={cn(
          "w-full transition-all duration-500",
          animated && "group",
          className
        )}
        {...props}
      >
        <path 
          className={cn(
            colorClass,
            animated && "transition-transform duration-[5000ms] ease-in-out group-hover:translate-x-5"
          )}
          fillOpacity="1" 
          d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,192C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        
        <path 
          className={cn(
            secondaryColorClass,
            animated && "transition-transform duration-[7000ms] ease-in-out group-hover:translate-x-10"
          )}
          fillOpacity="1" 
          d="M0,224L48,224C96,224,192,224,288,208C384,192,480,160,576,144C672,128,768,128,864,144C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    );
  }
);

WaveBackground.displayName = "WaveBackground";

export default WaveBackground;