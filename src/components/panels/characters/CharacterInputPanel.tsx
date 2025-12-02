import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Image, Images, Pencil, FileText, Upload, X, Plus, Sparkles 
} from "lucide-react";

type InputMethod = 'single-photo' | 'multiple-refs' | 'sketch' | 'text';

interface CharacterInputPanelProps {
  onStartSculpt: (inputData: CharacterInputData) => void;
}

export interface CharacterInputData {
  method: InputMethod;
  images: string[];
  textDescription?: {
    name: string;
    age: string;
    vibe: string;
    role: string;
    personality: string;
    style: string;
  };
}

const inputMethods = [
  { 
    id: 'single-photo' as InputMethod, 
    icon: Image, 
    label: 'Single Photo',
    description: 'Upload a real person, cosplay, fashion shot'
  },
  { 
    id: 'multiple-refs' as InputMethod, 
    icon: Images, 
    label: 'Multiple References',
    description: 'Merge several photos into one identity'
  },
  { 
    id: 'sketch' as InputMethod, 
    icon: Pencil, 
    label: 'Sketch / Concept Art',
    description: 'Upload artwork and refine toward final style'
  },
  { 
    id: 'text' as InputMethod, 
    icon: FileText, 
    label: 'Text Description',
    description: 'Describe your character in words'
  },
];

const styleOptions = [
  'Cinematic', 'Anime', 'Painterly', 'Cyberpunk', 
  'Fantasy', 'Photoreal', 'Noir', 'Vintage'
];

export const CharacterInputPanel = ({ onStartSculpt }: CharacterInputPanelProps) => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [textData, setTextData] = useState({
    name: '',
    age: '',
    vibe: '',
    role: '',
    personality: '',
    style: 'Cinematic'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartSculpt = () => {
    if (!selectedMethod) return;
    
    onStartSculpt({
      method: selectedMethod,
      images: uploadedImages,
      textDescription: selectedMethod === 'text' ? textData : undefined
    });
  };

  const canProceed = () => {
    if (!selectedMethod) return false;
    if (selectedMethod === 'text') {
      return textData.name && textData.role;
    }
    return uploadedImages.length > 0;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">Character Input</h3>
        <p className="text-xs text-muted-foreground">
          Choose how to start your character
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Input Method Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Input Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {inputMethods.map(method => (
                <Card
                  key={method.id}
                  className={`p-3 cursor-pointer transition-all hover:border-primary ${
                    selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <method.icon className="w-5 h-5 mb-2 text-primary" />
                  <p className="text-xs font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {method.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          {selectedMethod && selectedMethod !== 'text' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {selectedMethod === 'single-photo' ? 'Upload Photo' : 
                 selectedMethod === 'multiple-refs' ? 'Upload References' : 
                 'Upload Sketch'}
              </Label>
              
              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img 
                        src={img} 
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(idx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {(selectedMethod === 'single-photo' ? uploadedImages.length < 1 : true) && (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {selectedMethod === 'single-photo' ? 'Click to upload photo' : 'Click to add images'}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    multiple={selectedMethod !== 'single-photo'}
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          )}

          {/* Text Description Section */}
          {selectedMethod === 'text' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input 
                    placeholder="Character name"
                    value={textData.name}
                    onChange={(e) => setTextData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Age</Label>
                  <Input 
                    placeholder="e.g., 28"
                    value={textData.age}
                    onChange={(e) => setTextData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Input 
                  placeholder="e.g., Detective, Rebel Leader"
                  value={textData.role}
                  onChange={(e) => setTextData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Vibe / Personality</Label>
                <Textarea 
                  placeholder="Describe their personality, demeanor..."
                  value={textData.personality}
                  onChange={(e) => setTextData(prev => ({ ...prev, personality: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Visual Style</Label>
                <div className="flex flex-wrap gap-1">
                  {styleOptions.map(style => (
                    <Badge
                      key={style}
                      variant={textData.style === style ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => setTextData(prev => ({ ...prev, style }))}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Start Sculpt Button */}
          {selectedMethod && (
            <Button 
              className="w-full"
              disabled={!canProceed()}
              onClick={handleStartSculpt}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Character Sculpt
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
