import { cn } from "@/lib/utils";

interface BloodDropProps {
  className?: string;
  color?: string;
}

export function BloodDrop({ className, color = "#ef4444" }: BloodDropProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("", className)}
      fill="none"
    >
      <path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${color}20`}
      />
      <path
        d="M12 8v4M12 16h.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}