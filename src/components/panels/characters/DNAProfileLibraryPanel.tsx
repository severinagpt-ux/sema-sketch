import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Library, Save, Download, Upload, Search, Lock, Unlock, Globe, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface DNAProfile {
  id: string;
  name: string;
  description: string;
  dna_data: any;
  is_public: boolean;
  created_at: string;
}

interface DNAProfileLibraryPanelProps {
  currentDNA?: any;
  onLoadProfile: (dna: any) => void;
}

export const DNAProfileLibraryPanel = ({ currentDNA, onLoadProfile }: DNAProfileLibraryPanelProps) => {
  const [profiles, setProfiles] = useState<DNAProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileDesc, setNewProfileDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('character_dna_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast.error('Failed to load DNA profiles');
      console.error(error);
    }
  };

  const saveProfile = async () => {
    if (!newProfileName.trim()) {
      toast.error('Please enter a profile name');
      return;
    }

    if (!currentDNA) {
      toast.error('No DNA profile to save');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('character_dna_profiles')
        .insert({
          user_id: user.id,
          name: newProfileName,
          description: newProfileDesc,
          dna_data: currentDNA,
          is_public: isPublic
        });

      if (error) throw error;

      toast.success('DNA profile saved successfully');
      setNewProfileName('');
      setNewProfileDesc('');
      setIsPublic(false);
      setShowSaveDialog(false);
      loadProfiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('character_dna_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Profile deleted');
      loadProfiles();
    } catch (error: any) {
      toast.error('Failed to delete profile');
      console.error(error);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Library className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">DNA Profile Library</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Save and load character DNA presets
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button 
          className="w-full" 
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          disabled={!currentDNA}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Current DNA
        </Button>

        {showSaveDialog && (
          <Card className="p-4 mt-3 space-y-3">
            <div>
              <Label>Profile Name</Label>
              <Input
                placeholder="e.g., Athletic Hero"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Input
                placeholder="e.g., Strong jaw, athletic build..."
                value={newProfileDesc}
                onChange={(e) => setNewProfileDesc(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Make Public</Label>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveProfile} disabled={loading} className="flex-1">
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? 'No profiles found' : 'No saved profiles yet'}
            </div>
          ) : (
            filteredProfiles.map((profile) => (
              <Card key={profile.id} className="p-3 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{profile.name}</h4>
                      {profile.is_public && (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                    {profile.description && (
                      <p className="text-xs text-muted-foreground">{profile.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      onLoadProfile(profile.dna_data);
                      toast.success('DNA profile loaded');
                    }}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteProfile(profile.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
