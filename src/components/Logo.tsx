"use client";

import MovieIcon from "@mui/icons-material/Movie";

interface LogoProps {
  width?: number;
  height?: number;
  variant?: "full" | "icon";
}

export default function Logo({ width = 35, height = 35 }: LogoProps) {
  return (
    <MovieIcon
      sx={{ color: "primary.main", fontSize: Math.max(width, height) }}
    />
  );
}
