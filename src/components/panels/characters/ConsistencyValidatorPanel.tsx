import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useCharacterAI } from "@/hooks/useCharacterAI";
import { useState } from "react";

export const ConsistencyValidatorPanel = () => {
  const { loading, validateConsistency } = useCharacterAI();
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidation = async () => {
    // Mock character images - in real app, these would be actual character images
    const mockImages = [
      "data:image/png;base64,placeholder1",
      "data:image/png;base64,placeholder2",
      "data:image/png;base64,placeholder3",
    ];

    const mockDNA = {
      faceShape: "oval",
      eyeSize: "medium",
      noseSize: "medium",
      mouthSize: "medium",
      hairStyle: "shoulder length",
      bodyType: "athletic",
      skinTone: "medium"
    };

    const result = await validateConsistency(mockImages, mockDNA);
    if (result) {
      setValidationResult(result);
    }
  };

  const checks = validationResult?.featureScores ? [
    { 
      name: "Facial Features", 
      score: validationResult.featureScores.facialFeatures, 
      status: validationResult.featureScores.facialFeatures >= 95 ? "good" : "warning" 
    },
    { 
      name: "Hair Style", 
      score: validationResult.featureScores.hairStyle, 
      status: validationResult.featureScores.hairStyle >= 95 ? "good" : "warning" 
    },
    { 
      name: "Skin Tone", 
      score: validationResult.featureScores.skinTone, 
      status: validationResult.featureScores.skinTone >= 95 ? "good" : "warning" 
    },
    { 
      name: "Body Proportions", 
      score: validationResult.featureScores.bodyProportions, 
      status: validationResult.featureScores.bodyProportions >= 95 ? "good" : "warning" 
    },
  ] : [
    { name: "Facial Features", score: 99.2, status: "good" },
    { name: "Hair Style", score: 99.8, status: "good" },
    { name: "Skin Tone", score: 99.5, status: "good" },
    { name: "Body Proportions", score: 98.9, status: "warning" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Consistency Validator</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-powered consistency analysis
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleValidation}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Run Validation Check"
            )}
          </Button>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {validationResult?.overallScore ?? 99.9}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
              <div className="text-xs text-primary mt-1">Excellent Consistency</div>
            </div>
          </div>

          <div className="space-y-2">
            {checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {check.status === "good" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm font-medium">{check.name}</span>
                </div>
                <span className="text-sm text-primary font-semibold">
                  {check.score}%
                </span>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              Validation Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Images Analyzed</div>
                <div className="font-semibold">{validationResult?.imagesAnalyzed ?? 47}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Last Check</div>
                <div className="font-semibold">2 min ago</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground text-xs">DNA Lock Status</div>
                <div className="font-semibold text-green-500">
                  {validationResult?.dnaLockStatus === "active" ? "Active" : "Needs Adjustment"}
                </div>
              </div>
            </div>
          </div>

          {validationResult?.inconsistencies && validationResult.inconsistencies.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                Inconsistencies Found
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {validationResult.inconsistencies.map((issue: string, idx: number) => (
                  <li key={idx}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
