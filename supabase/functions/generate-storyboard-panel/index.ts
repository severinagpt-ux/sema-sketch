import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scriptDescription, visualStyle, cameraAngle, lighting, characters, props } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build comprehensive StoryboardForge prompt
    const prompt = `Professional storyboard panel illustration.
    
    Scene Description: ${scriptDescription}
    
    Visual Style: ${visualStyle.name || 'Cinematic'}
    - Color Palette: ${visualStyle.colorPalette || 'Natural, balanced colors'}
    - Lighting Style: ${lighting || 'Natural lighting'}
    - Mood: ${visualStyle.mood || 'Dramatic'}
    
    Camera Setup:
    - Angle: ${cameraAngle || 'Medium shot'}
    - Composition: Rule of thirds, professional framing
    
    ${characters && characters.length > 0 ? `Characters in scene: ${characters.join(', ')}` : ''}
    ${props && props.length > 0 ? `Props/Elements: ${props.join(', ')}` : ''}
    
    Style: Professional storyboard illustration, clear composition, suitable for film production, 
    detailed enough to guide cinematography but sketch-like storyboard aesthetic.
    Black and white or limited color, clear line work, annotations-ready.`;

    console.log("Generating storyboard panel with prompt:", prompt);

    // Call Lovable AI image generation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI generation failed: ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    console.log("Successfully generated storyboard panel");

    // Generate additional metadata using AI
    const analysisPrompt = `Analyze this storyboard panel and provide:
    1. Shot composition analysis
    2. Suggested camera movements
    3. Key visual elements
    4. Lighting setup recommendations
    
    Based on: ${scriptDescription}`;

    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      }),
    });

    let analysis = "Analysis unavailable";
    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      analysis = analysisData.choices?.[0]?.message?.content || analysis;
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        analysis,
        metadata: {
          visualStyle: visualStyle.name,
          cameraAngle,
          lighting,
          characters,
          props
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-storyboard-panel:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
