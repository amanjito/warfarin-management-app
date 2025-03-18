import { cn } from "../../../lib/utils";
import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Wave = ({ className, ...props }: IconProps) => {
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
      <path d="M2 12h2a4 4 0 0 0 4-4 4 4 0 0 1 4-4h1" />
      <path d="M2 16h1a4 4 0 0 0 4-4 4 4 0 0 1 4-4h2a4 4 0 0 0 4-4 4 4 0 0 1 4-4" />
      <path d="M4 20h1a4 4 0 0 0 4-4 4 4 0 0 1 4-4h.5" />
    </svg>
  );
};

export default Wave;