import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCharacterPackRealtime } from '@/hooks/useCharacterPackRealtime';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Smile,
  Shirt,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface CharacterPackPanelProps {
  characterId?: string;
  characterName?: string;
  referenceUrl?: string;
}

export function CharacterPackPanel({ 
  characterId, 
  characterName = 'Character',
  referenceUrl 
}: CharacterPackPanelProps) {
  const navigate = useNavigate();
  const {
    isGenerating,
    currentBatch,
    groupedShots,
    generatePack,
    loadBatchStatus,
    loadCharacterBatches,
    loadBatchShots,
  } = useCharacterPackRealtime();

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]);

  // Load existing batches
  useEffect(() => {
    if (characterId) {
      loadCharacterBatches(characterId).then(setBatches);
    }
  }, [characterId, loadCharacterBatches]);

  const handleGenerate = async () => {
    if (!characterId) return;
    const batch = await generatePack(characterId);
    if (batch) {
      setSelectedBatchId(batch.id);
      setBatches(prev => [batch, ...prev]);
    }
  };

  const handleSelectBatch = async (batchId: string) => {
    setSelectedBatchId(batchId);
    await loadBatchShots(batchId);
  };

  const progress = currentBatch 
    ? (currentBatch.completed_shots / currentBatch.total_shots) * 100 
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed': return <XCircle className="h-3 w-3 text-red-500" />;
      case 'generating': return <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const ShotGrid = ({ shots, title, icon }: { shots: any[], title: string, icon: React.ReactNode }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        <span>{title}</span>
        <Badge variant="outline" className="ml-auto">
          {shots.filter(s => s.status === 'done').length}/{shots.length}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {shots.map(shot => (
          <div 
            key={shot.id}
            className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden border"
          >
            {shot.image_url ? (
              <img 
                src={shot.image_url} 
                alt={shot.shot_key}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {getStatusIcon(shot.status)}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 py-0.5 truncate">
              {shot.expression || shot.shot_key.split('_').slice(-1)[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Character Pack Generator</h3>
          <Badge variant={isGenerating ? "default" : "secondary"}>
            {isGenerating ? "Generating..." : "Ready"}
          </Badge>
        </div>
        
        {!characterId ? (
          <p className="text-xs text-muted-foreground">
            Select a character to generate a full pack
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {referenceUrl && (
                <img 
                  src={referenceUrl} 
                  alt={characterName}
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{characterName}</p>
                <p className="text-xs text-muted-foreground">31 shots in pack</p>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !referenceUrl}
              className="w-full"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating Pack...' : 'Generate Full Character Pack'}
            </Button>

            {currentBatch && (
              <Button 
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/characters/${characterId}/pack?batch=${currentBatch.id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Viewer
              </Button>
            )}

            {!referenceUrl && (
              <p className="text-xs text-amber-500">
                Upload a reference image first
              </p>
            )}
          </div>
        )}
      </div>

      {currentBatch && (
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progress: {currentBatch.completed_shots}/{currentBatch.total_shots}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {currentBatch.error_message && (
            <p className="text-xs text-red-500 mt-1">{currentBatch.error_message}</p>
          )}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Batch History */}
          {batches.length > 0 && !currentBatch && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Previous Batches</h4>
              {batches.slice(0, 3).map(batch => (
                <Card 
                  key={batch.id}
                  className="p-2 cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSelectBatch(batch.id)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{new Date(batch.created_at).toLocaleDateString()}</span>
                    <Badge variant={batch.status === 'completed' ? 'default' : 'secondary'}>
                      {batch.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {batch.completed_shots}/{batch.total_shots} shots
                  </p>
                </Card>
              ))}
            </div>
          )}

          {/* Shot Results */}
          {groupedShots.turnaround.length > 0 && (
            <>
              <ShotGrid 
                shots={groupedShots.turnaround} 
                title="Body Turnaround" 
                icon={<RotateCcw className="h-4 w-4" />}
              />
              
              <ShotGrid 
                shots={groupedShots.headAngles} 
                title="Head Angles" 
                icon={<User className="h-4 w-4" />}
              />
              
              <ShotGrid 
                shots={groupedShots.emotions} 
                title="Expressions" 
                icon={<Smile className="h-4 w-4" />}
              />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shirt className="h-4 w-4" />
                  <span>Outfit Variants</span>
                </div>
                
                {Object.entries(groupedShots.outfits).map(([outfitId, shots]) => (
                  <div key={outfitId} className="pl-4">
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{outfitId}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {shots.map(shot => (
                        <div 
                          key={shot.id}
                          className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden border"
                        >
                          {shot.image_url ? (
                            <img 
                              src={shot.image_url} 
                              alt={shot.shot_key}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {getStatusIcon(shot.status)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {groupedShots.turnaround.length === 0 && !isGenerating && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No character pack generated yet</p>
              <p className="text-xs">Click the button above to start</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
