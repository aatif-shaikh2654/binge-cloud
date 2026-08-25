import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { getMediaDetails, getMovieVideos } from "@/app/services/all.service";
import { getAnimeDetails } from "@/app/services/anilist.service";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { usePlayerStore } from "@/app/store/usePlayerStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie } from "@/app/types/tmdb";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface UseMediaCardMetadataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movie: TMDBMovie | any;
  mediaType?: MediaType;
  isWatchLaterPage?: boolean;
}

export function useMediaCardMetadata({
  movie,
  mediaType,
  isWatchLaterPage,
}: UseMediaCardMetadataProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const { isMuted, setIsMuted } = usePlayerStore();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);

  useEffect(() => {
    if (iframeRef.current && isVideoLoaded) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
          args: [],
        }),
        "*",
      );
    }
  }, [isMuted, isVideoLoaded]);

  const currentMediaType = useMemo(() => {
    if (mediaType) return mediaType;
    if (movie.media_type) return movie.media_type;
    return "movie";
  }, [mediaType, movie.media_type]);

  const isAnime = currentMediaType === "anime";
  const isTv = currentMediaType === "tv";

  const { data: realTimeDetails } = useQuery({
    queryKey: ["realTimeDetails", currentMediaType, movie.id],
    queryFn: async () => {
      if (isAnime) {
        return getAnimeDetails(movie.id);
      } else if (isTv) {
        return getMediaDetails(movie.id, "tv");
      }
      return null;
    },
    enabled: !!isWatchLaterPage && (isAnime || isTv),
    staleTime: 5 * 60 * 1000,
  });

  const latestAiredEp = useMemo(() => {
    if (!isWatchLaterPage) return null;
    if (currentMediaType === "anime") {
      const details = realTimeDetails as AniListMediaDetail | null;
      if (details) {
        return details.nextAiringEpisode
          ? `EP ${details.nextAiringEpisode.episode - 1}`
          : `EP ${details.episodes}`;
      }
      return movie.nextAiringEpisode
        ? `EP ${movie.nextAiringEpisode.episode - 1}`
        : movie.episodes
          ? `EP ${movie.episodes}`
          : null;
    } else if (currentMediaType === "tv") {
      const details = realTimeDetails as TMDBMovie | null;
      if (details?.last_episode_to_air) {
        return `S${details.last_episode_to_air.season_number} E${details.last_episode_to_air.episode_number}`;
      }
      return null;
    }
    return null;
  }, [currentMediaType, realTimeDetails, movie, isWatchLaterPage]);

  const hasNoEpisodes = useMemo(() => {
    if (currentMediaType !== "anime") return false;

    if (isWatchLaterPage && realTimeDetails) {
      const details = realTimeDetails as AniListMediaDetail;
      const eps = details.nextAiringEpisode
        ? details.nextAiringEpisode.episode - 1
        : details.episodes;
      return !eps || eps <= 0;
    }

    const eps = movie.nextAiringEpisode
      ? movie.nextAiringEpisode.episode - 1
      : movie.episodes;
    return !eps || eps <= 0;
  }, [currentMediaType, isWatchLaterPage, realTimeDetails, movie]);

  const rating = useMemo(() => {
    if (movie.vote_average !== undefined && movie.vote_average !== null) {
      return movie.vote_average.toFixed(1);
    }
    const score = movie.averageScore as number | undefined;
    if (score !== undefined && score !== null) {
      return (score / 10).toFixed(1);
    }
    return "0.0";
  }, [movie]);

  const releaseYear = useMemo(() => {
    if (currentMediaType === "anime") {
      return (
        (movie.seasonYear as number) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.startDate as any)?.year ||
        "N/A"
      ).toString();
    }
    const date =
      (movie.release_date as string) || (movie.first_air_date as string);
    if (!date) return "N/A";
    const year = new Date(date).getFullYear();
    return isNaN(year) ? "N/A" : year.toString();
  }, [movie, currentMediaType]);

  const historyItem = useMemo(() => {
    return history.find(
      (h) => h.id === movie.id && h.media_type === currentMediaType,
    );
  }, [history, movie.id, currentMediaType]);

  const isResumable = !!historyItem;

  const watchUrl = useMemo(() => {
    if (!isResumable) {
      return `/${currentMediaType}/watch?id=${movie.id}`;
    }

    if (currentMediaType === "anime") {
      return `/anime/watch?id=${movie.id}${
        historyItem.episode ? `&ep=${historyItem.episode}` : ""
      }${historyItem.server ? `&server=${historyItem.server}` : ""}`;
    }

    return `/${currentMediaType}/watch?id=${movie.id}${
      historyItem.server ? `&server=${historyItem.server}` : ""
    }${historyItem.season ? `&season=${historyItem.season}` : ""}${
      historyItem.episode ? `&episode=${historyItem.episode}` : ""
    }`;
  }, [isResumable, historyItem, movie.id, currentMediaType]);

  const resumeText = useMemo(() => {
    if (!isResumable) return "Play Now";
    if (currentMediaType === "movie") return "Resume Watching";
    if (currentMediaType === "tv")
      return `Resume S${historyItem.season} E${historyItem.episode}`;
    if (currentMediaType === "anime") return `Resume Ep ${historyItem.episode}`;
    return "Resume";
  }, [isResumable, historyItem, currentMediaType]);

  const posterUrl = useMemo(() => {
    if (currentMediaType === "anime") {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.coverImage as any)?.extraLarge ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.coverImage as any)?.large ||
        movie.poster_path ||
        ""
      );
    }
    return movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : "";
  }, [currentMediaType, movie]);

  const previewUrl = useMemo(() => {
    if (currentMediaType === "anime") {
      return (
        movie.bannerImage ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.coverImage as any)?.extraLarge ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.coverImage as any)?.large ||
        ""
      );
    }
    const path = movie.backdrop_path || movie.poster_path;
    return path ? `${TMDB_IMAGE_BASE_URL}/original${path}` : "";
  }, [currentMediaType, movie]);

  const detailUrl = `/${currentMediaType}/detail?id=${movie.id}`;

  const inWatchlist = isInWatchlist(movie.id, currentMediaType);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...movie, media_type: currentMediaType });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isWatchLaterPage) return;

    hoverTimeoutRef.current = setTimeout(async () => {
      setShowHoverCard(true);
      if (!videoKey) {
        const type = movie.media_type === "tv" ? "tv" : "movie";
        const videos = await getMovieVideos(movie.id, type);
        const trailer =
          videos.results?.find(
            (v: { type: string; site: string; key: string }) =>
              v.type === "Trailer" && v.site === "YouTube",
          ) || videos.results?.[0];
        if (trailer) setVideoKey(trailer.key);
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowHoverCard(false);
    setIsVideoLoaded(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  return {
    currentMediaType,
    latestAiredEp,
    hasNoEpisodes,
    rating,
    releaseYear,
    isResumable,
    watchUrl,
    resumeText,
    posterUrl,
    previewUrl,
    detailUrl,
    inWatchlist,
    isHovered,
    showHoverCard,
    videoKey,
    isVideoLoaded,
    isMuted,
    setIsMuted,
    setIsVideoLoaded,
    iframeRef,
    handleWatchlistToggle,
    handleMouseEnter,
    handleMouseLeave,
    handleWatchClick,
  };
}
