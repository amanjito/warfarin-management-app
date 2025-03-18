import { cn } from "@/lib/utils";
import React from "react";

interface CurvedShapeProps {
  className?: string;
  fill?: string;
  reverse?: boolean;
  height?: number;
  position?: 'top' | 'bottom';
}

export const CurvedShape: React.FC<CurvedShapeProps> = ({
  className,
  fill = "currentColor",
  reverse = false,
  height = 50,
  position = 'bottom'
}) => {
  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';
  
  if (reverse) {
    return (
      <div className={cn(`absolute ${positionClass} left-0 right-0 overflow-hidden pointer-events-none`, className)} style={{ height }}>
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 0C1082.89 69.0566 725.779 103.585 0 0V74H1440V0Z"
            fill={fill}
            fillOpacity="0.15"
          />
        </svg>
        
        <svg
          className="absolute w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 0C1082.89 39.0566 725.779 63.585 0 20V74H1440V0Z"
            fill={fill}
            fillOpacity="0.1"
          />
        </svg>
      </div>
    );
  }
  
  return (
    <div className={cn(`absolute ${positionClass} left-0 right-0 overflow-hidden pointer-events-none`, className)} style={{ height }}>
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0C357.111 69.0566 714.221 103.585 1440 0V74H0V0Z"
          fill={fill}
          fillOpacity="0.15"
        />
      </svg>
      
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0C357.111 39.0566 714.221 63.585 1440 20V74H0V0Z"
          fill={fill}
          fillOpacity="0.1"
        />
      </svg>
    </div>
  );
};

export default CurvedShape;