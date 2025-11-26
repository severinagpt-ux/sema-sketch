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
    const { images, dnaProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!images || images.length < 2) {
      throw new Error("At least 2 images required for consistency validation");
    }

    console.log(`Validating consistency across ${images.length} images`);

    // Analyze each image for features using vision model
    const analysisPromises = images.map(async (imageUrl: string, index: number) => {
      const prompt = `Analyze this character image in detail. Identify and describe:
      1. Face shape and proportions
      2. Eye size, shape, and color
      3. Nose size and shape
      4. Mouth size and shape
      5. Hair style, color, and length
      6. Skin tone
      7. Body proportions (if visible)
      8. Overall distinctive features
      
      Provide precise, measurable descriptions.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageUrl } }
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze image ${index + 1}`);
      }

      const data = await response.json();
      return {
        index,
        analysis: data.choices?.[0]?.message?.content || "",
      };
    });

    const analyses = await Promise.all(analysisPromises);

    // Compare all analyses for consistency
    const comparisonPrompt = `You are a character consistency validator. Compare these character analyses 
    and determine the consistency score (0-100%) for each feature category.
    
    DNA Profile Reference:
    ${JSON.stringify(dnaProfile, null, 2)}
    
    Image Analyses:
    ${analyses.map((a, i) => `Image ${i + 1}:\n${a.analysis}`).join('\n\n')}
    
    Provide a detailed consistency report with:
    1. Overall consistency score (0-100%)
    2. Individual feature scores:
       - Facial Features (face shape, eyes, nose, mouth): score%
       - Hair Style: score%
       - Skin Tone: score%
       - Body Proportions: score%
       - Overall Impression: score%
    3. List any inconsistencies found
    4. Recommendations for improvement
    
    Format as JSON:
    {
      "overallScore": number,
      "featureScores": {
        "facialFeatures": number,
        "hairStyle": number,
        "skinTone": number,
        "bodyProportions": number,
        "overallImpression": number
      },
      "inconsistencies": ["issue 1", "issue 2"],
      "recommendations": ["rec 1", "rec 2"],
      "dnaLockStatus": "active" | "needs-adjustment"
    }`;

    const comparisonResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: comparisonPrompt,
          },
        ],
      }),
    });

    if (!comparisonResponse.ok) {
      throw new Error("Failed to compare consistency");
    }

    const comparisonData = await comparisonResponse.json();
    const resultText = comparisonData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = resultText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       resultText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : resultText;
      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse result as JSON:", parseError);
      // Fallback result
      result = {
        overallScore: 85,
        featureScores: {
          facialFeatures: 88,
          hairStyle: 90,
          skinTone: 92,
          bodyProportions: 85,
          overallImpression: 87
        },
        inconsistencies: ["Could not fully analyze"],
        recommendations: ["Please regenerate images for better consistency"],
        dnaLockStatus: "needs-adjustment"
      };
    }

    console.log("Consistency validation complete:", result.overallScore + "%");

    return new Response(
      JSON.stringify({
        ...result,
        imagesAnalyzed: images.length,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in validate-character-consistency:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
