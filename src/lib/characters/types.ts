export type ShotType =
  | "orthographic_body"
  | "head_angle"
  | "emotion"
  | "outfit_angle"
  | "feature_closeup";

export type Framing = "full_body" | "mid" | "head";
export type AspectRatio = "3:4" | "4:5" | "1:1" | "16:9";
export type Resolution = "1K" | "2K" | "4K";
export type Background = "white_room" | "studio" | "in_world";
export type ShotStatus = "pending" | "generating" | "done" | "failed";
export type BatchStatus = "pending" | "running" | "completed" | "failed";

export interface ShotSpec {
  shotKey: string;
  type: ShotType;
  angleDeg?: number;
  framing: Framing;
  expression?: string;
  outfitId?: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  background: Background;
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  styleTags?: string;
  referenceUrl?: string;
  role?: string;
  personalityType?: string;
  consistencyScore?: number;
  totalGenerations?: number;
  thumbnailUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterBatch {
  id: string;
  characterId: string;
  status: BatchStatus;
  errorMessage?: string;
  totalShots: number;
  completedShots: number;
  createdAt: string;
  updatedAt: string;
}

export interface Shot {
  id: string;
  batchId: string;
  shotKey: string;
  type: ShotType;
  angleDeg?: number;
  framing: Framing;
  expression?: string;
  outfitId?: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  background: Background;
  status: ShotStatus;
  imageUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterWithBatches extends Character {
  batches?: CharacterBatch[];
}

export interface BatchWithShots extends CharacterBatch {
  shots?: Shot[];
}
