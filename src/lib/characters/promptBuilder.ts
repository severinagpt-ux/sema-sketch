import { ShotSpec } from './types';

interface CharacterInfo {
  name: string;
  description?: string;
  styleTags?: string;
}

export function buildPromptForShot(
  character: CharacterInfo,
  shot: ShotSpec
): string {
  const baseIdentity = `This is the same character: ${character.name}. ${character.description || 'A detailed character'}. Style: ${character.styleTags || 'realistic, detailed'}. Preserve face, body proportions, hairstyle, skin tone, and overall style exactly. Do not change age or ethnicity.`;

  const framing = (() => {
    switch (shot.framing) {
      case "full_body":
        return "Full-body shot, standing, entire body visible from head to feet.";
      case "mid":
        return "Medium shot, from head to waist.";
      case "head":
        return "Close-up portrait of the head and neck.";
    }
  })();

  const angle = (() => {
    if (shot.angleDeg === undefined) {
      return "Camera directly in front of the character.";
    }
    switch (shot.angleDeg) {
      case 0:
        return "Camera directly in front of the character, front view.";
      case 45:
        return "Camera at 3/4 view from the character's left side (45 degrees).";
      case 90:
        return "Perfect side profile from the character's left (90 degrees).";
      case 270:
        return "Perfect side profile from the character's right (270 degrees).";
      case 315:
        return "Camera at 3/4 view from the character's right side (315 degrees).";
      default:
        return `Camera at ${shot.angleDeg} degrees around the character.`;
    }
  })();

  const background = (() => {
    switch (shot.background) {
      case "white_room":
        return "Plain white photography studio backdrop, soft neutral lighting, clean and professional.";
      case "studio":
        return "Simple studio backdrop with subtle gradient, professional lighting setup.";
      case "in_world":
        return "Environment similar to the original reference, but clean and readable composition.";
    }
  })();

  const expression = shot.type === "emotion" && shot.expression
    ? `Facial expression: ${shot.expression}. Keep the exact same face identity, only change the expression to show ${shot.expression} emotion clearly.`
    : "Neutral, relaxed expression unless specified otherwise.";

  const outfit = shot.type === "outfit_angle" && shot.outfitId
    ? getOutfitDescription(shot.outfitId)
    : "Use the character's main outfit as shown in the reference image.";

  const parts = [
    baseIdentity,
    framing,
    angle,
    background,
    expression,
    outfit,
    "High quality, professional photography, consistent lighting, sharp details."
  ];

  return parts.join(" ");
}

function getOutfitDescription(outfitId: string): string {
  switch (outfitId) {
    case "default":
      return "Outfit variant: default. Use the character's original outfit from the reference image, keeping body, face, and hair identical.";
    case "casual":
      return "Outfit variant: casual. Change clothing to casual everyday wear (t-shirt, jeans, sneakers style), but keep body, face, and hair identical to the reference.";
    case "battle":
      return "Outfit variant: battle/action. Change clothing to action-ready combat or adventure gear appropriate for the character, but keep body, face, and hair identical to the reference.";
    default:
      return `Outfit variant: ${outfitId}. Change clothing style accordingly, but keep body, face, and hair identical to the reference.`;
  }
}

export function getShotDisplayName(shot: ShotSpec): string {
  if (shot.type === 'emotion' && shot.expression) {
    return shot.expression.charAt(0).toUpperCase() + shot.expression.slice(1);
  }
  
  if (shot.type === 'outfit_angle' && shot.outfitId) {
    const angle = shot.angleDeg === 0 ? 'Front' : shot.angleDeg === 45 ? '3/4 L' : '3/4 R';
    return `${shot.outfitId.charAt(0).toUpperCase() + shot.outfitId.slice(1)} - ${angle}`;
  }

  const angleMap: Record<number, string> = {
    0: 'Front',
    45: '3/4 Left',
    90: 'Profile L',
    270: 'Profile R', 
    315: '3/4 Right'
  };

  const angleName = shot.angleDeg !== undefined ? angleMap[shot.angleDeg] || `${shot.angleDeg}°` : 'Front';
  const framingName = shot.framing === 'full_body' ? 'Full Body' : shot.framing === 'head' ? 'Head' : 'Mid';
  
  return `${framingName} - ${angleName}`;
}
