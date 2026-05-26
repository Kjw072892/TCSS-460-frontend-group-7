"use client";

import { Children, useEffect, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface HorizontalScrollerProps {
  children: ReactNode;
  infinite?: boolean;
}

export default function HorizontalScroller({
  children,
  infinite = true,
}: HorizontalScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const childArray = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    if (!infinite) {
      function handleWheel(e: WheelEvent) {
        const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!horizontalIntent) return;

        e.preventDefault();
        container.scrollLeft += e.deltaX;
      }

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }

    let isAdjusting = false;

    function setInitialPosition() {
      const segmentWidth = container.scrollWidth / 3;
      if (segmentWidth > 0) {
        container.scrollLeft = segmentWidth;
      }
    }

    function normalizeScroll() {
      if (isAdjusting) return;

      const segmentWidth = container.scrollWidth / 3;
      if (segmentWidth <= 0) return;

      if (container.scrollLeft < segmentWidth * 0.5) {
        isAdjusting = true;
        container.scrollLeft += segmentWidth;
        isAdjusting = false;
      } else if (container.scrollLeft > segmentWidth * 1.5) {
        isAdjusting = true;
        container.scrollLeft -= segmentWidth;
        isAdjusting = false;
      }
    }

    function handleWheel(e: WheelEvent) {
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontalIntent) return;

      e.preventDefault();
      container.scrollLeft += e.deltaX;
      normalizeScroll();
    }

    function handleScroll() {
      normalizeScroll();
    }

    setInitialPosition();
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", setInitialPosition);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", setInitialPosition);
    };
  }, [childArray.length, infinite]);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        pb: 1,
        cursor: "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {infinite
        ? [0, 1, 2].map((copyIndex) => (
            <Box
              key={copyIndex}
              sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}
            >
              {childArray.map((child, childIndex) => (
                <Box
                  key={`${copyIndex}-${childIndex}`}
                  sx={{ display: "flex", flexShrink: 0 }}
                >
                  {child}
                </Box>
              ))}
            </Box>
          ))
        : childArray}
    </Box>
  );
}
