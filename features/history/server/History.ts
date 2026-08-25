import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  id: number; // external media ID
  media_type: "movie" | "tv" | "anime";
  title: string;
  poster_path: string;
  backdrop_path: string;
  server: string;
  season?: number;
  episode?: number;
  watchedAt: number;
  currentTime?: number;
  duration?: number;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Number, required: true },
    media_type: { type: String, enum: ["movie", "tv", "anime"], required: true },
    title: { type: String, required: true },
    poster_path: { type: String, required: false },
    backdrop_path: { type: String, required: false },
    server: { type: String, required: true },
    season: { type: Number, required: false },
    episode: { type: Number, required: false },
    watchedAt: { type: Number, required: true },
    currentTime: { type: Number, required: false },
    duration: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

// Ensure a user only has one history entry per media id and type
HistorySchema.index({ userId: 1, id: 1, media_type: 1 }, { unique: true });

if (mongoose.models.History) {
  delete mongoose.models.History;
}

export const History: Model<IHistory> = mongoose.model<IHistory>("History", HistorySchema);
