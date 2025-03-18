import React from "react";
import { cn } from "@/lib/utils";

interface BloodDropProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  color?: string;
  animated?: boolean;
}

export const BloodDrop = ({
  className,
  color = "#ef4444",
  animated = true,
  ...props
}: BloodDropProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <path
        d="M12 2l.47.27c2.5 1.43 4.73 3.33 6.6 5.63 1.7 2.12 2.43 4.03 2.43 6.16 0 4.8-4.23 8.44-9 8.44s-9-3.64-9-8.44c0-2.13.73-4.04 2.43-6.16 1.87-2.3 4.1-4.2 6.6-5.63L12 2z"
        fill={color}
        opacity={animated ? "0.8" : "0.6"}
        className={animated ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}
      />
      <path 
        d="M12 7v5M9.5 9.5h5" 
        stroke="white" 
        strokeWidth="1.5" 
      />
    </svg>
  );
};

export default BloodDrop;