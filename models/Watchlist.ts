import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  id: number; // external media ID
  media_type: "movie" | "tv" | "anime";
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any;
  bannerImage?: string | null;
  averageScore?: number | null;
  seasonYear?: number | null;
  status?: string | null;
  description?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genres?: any[];
}

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Number, required: true },
    media_type: {
      type: String,
      enum: ["movie", "tv", "anime"],
      required: true,
    },
    title: { type: String, required: false },
    name: { type: String, required: false },
    poster_path: { type: String, required: false },
    backdrop_path: { type: String, required: false },
    vote_average: { type: Number, required: false },
    overview: { type: String, required: false },
    release_date: { type: String, required: false },
    first_air_date: { type: String, required: false },
    coverImage: { type: Schema.Types.Mixed, required: false },
    bannerImage: { type: String, required: false },
    averageScore: { type: Number, required: false },
    seasonYear: { type: Number, required: false },
    status: { type: String, required: false },
    description: { type: String, required: false },
    genres: { type: [Schema.Types.Mixed], required: false },
  },
  {
    timestamps: true,
  },
);

// Ensure a user only has one watchlist entry per media id and type
WatchlistSchema.index({ userId: 1, id: 1, media_type: 1 }, { unique: true });

if (mongoose.models.Watchlist) {
  delete mongoose.models.Watchlist;
}

export const Watchlist: Model<IWatchlist> = mongoose.model<IWatchlist>(
  "Watchlist",
  WatchlistSchema,
);
