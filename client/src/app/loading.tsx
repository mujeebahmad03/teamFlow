"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loading({
  className,
  size = "lg",
  text = "Loading...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <main className="flex min-h-screen flex-col flex-1">
      <div
        className={cn(
          "flex flex-col items-center w-full justify-center gap-6 p-8 rounded-2xl",
          "bg-gradient-to-br from-background via-muted/20 to-background",
          "border border-border/50 backdrop-blur-sm shadow-lg",
          className
        )}
      >
        {/* Enhanced team collaboration animation */}
        <div className={cn("relative h-full", sizeClasses[size])}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "rounded-full bg-primary animate-pulse shadow-lg",
                "before:absolute before:inset-0 before:rounded-full before:bg-primary/30 before:animate-ping",
                size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                  ? "w-3 h-3"
                  : "w-4 h-4"
              )}
            />
          </div>

          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="absolute inset-0 animate-spin"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: "2.5s",
              }}
            >
              <div
                className={cn(
                  "absolute rounded-full shadow-md",
                  dotSizes[size],
                  index % 2 === 0
                    ? "bg-gradient-to-r from-primary to-primary/60"
                    : "bg-gradient-to-r from-accent to-accent/60"
                )}
                style={{
                  top: "0%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          ))}

          {[0, 1, 2, 3].map((index) => (
            <div
              key={`secondary-${index}`}
              className="absolute inset-0 animate-spin"
              style={{
                animationDelay: `${index * 0.25}s`,
                animationDuration: "3.5s",
                animationDirection: "reverse",
              }}
            >
              <div
                className={cn(
                  "absolute rounded-full bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/20 shadow-sm",
                  size === "sm"
                    ? "w-1 h-1"
                    : size === "md"
                    ? "w-1.5 h-1.5"
                    : "w-2 h-2"
                )}
                style={{
                  top: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          ))}

          {[0, 1].map((index) => (
            <div
              key={`outer-${index}`}
              className="absolute inset-0 animate-spin"
              style={{
                animationDelay: `${index * 0.4}s`,
                animationDuration: "4s",
              }}
            >
              <div
                className={cn(
                  "absolute rounded-full bg-gradient-to-r from-primary/30 to-accent/30",
                  size === "sm"
                    ? "w-0.5 h-0.5"
                    : size === "md"
                    ? "w-1 h-1"
                    : "w-1.5 h-1.5"
                )}
                style={{
                  top: "-10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/80 font-medium tracking-wide">
            {text}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce shadow-sm"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-40 h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-sm"
            style={{
              width: "60%",
              animation: "loading-progress 2.5s ease-in-out infinite",
              boxShadow: "0 0 8px rgba(var(--primary), 0.3)",
            }}
          />
        </div>

        <style jsx>{`
          @keyframes loading-progress {
            0% {
              width: 15%;
              transform: translateX(-100%);
            }
            50% {
              width: 70%;
              transform: translateX(0%);
            }
            100% {
              width: 15%;
              transform: translateX(400%);
            }
          }
        `}</style>
      </div>
    </main>
  );
}
