import { cn } from "@/lib/utils";

interface CurvedShapeProps {
  className?: string;
  fill?: string;
  inverted?: boolean;
}

export function CurvedShape({ 
  className,
  fill = "currentColor",
  inverted = false
}: CurvedShapeProps) {
  return (
    <svg
      viewBox="0 0 1440 80"
      className={cn("absolute w-full", className)}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {inverted ? (
        <path
          d="M0 0C240 80 480 80 720 40C960 0 1200 0 1440 0V80H0V0Z"
          fill={fill}
        />
      ) : (
        <path
          d="M0 80C240 0 480 0 720 40C960 80 1200 80 1440 80V0H0V80Z"
          fill={fill}
        />
      )}
    </svg>
  );
}

interface WavyShapeProps {
  className?: string;
  fill?: string;
  inverted?: boolean;
}

export function WavyShape({ 
  className,
  fill = "currentColor",
  inverted = false
}: WavyShapeProps) {
  return (
    <svg
      viewBox="0 0 1440 60"
      className={cn("absolute w-full", className)}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {inverted ? (
        <path
          d="M0,0 C320,60 480,0 720,30 C960,60 1120,30 1440,0 L1440,60 L0,60 Z"
          fill={fill}
        />
      ) : (
        <path
          d="M0,60 C320,0 480,60 720,30 C960,0 1120,30 1440,60 L1440,0 L0,0 Z"
          fill={fill}
        />
      )}
    </svg>
  );
}

interface HeartbeatShapeProps {
  className?: string;
  fill?: string;
  inverted?: boolean;
}

export function HeartbeatShape({ 
  className,
  fill = "currentColor",
  inverted = false
}: HeartbeatShapeProps) {
  return (
    <svg
      viewBox="0 0 1440 50"
      className={cn("absolute w-full", className)}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {inverted ? (
        <path
          d="M0,0 L480,0 L560,25 L640,0 L720,50 L800,0 L880,25 L960,0 L1440,0 L1440,50 L0,50 Z"
          fill={fill}
        />
      ) : (
        <path
          d="M0,50 L480,50 L560,25 L640,50 L720,0 L800,50 L880,25 L960,50 L1440,50 L1440,0 L0,0 Z"
          fill={fill}
        />
      )}
    </svg>
  );
}

export function WarfarinLogo({ className, fill = "currentColor" }: { className?: string, fill?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      <path d="M12 3v6l3 3" />
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}

export function HeartPulseIcon({ className, fill = "currentColor" }: { className?: string, fill?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={fill} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.78" />
    </svg>
  );
}