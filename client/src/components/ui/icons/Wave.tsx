import { cn } from "@/lib/utils";

interface WaveProps {
  className?: string;
  fill?: string;
  variant?: "header" | "footer" | "divider";
}

export function Wave({ 
  className,
  fill = "currentColor",
  variant = "header"
}: WaveProps) {
  if (variant === "header") {
    return (
      <svg
        viewBox="0 0 1440 120"
        className={cn("w-full h-full", className)}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,120 C320,40 480,100 720,80 C960,60 1120,0 1440,40 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    );
  }
  
  if (variant === "footer") {
    return (
      <svg
        viewBox="0 0 1440 120"
        className={cn("w-full h-full", className)}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C320,80 480,20 720,40 C960,60 1120,120 1440,80 L1440,0 L0,0 Z"
          fill={fill}
        />
      </svg>
    );
  }
  
  // Divider variant
  return (
    <svg
      viewBox="0 0 1440 60"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,30 C320,60 480,0 720,30 C960,60 1120,30 1440,0 L1440,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  );
}