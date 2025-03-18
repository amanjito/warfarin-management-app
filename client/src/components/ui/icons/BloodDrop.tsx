import { cn } from "../../../lib/utils";
import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const BloodDrop = ({ className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("", className)}
      {...props}
    >
      <path d="M12 2l.4.4a9.5 9.5 0 0 1 2.1 3.5c.7 2.3 1 4.3 1 6.1a7.5 7.5 0 1 1-15 0c0-1.8.3-3.9 1-6.1A9.5 9.5 0 0 1 3.6 2.4L4 2" />
      <path d="M12 6v4" />
      <path d="M8.5 8.5h7" />
    </svg>
  );
};

export default BloodDrop;