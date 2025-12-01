import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCharacterAI } from "@/hooks/useCharacterAI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

interface CharacterCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (characterId: string) => void;
}

type WizardStep = 'basic' | 'dna' | 'generate' | 'validate';

export const CharacterCreationWizard = ({ open, onClose, onComplete }: CharacterCreationWizardProps) => {
  const [step, setStep] = useState<WizardStep>('basic');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [personalityType, setPersonalityType] = useState('');
  const [description, setDescription] = useState('');
  
  const [dna, setDna] = useState({
    faceShape: 7,
    eyeSize: 5,
    noseWidth: 6,
    mouthSize: 5,
    jawDefinition: 7,
    skinTone: 5,
    hairVolume: 8,
    bodyBuild: 6
  });

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { loading, generateCharacterImage, validateConsistency } = useCharacterAI();
  const [validationResult, setValidationResult] = useState<any>(null);

  const stepProgress = {
    basic: 25,
    dna: 50,
    generate: 75,
    validate: 100
  };

  const handleNext = () => {
    if (step === 'basic') {
      if (!name.trim()) {
        toast.error('Please enter a character name');
        return;
      }
      setStep('dna');
    } else if (step === 'dna') {
      setStep('generate');
    } else if (step === 'generate') {
      setStep('validate');
    }
  };

  const handleBack = () => {
    if (step === 'dna') setStep('basic');
    else if (step === 'generate') setStep('dna');
    else if (step === 'validate') setStep('generate');
  };

  const generateViews = async () => {
    const characterData = {
      name,
      description,
      dna: {
        faceShape: dna.faceShape.toString(),
        eyeSize: dna.eyeSize.toString(),
        noseSize: dna.noseWidth.toString(),
        mouthSize: dna.mouthSize.toString(),
        hairStyle: "medium",
        bodyType: dna.bodyBuild.toString(),
        skinTone: dna.skinTone.toString()
      }
    };

    const dnaLock = {
      enabled: true,
      referenceFeatures: JSON.stringify(characterData.dna)
    };

    const angles = ['front', '3/4', 'side', 'back'];
    const images: string[] = [];

    for (const angle of angles) {
      const data = await generateCharacterImage(
        { ...characterData, angle },
        'multi-angle',
        dnaLock
      );
      if (data?.imageUrl) {
        images.push(data.imageUrl);
      }
    }

    setGeneratedImages(images);
    if (images.length > 0) {
      toast.success('Multi-angle views generated!');
    }
  };

  const runValidation = async () => {
    if (generatedImages.length === 0) {
      toast.error('No images to validate');
      return;
    }

    const dnaProfile = {
      faceShape: dna.faceShape.toString(),
      eyeSize: dna.eyeSize.toString(),
      noseSize: dna.noseWidth.toString(),
      mouthSize: dna.mouthSize.toString(),
      hairStyle: "medium",
      bodyType: dna.bodyBuild.toString(),
      skinTone: dna.skinTone.toString()
    };

    const result = await validateConsistency(generatedImages, dnaProfile);
    setValidationResult(result);
  };

  const saveCharacter = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: character, error: charError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name,
          role,
          personality_type: personalityType,
          consistency_score: validationResult?.overallScore || 0,
          total_generations: generatedImages.length,
          thumbnail_url: generatedImages[0] || null
        })
        .select()
        .single();

      if (charError) throw charError;

      // Save images
      const imageInserts = generatedImages.map((url, idx) => ({
        character_id: character.id,
        image_url: url,
        image_type: 'angle',
        metadata: { angle: ['front', '3/4', 'side', 'back'][idx] }
      }));

      const { error: imgError } = await supabase
        .from('character_images')
        .insert(imageInserts);

      if (imgError) throw imgError;

      toast.success('Character created successfully!');
      onComplete(character.id);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save character');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Character
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Progress value={stepProgress[step]} />
            <p className="text-xs text-muted-foreground mt-2">
              Step {Object.keys(stepProgress).indexOf(step) + 1} of 4
            </p>
          </div>

          {step === 'basic' && (
            <div className="space-y-4">
              <div>
                <Label>Character Name *</Label>
                <Input 
                  placeholder="e.g., Sarah Chen" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input 
                  placeholder="e.g., Protagonist, Antagonist" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <Label>Personality Type</Label>
                <Input 
                  placeholder="e.g., INFJ, ENTJ" 
                  value={personalityType}
                  onChange={(e) => setPersonalityType(e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input 
                  placeholder="Brief character description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 'dna' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Define the character's DNA profile for consistent generation
              </p>
              {Object.entries(dna).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <Slider 
                    value={[value]} 
                    min={0} 
                    max={10} 
                    step={1}
                    onValueChange={([v]) => setDna({ ...dna, [key]: v })}
                  />
                  <span className="text-xs text-muted-foreground">{value}/10</span>
                </div>
              ))}
            </div>
          )}

          {step === 'generate' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate multi-angle views with DNA lock enabled
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={generateViews}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Multi-Angle Views
                  </>
                )}
              </Button>

              {generatedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {generatedImages.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'validate' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Validate consistency across generated views
              </p>
              <Button 
                className="w-full" 
                onClick={runValidation}
                disabled={loading || generatedImages.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Run Consistency Validation'
                )}
              </Button>

              {validationResult && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-center mb-3">
                    <div className="text-4xl font-bold text-primary">
                      {validationResult.overallScore}%
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Consistency</p>
                  </div>
                  <Badge variant={validationResult.overallScore >= 95 ? "default" : "secondary"}>
                    {validationResult.overallScore >= 95 ? "Excellent" : "Good"}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step !== 'basic' && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            {step !== 'validate' ? (
              <Button className="flex-1" onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex-1" 
                onClick={saveCharacter}
                disabled={!validationResult || loading}
              >
                <Check className="w-4 h-4 mr-2" />
                Create Character
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
