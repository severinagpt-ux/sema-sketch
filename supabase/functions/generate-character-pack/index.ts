import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShotSpec {
  shotKey: string;
  type: string;
  angleDeg?: number;
  framing: string;
  expression?: string;
  outfitId?: string;
  aspectRatio: string;
  resolution: string;
  background: string;
}

// Character Pack V1 shot definitions
const CHARACTER_PACK_V1: ShotSpec[] = [
  // Orthographic full body
  { shotKey: "full_body_front_0deg", type: "orthographic_body", angleDeg: 0, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room" },
  { shotKey: "full_body_3q_left_45deg", type: "orthographic_body", angleDeg: 45, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room" },
  { shotKey: "full_body_3q_right_315deg", type: "orthographic_body", angleDeg: 315, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room" },
  { shotKey: "full_body_profile_left_90deg", type: "orthographic_body", angleDeg: 90, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room" },
  { shotKey: "full_body_profile_right_270deg", type: "orthographic_body", angleDeg: 270, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room" },
  // Head angles
  { shotKey: "head_front", type: "head_angle", framing: "head", aspectRatio: "4:5", resolution: "1K", background: "white_room" },
  { shotKey: "head_3q_left", type: "head_angle", angleDeg: 45, framing: "head", aspectRatio: "4:5", resolution: "1K", background: "white_room" },
  { shotKey: "head_3q_right", type: "head_angle", angleDeg: 315, framing: "head", aspectRatio: "4:5", resolution: "1K", background: "white_room" },
  { shotKey: "head_profile_left", type: "head_angle", angleDeg: 90, framing: "head", aspectRatio: "4:5", resolution: "1K", background: "white_room" },
  { shotKey: "head_profile_right", type: "head_angle", angleDeg: 270, framing: "head", aspectRatio: "4:5", resolution: "1K", background: "white_room" },
  // Emotions
  ...["neutral", "happy", "sad", "angry", "surprised", "smirk", "serious"].map(emotion => ({
    shotKey: `emotion_front_${emotion}`, type: "emotion", framing: "head", expression: emotion, aspectRatio: "1:1", resolution: "1K", background: "white_room"
  })),
  // Outfits
  ...["default", "casual", "battle"].flatMap(outfitId => [
    { shotKey: `outfit_${outfitId}_front`, type: "outfit_angle", angleDeg: 0, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room", outfitId },
    { shotKey: `outfit_${outfitId}_3q_left`, type: "outfit_angle", angleDeg: 45, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room", outfitId },
    { shotKey: `outfit_${outfitId}_3q_right`, type: "outfit_angle", angleDeg: 315, framing: "full_body", aspectRatio: "3:4", resolution: "2K", background: "white_room", outfitId },
  ]),
];

function buildPromptForShot(character: any, shot: ShotSpec): string {
  const baseIdentity = `This is the same character: ${character.name}. ${character.description || 'A detailed character'}. Style: ${character.style_tags || 'realistic, detailed'}. Preserve face, body proportions, hairstyle, skin tone, and overall style exactly. Do not change age or ethnicity.`;
  
  const framing = shot.framing === "full_body" 
    ? "Full-body shot, standing, entire body visible from head to feet."
    : shot.framing === "mid" 
    ? "Medium shot, from head to waist."
    : "Close-up portrait of the head and neck.";

  const angleMap: Record<number, string> = {
    0: "Camera directly in front of the character, front view.",
    45: "Camera at 3/4 view from the character's left side (45 degrees).",
    90: "Perfect side profile from the character's left (90 degrees).",
    270: "Perfect side profile from the character's right (270 degrees).",
    315: "Camera at 3/4 view from the character's right side (315 degrees).",
  };
  const angle = shot.angleDeg !== undefined ? (angleMap[shot.angleDeg] || `Camera at ${shot.angleDeg} degrees.`) : "Camera directly in front.";

  const bgMap: Record<string, string> = {
    white_room: "Plain white photography studio backdrop, soft neutral lighting.",
    studio: "Simple studio backdrop with subtle gradient.",
    in_world: "Environment similar to the original reference.",
  };
  const background = bgMap[shot.background] || bgMap.white_room;

  const expression = shot.type === "emotion" && shot.expression
    ? `Facial expression: ${shot.expression}. Keep the exact same face, only change expression.`
    : "Neutral, relaxed expression.";

  const outfitMap: Record<string, string> = {
    default: "Use the character's original outfit.",
    casual: "Change to casual everyday wear (t-shirt, jeans), keep face/body identical.",
    battle: "Change to action/combat gear, keep face/body identical.",
  };
  const outfit = shot.outfitId ? outfitMap[shot.outfitId] || outfitMap.default : "Use original outfit.";

  return [baseIdentity, framing, angle, background, expression, outfit, "High quality, professional photography."].join(" ");
}

async function generateImageWithGemini(prompt: string, referenceImageUrl: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
  console.log("Reference image:", referenceImageUrl);

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: referenceImageUrl } }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      if (response.status === 429) {
        throw new Error("Rate limited - please try again later");
      }
      if (response.status === 402) {
        throw new Error("API credits exhausted");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).substring(0, 500));
      return null;
    }

    return imageUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}

// Background task runner
async function runBatchGeneration(
  supabase: any,
  character: any,
  batch: any,
  shots: any[]
) {
  let completedCount = 0;
  let failedCount = 0;

  for (const shot of shots) {
    try {
      // Update shot status to generating
      await supabase.from("shots").update({ status: "generating" }).eq("id", shot.id);

      const spec = CHARACTER_PACK_V1.find(s => s.shotKey === shot.shot_key);
      if (!spec) {
        throw new Error(`Spec not found for ${shot.shot_key}`);
      }
      
      const prompt = buildPromptForShot(character, spec);
      const imageUrl = await generateImageWithGemini(prompt, character.reference_url);
      
      if (imageUrl) {
        await supabase.from("shots").update({ 
          status: "done", 
          image_url: imageUrl 
        }).eq("id", shot.id);
        completedCount++;
      } else {
        await supabase.from("shots").update({ 
          status: "failed", 
          error_message: "No image generated" 
        }).eq("id", shot.id);
        failedCount++;
      }

      // Update batch progress
      await supabase.from("character_batches").update({ 
        completed_shots: completedCount 
      }).eq("id", batch.id);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Shot ${shot.shot_key} failed:`, error);
      await supabase.from("shots").update({ 
        status: "failed", 
        error_message: error instanceof Error ? error.message : "Unknown error"
      }).eq("id", shot.id);
      failedCount++;
    }
  }

  // Finalize batch
  const finalStatus = failedCount === shots.length ? "failed" : "completed";
  await supabase.from("character_batches").update({ 
    status: finalStatus,
    completed_shots: completedCount,
    error_message: failedCount > 0 ? `${failedCount} shots failed` : null
  }).eq("id", batch.id);

  // Update character generation count
  await supabase.from("characters").update({
    total_generations: (character.total_generations || 0) + completedCount
  }).eq("id", character.id);

  console.log(`Batch ${batch.id} completed: ${completedCount}/${shots.length} successful`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterId } = await req.json();
    
    if (!characterId) {
      return new Response(JSON.stringify({ error: "characterId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load character
    const { data: character, error: charError } = await supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .single();

    if (charError || !character) {
      console.error("Character not found:", charError);
      return new Response(JSON.stringify({ error: "Character not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!character.reference_url) {
      return new Response(JSON.stringify({ error: "Character has no reference image" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Starting batch for character:", character.name);

    // Create batch
    const { data: batch, error: batchError } = await supabase
      .from("character_batches")
      .insert({
        character_id: characterId,
        status: "running",
        total_shots: CHARACTER_PACK_V1.length,
        completed_shots: 0,
      })
      .select()
      .single();

    if (batchError || !batch) {
      console.error("Failed to create batch:", batchError);
      return new Response(JSON.stringify({ error: "Failed to create batch" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create all shot records
    const shotInserts = CHARACTER_PACK_V1.map((spec: ShotSpec) => ({
      batch_id: batch.id,
      shot_key: spec.shotKey,
      type: spec.type,
      angle_deg: spec.angleDeg,
      framing: spec.framing,
      expression: spec.expression,
      outfit_id: spec.outfitId,
      aspect_ratio: spec.aspectRatio,
      resolution: spec.resolution,
      background: spec.background,
      status: "pending",
    }));

    const { data: shots, error: shotsError } = await supabase
      .from("shots")
      .insert(shotInserts)
      .select();

    if (shotsError) {
      console.error("Failed to create shots:", shotsError);
      await supabase.from("character_batches").update({ status: "failed", error_message: "Failed to create shots" }).eq("id", batch.id);
      return new Response(JSON.stringify({ error: "Failed to create shots" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start background generation using waitUntil
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runBatchGeneration(supabase, character, batch, shots));
    } else {
      // Fallback: run synchronously (not ideal but works)
      runBatchGeneration(supabase, character, batch, shots);
    }

    // Return immediately with batch info
    return new Response(JSON.stringify({ 
      batch: batch,
      totalShots: CHARACTER_PACK_V1.length,
      message: "Batch started, check status periodically"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-character-pack:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
