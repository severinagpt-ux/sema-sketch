import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, roiDescription, tool, sessionDigest } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Ghost Engine's Visual Inspector — an expert image analysis system for a professional AI-native image editor.

Your job is to analyze an image and return structured JSON intelligence that helps the editing tools work precisely.

You MUST return valid JSON matching this schema:
{
  "imageType": "PORTRAIT" | "PRODUCT" | "LANDSCAPE" | "COMPOSITE" | "TEXT" | "MIXED",
  "subjects": [{ "id": string, "label": string, "type": string, "confidence": number, "suggestedActions": string[] }],
  "composition": {
    "ruleOfThirds": number (0-1),
    "leadingLines": boolean,
    "symmetry": number (0-1),
    "depthLayers": number,
    "dominantColors": string[],
    "lightingDirection": string,
    "lightingQuality": string
  },
  "technicalQuality": {
    "sharpness": number (0-100),
    "noise": number (0-100),
    "exposure": number (-2 to 2),
    "contrast": number (0-100),
    "colorBalance": number (0-100),
    "dynamicRange": number (0-100)
  },
  "suggestedTools": [{ "tool": string, "reason": string, "priority": "HIGH"|"MEDIUM"|"LOW", "editClass": string, "estimatedModel": string }],
  "complexityScore": number (0-100),
  "routingRecommendation": "NANO_BANANA_2" | "NANO_BANANA_PRO"
}

${tool ? `The active tool is: ${tool}. Focus analysis on what's relevant for this tool.` : ''}
${roiDescription ? `The user has indicated a region of interest: ${roiDescription}` : ''}
${sessionDigest ? `Session context: ${JSON.stringify(sessionDigest)}` : ''}

Be precise and professional. This data drives editing decisions.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageUrl) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Analyze this image for Ghost Engine. Return structured JSON only." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: "No image provided. Return a default analysis structure with null values.",
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      analysis = { error: "Failed to parse analysis", raw: content };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Visual Inspector error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
