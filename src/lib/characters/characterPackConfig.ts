import { ShotSpec } from './types';

// Standard emotions for expression sheet
const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "smirk", "serious"] as const;

// Standard outfit variants
const OUTFITS = ["default", "casual", "battle"] as const;

export const CHARACTER_PACK_V1: ShotSpec[] = [
  // --- Orthographic full body (neutral, white room) ---
  {
    shotKey: "full_body_front_0deg",
    type: "orthographic_body",
    angleDeg: 0,
    framing: "full_body",
    aspectRatio: "3:4",
    resolution: "2K",
    background: "white_room",
  },
  {
    shotKey: "full_body_3q_left_45deg",
    type: "orthographic_body",
    angleDeg: 45,
    framing: "full_body",
    aspectRatio: "3:4",
    resolution: "2K",
    background: "white_room",
  },
  {
    shotKey: "full_body_3q_right_315deg",
    type: "orthographic_body",
    angleDeg: 315,
    framing: "full_body",
    aspectRatio: "3:4",
    resolution: "2K",
    background: "white_room",
  },
  {
    shotKey: "full_body_profile_left_90deg",
    type: "orthographic_body",
    angleDeg: 90,
    framing: "full_body",
    aspectRatio: "3:4",
    resolution: "2K",
    background: "white_room",
  },
  {
    shotKey: "full_body_profile_right_270deg",
    type: "orthographic_body",
    angleDeg: 270,
    framing: "full_body",
    aspectRatio: "3:4",
    resolution: "2K",
    background: "white_room",
  },

  // --- Head angles (neutral) ---
  {
    shotKey: "head_front",
    type: "head_angle",
    framing: "head",
    aspectRatio: "4:5",
    resolution: "1K",
    background: "white_room",
  },
  {
    shotKey: "head_3q_left",
    type: "head_angle",
    angleDeg: 45,
    framing: "head",
    aspectRatio: "4:5",
    resolution: "1K",
    background: "white_room",
  },
  {
    shotKey: "head_3q_right",
    type: "head_angle",
    angleDeg: 315,
    framing: "head",
    aspectRatio: "4:5",
    resolution: "1K",
    background: "white_room",
  },
  {
    shotKey: "head_profile_left",
    type: "head_angle",
    angleDeg: 90,
    framing: "head",
    aspectRatio: "4:5",
    resolution: "1K",
    background: "white_room",
  },
  {
    shotKey: "head_profile_right",
    type: "head_angle",
    angleDeg: 270,
    framing: "head",
    aspectRatio: "4:5",
    resolution: "1K",
    background: "white_room",
  },

  // --- Emotion sheet (front headshot) ---
  ...EMOTIONS.map((emotion) => ({
    shotKey: `emotion_front_${emotion}`,
    type: "emotion" as const,
    framing: "head" as const,
    expression: emotion,
    aspectRatio: "1:1" as const,
    resolution: "1K" as const,
    background: "white_room" as const,
  })),

  // --- Outfit variants (front + 3/4 L + 3/4 R) ---
  ...OUTFITS.flatMap((outfitId) => [
    {
      shotKey: `outfit_${outfitId}_front`,
      type: "outfit_angle" as const,
      angleDeg: 0,
      framing: "full_body" as const,
      aspectRatio: "3:4" as const,
      resolution: "2K" as const,
      background: "white_room" as const,
      outfitId,
    },
    {
      shotKey: `outfit_${outfitId}_3q_left`,
      type: "outfit_angle" as const,
      angleDeg: 45,
      framing: "full_body" as const,
      aspectRatio: "3:4" as const,
      resolution: "2K" as const,
      background: "white_room" as const,
      outfitId,
    },
    {
      shotKey: `outfit_${outfitId}_3q_right`,
      type: "outfit_angle" as const,
      angleDeg: 315,
      framing: "full_body" as const,
      aspectRatio: "3:4" as const,
      resolution: "2K" as const,
      background: "white_room" as const,
      outfitId,
    },
  ]),
];

// Group shots by category for UI display
export function groupShotsByCategory(shots: ShotSpec[]) {
  return {
    turnaround: shots.filter(s => s.type === 'orthographic_body'),
    headAngles: shots.filter(s => s.type === 'head_angle'),
    emotions: shots.filter(s => s.type === 'emotion'),
    outfits: {
      default: shots.filter(s => s.type === 'outfit_angle' && s.outfitId === 'default'),
      casual: shots.filter(s => s.type === 'outfit_angle' && s.outfitId === 'casual'),
      battle: shots.filter(s => s.type === 'outfit_angle' && s.outfitId === 'battle'),
    },
  };
}

export const SHOT_COUNT = CHARACTER_PACK_V1.length;
