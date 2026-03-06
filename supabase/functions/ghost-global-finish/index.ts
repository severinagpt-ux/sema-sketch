import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, finishType, style, intensity, prompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const finishPrompts: Record<string, string> = {
      harmonize: `Apply a professional finishing pass to harmonize the overall style, lighting, and color consistency of this image. Maintain all content and composition. Subtle, cohesive enhancement. Intensity: ${intensity || 'medium'}.`,
      relight: `Re-interpret the lighting of this entire image. Apply ${style || 'soft cinematic'} lighting. Preserve all subjects and composition. ${prompt || ''}`,
      color_grade: `Apply professional color grading to this image. Style: ${style || 'cinematic warm'}. Intensity: ${intensity || 'medium'}. Preserve detail and composition.`,
      style_unify: `Unify the visual style across this entire image. Target style: ${style || 'cohesive cinematic'}. Fix any inconsistencies in rendering style, lighting, or color treatment.`,
      enhance: `Enhance this image professionally. Improve detail, color depth, and overall polish. Style: ${style || 'editorial'}. Do not change composition or content.`,
      depth_of_field: `Apply a natural depth-of-field effect. Keep the main subject sharp. ${prompt || 'Blur background naturally.'}`,
    };

    const editPrompt = finishPrompts[finishType || 'harmonize'] || finishPrompts.harmonize;
    const fullPrompt = prompt ? `${editPrompt}\nAdditional: ${prompt}` : editPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{
          role: "user",
          content: imageUrl
            ? [
                { type: "text", text: fullPrompt },
                { type: "image_url", image_url: { url: imageUrl } },
              ]
            : fullPrompt,
        }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const resultImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const description = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({
      imageUrl: resultImage || null,
      description: description || '',
      finishType: finishType || 'harmonize',
      model: 'NANO_BANANA_PRO',
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Global Finish error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
