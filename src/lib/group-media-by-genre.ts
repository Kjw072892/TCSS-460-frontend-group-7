import type { MovieSummary, TVSummary } from "@/types/media";

export type GenreMediaItem = (MovieSummary | TVSummary) & {
  _type: "movie" | "tv";
};

const TMDB_GENRE_NAMES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

export function groupByGenre(
  movies: MovieSummary[],
  tvShows: TVSummary[],
): Map<string, GenreMediaItem[]> {
  const map = new Map<string, GenreMediaItem[]>();
  const seen = new Map<string, Set<string>>();

  function add(item: GenreMediaItem, genreName: string) {
    if (!genreName?.trim()) return;
    if (!map.has(genreName)) {
      map.set(genreName, []);
      seen.set(genreName, new Set());
    }
    const key = `${item._type}-${item.id}`;
    if (!seen.get(genreName)!.has(key)) {
      seen.get(genreName)!.add(key);
      map.get(genreName)!.push(item);
    }
  }

  function resolveName(g: { id: number; name?: string }) {
    return g.name?.trim() || TMDB_GENRE_NAMES[g.id] || "";
  }

  const tagged: GenreMediaItem[] = [];
  const len = Math.max(movies.length, tvShows.length);
  for (let i = 0; i < len; i++) {
    if (i < movies.length) tagged.push({ ...movies[i], _type: "movie" });
    if (i < tvShows.length) tagged.push({ ...tvShows[i], _type: "tv" });
  }

  for (const item of tagged) {
    for (const g of item.genres ?? []) add(item, resolveName(g));
  }

  return map;
}
