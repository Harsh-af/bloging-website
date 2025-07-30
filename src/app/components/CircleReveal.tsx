"use client";

import { useEffect, useRef, useState } from "react";

interface CircleRevealProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  position: { x: number; y: number };
  targetTheme: "light" | "dark";
}

export default function CircleReveal({
  isAnimating,
  onAnimationComplete,
  position,
  targetTheme,
}: CircleRevealProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setIsVisible(true);
      setIsExpanding(false);

      // Start the expansion animation after a brief delay
      const timer = setTimeout(() => {
        setIsExpanding(true);
      }, 10);

      // Complete the animation after the transition
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
        setIsVisible(false);
        setIsExpanding(false);
      }, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [isAnimating, onAnimationComplete, position]);

  if (!isVisible) return null;

  return (
    <div
      ref={circleRef}
      className={`fixed pointer-events-none z-50 rounded-full transition-all duration-800 ease-out ${
        isExpanding ? "scale-[100]" : "scale-0"
      }`}
      style={{
        left: position.x - 20,
        top: position.y - 20,
        width: "40px",
        height: "40px",
        transform: "none",
        transformOrigin: "20px 20px",
        backgroundColor: targetTheme === "light" ? "#ffffff" : "#000000",
      }}
    />
  );
}
