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
    const { characterData, viewType, dnaLock } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build prompt based on character DNA and view type
    let prompt = "";
    
    if (viewType === "multi-angle") {
      const { angle, dna } = characterData;
      prompt = `Professional character reference sheet, ${angle} view. 
      Character features: ${dna.faceShape} face shape, ${dna.eyeSize} eyes, ${dna.noseSize} nose, 
      ${dna.mouthSize} mouth, ${dna.hairStyle} hair, ${dna.bodyType} body type.
      ${dna.skinTone} skin tone. High quality, consistent lighting, white background, professional character design.`;
    } else if (viewType === "expression") {
      const { expression, character } = characterData;
      prompt = `Portrait of ${character.name}, showing ${expression} expression. 
      Character description: ${character.description}. 
      Consistent with character DNA: ${character.dna}. 
      Professional character art, high quality, detailed facial expression.`;
    } else if (viewType === "outfit") {
      const { outfit, character } = characterData;
      prompt = `Full body shot of ${character.name} wearing ${outfit.description}. 
      Character description: ${character.description}. 
      Style: ${outfit.season} ${outfit.category}. 
      Professional character design, high quality, consistent with character DNA.`;
    }

    // Add DNA locking prompt enhancement if enabled
    if (dnaLock && dnaLock.enabled) {
      prompt += ` CRITICAL: Maintain exact consistency with previous generations: ${dnaLock.referenceFeatures}. 
      Use identical facial features, proportions, and characteristics.`;
    }

    console.log("Generating image with prompt:", prompt);

    // Call Lovable AI image generation (Nano Banana)
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

    console.log("Successfully generated image");

    return new Response(
      JSON.stringify({ 
        imageUrl,
        dnaSignature: dnaLock?.enabled ? generateDNASignature(characterData) : null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-character-image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Generate DNA signature for consistency validation
function generateDNASignature(characterData: any): string {
  const features = characterData.dna || characterData.character?.dna;
  return JSON.stringify({
    faceShape: features?.faceShape,
    eyeSize: features?.eyeSize,
    noseSize: features?.noseSize,
    hairStyle: features?.hairStyle,
    timestamp: Date.now()
  });
}
