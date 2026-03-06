import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, action, roiDescription, prompt, modelTier, editMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Phase 1: Intent Scout (analysis model)
    if (editMode === 'intent_scout') {
      const scoutPrompt = `You are Ghost Engine's Intent Scout. Given an image and a region description, infer the most likely editing intent.

Return valid JSON:
{
  "predictedAction": "fix_eyelash" | "remove_blemish" | "clean_lip_edge" | "restore_iris_detail" | "remove_stray_hair" | "heal_skin_patch" | "repair_seam" | "remove_dust" | "repair_texture" | "remove_object" | "clean_reflection",
  "targetDescription": string,
  "protectedRegions": string[],
  "prompt": string (the editing instruction for the patch worker),
  "negativePrompt": string,
  "confidence": number (0-1),
  "shouldAutoRun": boolean,
  "recommendedModel": "NANO_BANANA_2" | "NANO_BANANA_PRO"
}

Region: ${roiDescription || 'Full image'}
User hint: ${prompt || 'None'}`;

      const scoutResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: scoutPrompt },
            {
              role: "user",
              content: imageUrl
                ? [
                    { type: "text", text: "Analyze this image region and infer editing intent. Return JSON only." },
                    { type: "image_url", image_url: { url: imageUrl } },
                  ]
                : "No image. Return default intent.",
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!scoutResponse.ok) {
        const status = scoutResponse.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("Scout AI error");
      }

      const scoutData = await scoutResponse.json();
      const content = scoutData.choices?.[0]?.message?.content;
      let intent;
      try { intent = JSON.parse(content); } catch { intent = { error: "Parse failed", raw: content }; }

      return new Response(JSON.stringify({ phase: 'intent', ...intent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Phase 2: Patch Worker (image generation model)
    const selectedModel = modelTier === 'NANO_BANANA_PRO'
      ? 'google/gemini-3-pro-image-preview'
      : 'google/gemini-2.5-flash-image';

    const patchPrompt = action
      ? buildPatchPrompt(action, prompt || '', roiDescription || '')
      : prompt || 'Clean up and repair this image region while preserving surrounding detail.';

    const messages: any[] = [
      {
        role: "user",
        content: imageUrl
          ? [
              { type: "text", text: patchPrompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ]
          : patchPrompt,
      },
    ];

    const patchResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!patchResponse.ok) {
      const status = patchResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("Patch worker AI error");
    }

    const patchData = await patchResponse.json();
    const patchImage = patchData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const patchText = patchData.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({
      phase: 'patch',
      imageUrl: patchImage || null,
      description: patchText || '',
      model: selectedModel,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Smart Heal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildPatchPrompt(action: string, userPrompt: string, roi: string): string {
  const actionPrompts: Record<string, string> = {
    fix_eyelash: `Carefully repair and restore the eyelashes in this image. Preserve iris, sclera, eyebrow, and eyelid contour. Keep surrounding skin texture intact. Do not change eye color or shape.`,
    remove_blemish: `Remove the blemish/imperfection while preserving natural skin texture. Match surrounding skin tone and texture seamlessly. Do not over-smooth or create artificial-looking skin.`,
    clean_lip_edge: `Clean up and sharpen the lip edge/lipline. Preserve natural lip color and texture. Keep surrounding skin untouched.`,
    restore_iris_detail: `Restore and enhance iris detail and clarity. Preserve natural eye color. Keep pupil, sclera, and surrounding features intact.`,
    remove_stray_hair: `Remove flyaway/stray hairs while preserving the main hair structure and surrounding detail. Keep background clean.`,
    heal_skin_patch: `Heal this skin area by matching surrounding texture and tone. Maintain pore structure and natural variation. No artificial smoothing.`,
    repair_seam: `Repair the visible seam/join in the garment or surface. Match texture and pattern on both sides seamlessly.`,
    remove_dust: `Remove dust particles and spots. Preserve underlying detail and texture completely.`,
    repair_texture: `Repair and restore the damaged texture in this area. Match surrounding material appearance.`,
    remove_object: `Remove the unwanted object and fill the area naturally using surrounding context. Preserve perspective and lighting.`,
    clean_reflection: `Clean up the unwanted reflection while preserving the surface material appearance.`,
  };

  const base = actionPrompts[action] || `Perform a local corrective edit: ${action}`;
  const roiContext = roi ? `\nFocus area: ${roi}` : '';
  const userContext = userPrompt ? `\nAdditional instruction: ${userPrompt}` : '';

  return `${base}${roiContext}${userContext}\n\nCRITICAL: Only modify the targeted area. Preserve ALL surrounding pixels. Maintain spatial alignment and proportions exactly.`;
}
