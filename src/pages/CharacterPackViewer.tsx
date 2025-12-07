import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Download, 
  DownloadCloud,
  Grid3X3,
  LayoutGrid,
  Maximize2,
  RotateCcw,
  User,
  Smile,
  Shirt,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Columns,
  X
} from 'lucide-react';

interface Shot {
  id: string;
  shot_key: string;
  type: string;
  angle_deg: number | null;
  framing: string;
  expression: string | null;
  outfit_id: string | null;
  status: string;
  image_url: string | null;
  error_message: string | null;
}

interface Character {
  id: string;
  name: string;
  reference_url: string | null;
  style_tags: string | null;
  role: string | null;
}

interface Batch {
  id: string;
  status: string;
  total_shots: number;
  completed_shots: number;
  created_at: string;
}

export default function CharacterPackViewer() {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batch');
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareShots, setCompareShots] = useState<Shot[]>([]);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    loadData();
  }, [characterId, batchId]);

  // Realtime subscription for shots
  useEffect(() => {
    if (!batchId) return;

    const channel = supabase
      .channel(`viewer-shots-${batchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shots',
          filter: `batch_id=eq.${batchId}`
        },
        (payload) => {
          setShots(prev => 
            prev.map(s => s.id === (payload.new as Shot).id ? payload.new as Shot : s)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [batchId]);

  const loadData = async () => {
    if (!characterId) return;
    setLoading(true);

    try {
      // Load character
      const { data: charData } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (charData) setCharacter(charData);

      // Load batch (either specified or latest)
      let targetBatchId = batchId;
      
      if (!targetBatchId) {
        const { data: batches } = await supabase
          .from('character_batches')
          .select('*')
          .eq('character_id', characterId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (batches?.[0]) {
          targetBatchId = batches[0].id;
          setBatch(batches[0]);
        }
      } else {
        const { data: batchData } = await supabase
          .from('character_batches')
          .select('*')
          .eq('id', targetBatchId)
          .single();

        if (batchData) setBatch(batchData);
      }

      // Load shots
      if (targetBatchId) {
        const { data: shotsData } = await supabase
          .from('shots')
          .select('*')
          .eq('batch_id', targetBatchId)
          .order('shot_key');

        if (shotsData) setShots(shotsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'generating': return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const groupedShots = {
    turnaround: shots.filter(s => s.type === 'orthographic_body'),
    headAngles: shots.filter(s => s.type === 'head_angle'),
    emotions: shots.filter(s => s.type === 'emotion'),
    outfits: {
      default: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'default'),
      casual: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'casual'),
      battle: shots.filter(s => s.type === 'outfit_angle' && s.outfit_id === 'battle'),
    }
  };

  const downloadImage = async (shot: Shot) => {
    if (!shot.image_url) return;
    
    try {
      const response = await fetch(shot.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${character?.name || 'character'}_${shot.shot_key}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const downloadAll = async () => {
    const completedShots = shots.filter(s => s.status === 'done' && s.image_url);
    for (const shot of completedShots) {
      await downloadImage(shot);
      await new Promise(r => setTimeout(r, 200)); // Small delay between downloads
    }
  };

  const toggleCompare = (shot: Shot) => {
    if (compareShots.find(s => s.id === shot.id)) {
      setCompareShots(prev => prev.filter(s => s.id !== shot.id));
    } else if (compareShots.length < 4) {
      setCompareShots(prev => [...prev, shot]);
    }
  };

  const gridSizeClass = {
    small: 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10',
    medium: 'grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
    large: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  const ShotCard = ({ shot, showLabel = true }: { shot: Shot; showLabel?: boolean }) => (
    <Card 
      className={`
        relative group overflow-hidden cursor-pointer transition-all
        ${compareMode && compareShots.find(s => s.id === shot.id) ? 'ring-2 ring-primary' : ''}
        hover:ring-1 hover:ring-primary/50
      `}
      onClick={() => compareMode ? toggleCompare(shot) : setSelectedShot(shot)}
    >
      <div className="aspect-[3/4] bg-muted">
        {shot.image_url ? (
          <img 
            src={shot.image_url} 
            alt={shot.shot_key}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getStatusIcon(shot.status)}
          </div>
        )}
      </div>
      
      {/* Overlay actions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          {showLabel && (
            <p className="text-xs text-white truncate mb-1">
              {shot.expression || shot.shot_key.replace(/_/g, ' ')}
            </p>
          )}
          {shot.image_url && (
            <div className="flex gap-1">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(shot);
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedShot(shot);
                }}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compare checkbox */}
      {compareMode && shot.image_url && (
        <div className={`
          absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center
          ${compareShots.find(s => s.id === shot.id) 
            ? 'bg-primary border-primary' 
            : 'bg-background/80 border-border'
          }
        `}>
          {compareShots.find(s => s.id === shot.id) && (
            <CheckCircle className="h-3 w-3 text-primary-foreground" />
          )}
        </div>
      )}
    </Card>
  );

  const ShotSection = ({ 
    title, 
    icon, 
    shots: sectionShots 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    shots: Shot[] 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="outline" className="ml-auto">
          {sectionShots.filter(s => s.status === 'done').length}/{sectionShots.length}
        </Badge>
      </div>
      <div className={`grid gap-3 ${gridSizeClass[gridSize]}`}>
        {sectionShots.map(shot => (
          <ShotCard key={shot.id} shot={shot} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/characters')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              {character?.reference_url && (
                <img 
                  src={character.reference_url} 
                  alt={character.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="font-semibold">{character?.name} - Character Pack</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {batch && (
                    <>
                      <Badge variant={batch.status === 'completed' ? 'default' : 'secondary'}>
                        {batch.status}
                      </Badge>
                      <span>{batch.completed_shots}/{batch.total_shots} shots</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Grid size toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button 
                variant={gridSize === 'small' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize('small')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={gridSize === 'medium' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize('medium')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={gridSize === 'large' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize('large')}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Compare mode */}
            <Button 
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareShots([]);
              }}
            >
              <Columns className="h-4 w-4 mr-2" />
              Compare
            </Button>

            {/* Download all */}
            <Button variant="outline" size="sm" onClick={downloadAll}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </header>

      {/* Compare Bar */}
      {compareMode && compareShots.length > 0 && (
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Comparing {compareShots.length} shot{compareShots.length > 1 ? 's' : ''} (max 4)
              </span>
              <div className="flex gap-2 flex-1">
                {compareShots.map(shot => (
                  <div key={shot.id} className="relative">
                    <img 
                      src={shot.image_url!} 
                      alt={shot.shot_key}
                      className="h-16 w-12 object-cover rounded"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5"
                      onClick={() => toggleCompare(shot)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCompareShots([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-screen-2xl mx-auto p-6 space-y-8">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Shots</TabsTrigger>
              <TabsTrigger value="turnaround">Turnaround</TabsTrigger>
              <TabsTrigger value="head">Head Angles</TabsTrigger>
              <TabsTrigger value="emotions">Emotions</TabsTrigger>
              <TabsTrigger value="outfits">Outfits</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <ShotSection 
                title="Body Turnaround" 
                icon={<RotateCcw className="h-5 w-5" />}
                shots={groupedShots.turnaround}
              />
              <ShotSection 
                title="Head Angles" 
                icon={<User className="h-5 w-5" />}
                shots={groupedShots.headAngles}
              />
              <ShotSection 
                title="Expressions" 
                icon={<Smile className="h-5 w-5" />}
                shots={groupedShots.emotions}
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shirt className="h-5 w-5" />
                  <h3 className="font-semibold">Outfit Variants</h3>
                </div>
                {Object.entries(groupedShots.outfits).map(([outfitId, outfitShots]) => (
                  <div key={outfitId} className="ml-4 space-y-2">
                    <h4 className="text-sm font-medium capitalize text-muted-foreground">{outfitId}</h4>
                    <div className={`grid gap-3 ${gridSizeClass[gridSize]}`}>
                      {outfitShots.map(shot => (
                        <ShotCard key={shot.id} shot={shot} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="turnaround">
              <div className={`grid gap-4 ${gridSizeClass[gridSize]}`}>
                {groupedShots.turnaround.map(shot => (
                  <ShotCard key={shot.id} shot={shot} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="head">
              <div className={`grid gap-4 ${gridSizeClass[gridSize]}`}>
                {groupedShots.headAngles.map(shot => (
                  <ShotCard key={shot.id} shot={shot} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emotions">
              <div className={`grid gap-4 ${gridSizeClass[gridSize]}`}>
                {groupedShots.emotions.map(shot => (
                  <ShotCard key={shot.id} shot={shot} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="outfits" className="space-y-6">
              {Object.entries(groupedShots.outfits).map(([outfitId, outfitShots]) => (
                <div key={outfitId} className="space-y-3">
                  <h3 className="font-semibold capitalize">{outfitId} Outfit</h3>
                  <div className={`grid gap-4 ${gridSizeClass[gridSize]}`}>
                    {outfitShots.map(shot => (
                      <ShotCard key={shot.id} shot={shot} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Full Screen Modal */}
      <Dialog open={!!selectedShot} onOpenChange={() => setSelectedShot(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedShot?.shot_key.replace(/_/g, ' ')}
              {selectedShot?.expression && (
                <Badge variant="outline">{selectedShot.expression}</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedShot?.image_url && (
            <div className="relative aspect-[3/4] max-h-[70vh] overflow-hidden rounded-lg bg-muted">
              <img 
                src={selectedShot.image_url}
                alt={selectedShot.shot_key}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedShot(null)}>
              Close
            </Button>
            {selectedShot && (
              <Button onClick={() => downloadImage(selectedShot)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      {compareMode && compareShots.length >= 2 && (
        <Dialog open={true} onOpenChange={() => setCompareShots([])}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Compare Shots</DialogTitle>
            </DialogHeader>
            <div className={`grid gap-4 ${compareShots.length === 2 ? 'grid-cols-2' : compareShots.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {compareShots.map(shot => (
                <div key={shot.id} className="space-y-2">
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={shot.image_url!}
                      alt={shot.shot_key}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {shot.shot_key.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
