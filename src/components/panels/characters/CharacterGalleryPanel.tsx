import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Eye, Sparkles, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Character {
  id: string;
  name: string;
  role: string;
  personality_type: string;
  consistency_score: number;
  total_generations: number;
  thumbnail_url: string;
  created_at: string;
}

interface CharacterGalleryPanelProps {
  onSelectCharacter: (character: Character) => void;
}

export const CharacterGalleryPanel = ({ onSelectCharacter }: CharacterGalleryPanelProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error: any) {
      toast.error('Failed to load characters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Character deleted');
      loadCharacters();
    } catch (error: any) {
      toast.error('Failed to delete character');
      console.error(error);
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 99) return "text-green-500";
    if (score >= 95) return "text-blue-500";
    if (score >= 90) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Character Gallery</h3>
          </div>
          <Button size="sm" variant="outline" onClick={loadCharacters}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {characters.length} characters created
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Loading characters...
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No characters created yet
            </div>
          ) : (
            characters.map((character) => (
              <Card key={character.id} className="overflow-hidden hover:border-primary transition-colors">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {character.thumbnail_url ? (
                    <img 
                      src={character.thumbnail_url} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">
                      {character.name.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div className="p-3 space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm">{character.name}</h4>
                    <p className="text-xs text-muted-foreground">{character.role}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {character.personality_type && (
                      <Badge variant="outline" className="text-xs">
                        {character.personality_type}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {character.total_generations} generations
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Consistency</p>
                      <p className={`text-lg font-bold ${getConsistencyColor(character.consistency_score)}`}>
                        {character.consistency_score}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onSelectCharacter(character)}
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCharacter(character.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
