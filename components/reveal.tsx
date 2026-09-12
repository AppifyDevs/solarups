"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
      const frame = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(shown ? "reveal-shown" : "reveal-hidden", className)}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "900ms",
        transitionTimingFunction: EASE,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
