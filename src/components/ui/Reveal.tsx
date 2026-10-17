"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  threshold = 0.1,
  className,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold }
    );

    const currentElem = domRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={clsx(
        "transition-opacity duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
