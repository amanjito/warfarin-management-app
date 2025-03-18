import { cn } from "@/lib/utils";

interface MedicalHeartProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function MedicalHeart({ 
  className, 
  primaryColor = "#ef4444",
  secondaryColor = "#991b1b"
}: MedicalHeartProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("", className)}
      fill="none"
    >
      {/* Heart shape */}
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7Z"
        stroke={primaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${primaryColor}20`}
      />
      
      {/* Medical cross */}
      <path
        d="M12 7v8M8 11h8"
        stroke={secondaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}