"use client";

import { Pagination } from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
  q: string;
  page: number;
  totalPages: number;
  includeMovies: boolean;
  includeTV: boolean;
  year?: string;
  genreId?: string;
}

export default function SearchPagination({
  q,
  page,
  totalPages,
  includeMovies,
  includeTV,
  year,
  genreId,
}: Props) {
  const router = useRouter();

  function handleChange(_: React.ChangeEvent<unknown>, value: number) {
    const params = new URLSearchParams({ q, page: String(value) });
    if (includeMovies) params.set("movies", "1");
    if (includeTV) params.set("tv", "1");
    if (year?.trim()) params.set("year", year.trim());
    if (genreId?.trim()) params.set("genreId", genreId.trim());
    router.push(`/search?${params}`);
  }

  return (
    <Pagination
      count={totalPages}
      page={page}
      onChange={handleChange}
      color="primary"
      sx={{ display: "flex", justifyContent: "center" }}
    />
  );
}
