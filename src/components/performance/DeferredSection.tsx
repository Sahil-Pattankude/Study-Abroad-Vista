"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children?: ReactNode;
  /** A render callback prevents React from creating a large off-screen tree. */
  render?: () => ReactNode;
  /** Keeps the document height stable while the section's code is not needed yet. */
  minHeight?: number;
  id?: string;
  eager?: boolean;
}

/**
 * Delays non-critical interactive sections until the reader is approaching them.
 * This keeps their JavaScript and hydration work out of the initial mobile render.
 */
export function DeferredSection({ children, render, minHeight = 480, id, eager = false }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(eager);

  useEffect(() => {
    if (eager) setShouldRender(true);
  }, [eager]);

  useEffect(() => {
    const element = ref.current;
    if (!element || eager) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      // Preload slightly before viewport to avoid scroll flicker without blocking initial thread
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div id={id} ref={ref} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? (render ? render() : children) : null}
    </div>
  );
}
