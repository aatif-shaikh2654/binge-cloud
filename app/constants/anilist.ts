export const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export const ANIME_MEDIA_FRAGMENT = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    large
    extraLarge
    color
  }
  bannerImage
  episodes
  averageScore
  popularity
  trending
  genres
  status
  description(asHtml: false)
  season
  seasonYear
  format
  studios(isMain: true) {
    nodes {
      name
    }
  }
  nextAiringEpisode {
    episode
  }
`;

export const ANIME_PAGE_QUERY = `
  query AnimeList($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
        total
      }
      media(type: ANIME, sort: $sort, search: $search, isAdult: false) {
        ${ANIME_MEDIA_FRAGMENT}
      }
    }
  }
`;

export const ANIME_DETAIL_QUERY = `
  query AnimeDetail($id: Int) {
    Media(id: $id, type: ANIME, isAdult: false) {
      id
      title { romaji english native }
      coverImage { large extraLarge color }
      bannerImage
      episodes
      duration
      averageScore
      popularity
      trending
      genres
      status
      description(asHtml: false)
      season
      seasonYear
      format
      source
      countryOfOrigin
      synonyms
      startDate { year month day }
      endDate { year month day }
      studios(isMain: true) { nodes { name siteUrl } }
      tags { name rank isMediaSpoiler }
      trailer { id site }
      characters(sort: [ROLE, RELEVANCE], perPage: 12) {
        edges {
          role
          node {
            id
            name { first last full native }
            image { large }
          }
          voiceActors(language: JAPANESE) {
            id
            name { first last full }
            image { large }
            language: languageV2
          }
        }
      }
      relations {
        edges {
          relationType(version: 2)
          node {
            ${ANIME_MEDIA_FRAGMENT}
            type
          }
        }
      }
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
      nextAiringEpisode {
        episode
        airingAt
      }
    }
  }
`;

export const FORMAT_LABEL: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
};

export const STATUS_LABEL: Record<string, string> = {
  FINISHED: "Finished",
  RELEASING: "Airing",
  NOT_YET_RELEASED: "Upcoming",
  CANCELLED: "Cancelled",
  HIATUS: "Hiatus",
};
