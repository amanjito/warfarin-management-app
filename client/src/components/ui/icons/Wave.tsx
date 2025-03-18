import { cn } from "@/lib/utils";

interface WaveProps {
  className?: string;
  fill?: string;
  variant?: "header" | "footer" | "divider";
}

export function Wave({ 
  className, 
  fill = "currentColor",
  variant = "divider"
}: WaveProps) {
  // Different wave patterns for different contexts
  const paths = {
    header: "M0,64L80,80C160,96,320,128,480,138.7C640,149,800,139,960,122.7C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
    footer: "M0,128L80,112C160,96,320,64,480,69.3C640,75,800,117,960,133.3C1120,149,1280,139,1360,133.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
    divider: "M0,160L60,170.7C120,181,240,203,360,192C480,181,600,139,720,144C840,149,960,203,1080,208C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1440 320"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="none"
    >
      <path 
        fill={fill} 
        fillOpacity="1" 
        d={paths[variant]}
      ></path>
    </svg>
  );
}