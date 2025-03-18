import React from "react";
import { cn } from "@/lib/utils";

interface MedicalHeartProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  animated?: boolean;
}

export const MedicalHeart = ({
  className,
  primaryColor = "currentColor",
  secondaryColor = "#ef4444",
  animated = true,
  ...props
}: MedicalHeartProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", animated && "animate-pulse", className)}
      {...props}
    >
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={animated ? secondaryColor : "none"}
        opacity={animated ? "0.4" : "0"}
      />
      <path
        d="M12 5.5v3M10.5 7h3"
        stroke={primaryColor}
        strokeWidth="2"
      />
      <path
        className={cn(animated && "animate-[pulse_2s_ease-in-out_infinite]")}
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill="none"
      />
    </svg>
  );
};

export default MedicalHeart;