import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { RightPanels } from '@/components/RightPanels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, UserPlus, Search, Grid3x3, List, 
  Brain, Heart, Palette, Camera, Mic, 
  Users, Sparkles, FileText, Image as ImageIcon,
  Eye, Smile, Angry, Frown, Meh, Zap
} from 'lucide-react';
import { Tool } from '@/lib/types';

interface CharacterData {
  id: string;
  name: string;
  role: string;
  thumbnail: string;
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  backstory: string;
  voiceProfile: string;
  expressions: string[];
}

const sampleCharacters: CharacterData[] = [
  {
    id: '1',
    name: 'Detective Kane',
    role: 'Protagonist',
    thumbnail: '/placeholder.svg',
    personality: { openness: 70, conscientiousness: 40, extraversion: 80, agreeableness: 30, neuroticism: 90 },
    backstory: 'Haunted investigator seeking redemption...',
    voiceProfile: 'Deep, gravelly, determined',
    expressions: ['Neutral', 'Focused', 'Angry', 'Concerned', 'Sad']
  },
  {
    id: '2',
    name: 'Dr. Elena Chen',
    role: 'Supporting',
    thumbnail: '/placeholder.svg',
    personality: { openness: 85, conscientiousness: 90, extraversion: 45, agreeableness: 75, neuroticism: 30 },
    backstory: 'Brilliant scientist with mysterious past...',
    voiceProfile: 'Clear, intelligent, calm',
    expressions: ['Neutral', 'Thoughtful', 'Happy', 'Surprised', 'Determined']
  },
  {
    id: '3',
    name: 'Marcus Steel',
    role: 'Antagonist',
    thumbnail: '/placeholder.svg',
    personality: { openness: 50, conscientiousness: 70, extraversion: 60, agreeableness: 20, neuroticism: 40 },
    backstory: 'Ruthless corporate executive...',
    voiceProfile: 'Smooth, commanding, cold',
    expressions: ['Neutral', 'Smirking', 'Angry', 'Calculating', 'Disdainful']
  }
];

const characterTools = [
  { icon: User, tool: 'select' as Tool, label: 'Select Character' },
  { icon: UserPlus, tool: 'magic-wand' as Tool, label: 'Create Character' },
  { icon: Brain, tool: 'ai-tools' as Tool, label: 'Personality Editor' },
  { icon: Camera, tool: 'crop' as Tool, label: 'Multi-Angle View' },
  { icon: Smile, tool: 'brush' as Tool, label: 'Expression Editor' },
  { icon: Palette, tool: 'gradient' as Tool, label: 'Appearance Editor' },
  { icon: ImageIcon, tool: 'shapes' as Tool, label: 'Outfit Variations' },
  { icon: Mic, tool: 'text' as Tool, label: 'Voice Profile' },
  { icon: FileText, tool: 'pen' as Tool, label: 'Backstory Editor' },
  { icon: Zap, tool: 'clone' as Tool, label: 'Character DNA' },
  { icon: Eye, tool: 'measure' as Tool, label: 'Consistency Check' },
  { icon: Sparkles, tool: 'magnifier' as Tool, label: 'AI Generate' }
];

export default function Characters() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(sampleCharacters[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = sampleCharacters.filter(char =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-canvas overflow-hidden">
      <TopBar projectName="Character Casting Studio" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
          {characterTools.map(({ icon: Icon, tool, label }) => (
            <Button
              key={tool}
              variant={activeTool === tool ? "default" : "ghost"}
              size="icon"
              className="tool-button"
              onClick={() => setActiveTool(tool)}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Character Browser Header */}
          <div className="h-14 bg-panel border-b border-panel-border px-4 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="default" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                New Character
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Character Gallery */}
            <div className="flex-1 overflow-auto p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCharacters.map((char) => (
                    <Card
                      key={char.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedCharacter?.id === char.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedCharacter(char)}
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-[3/4] bg-muted rounded-t-lg flex items-center justify-center">
                          <User className="w-16 h-16 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm">{char.name}</h3>
                        <p className="text-xs text-muted-foreground">{char.role}</p>
                        <div className="flex gap-1 mt-2">
                          {char.expressions.slice(0, 3).map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCharacters.map((char) => (
                    <Card
                      key={char.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedCharacter?.id === char.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedCharacter(char)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{char.name}</h3>
                          <p className="text-sm text-muted-foreground">{char.role}</p>
                          <p className="text-xs text-muted-foreground mt-1">{char.backstory}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {char.expressions.slice(0, 3).map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Character Details Panel */}
            {selectedCharacter && (
              <div className="w-96 border-l border-panel-border bg-panel overflow-auto">
                <Tabs defaultValue="overview" className="h-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="personality">Personality</TabsTrigger>
                    <TabsTrigger value="expressions">Expressions</TabsTrigger>
                    <TabsTrigger value="backstory">Backstory</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Character Name</Label>
                      <p className="font-semibold mt-1">{selectedCharacter.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <p className="mt-1">{selectedCharacter.role}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Voice Profile</Label>
                      <p className="mt-1">{selectedCharacter.voiceProfile}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Available Expressions</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedCharacter.expressions.map((exp) => (
                          <Badge key={exp} variant="outline">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button className="w-full" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Generate Multi-Angle Views
                      </Button>
                      <Button className="w-full mt-2" variant="outline">
                        <Palette className="w-4 h-4 mr-2" />
                        Create Outfit Variations
                      </Button>
                      <Button className="w-full mt-2" variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Generate Assets
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="personality" className="p-4 space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Openness</Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedCharacter.personality.openness}%
                        </span>
                      </div>
                      <Slider
                        value={[selectedCharacter.personality.openness]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Creative, curious, open to experiences
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Conscientiousness</Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedCharacter.personality.conscientiousness}%
                        </span>
                      </div>
                      <Slider
                        value={[selectedCharacter.personality.conscientiousness]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Organized, disciplined, methodical
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Extraversion</Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedCharacter.personality.extraversion}%
                        </span>
                      </div>
                      <Slider
                        value={[selectedCharacter.personality.extraversion]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Social, energetic, assertive
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Agreeableness</Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedCharacter.personality.agreeableness}%
                        </span>
                      </div>
                      <Slider
                        value={[selectedCharacter.personality.agreeableness]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Cooperative, trusting, empathetic
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Neuroticism</Label>
                        <span className="text-sm text-muted-foreground">
                          {selectedCharacter.personality.neuroticism}%
                        </span>
                      </div>
                      <Slider
                        value={[selectedCharacter.personality.neuroticism]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Emotional sensitivity and stress response
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="expressions" className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Smile, label: 'Happy', color: 'text-yellow-500' },
                        { icon: Angry, label: 'Angry', color: 'text-red-500' },
                        { icon: Frown, label: 'Sad', color: 'text-blue-500' },
                        { icon: Meh, label: 'Neutral', color: 'text-gray-500' },
                        { icon: Eye, label: 'Focused', color: 'text-purple-500' },
                        { icon: Heart, label: 'Loving', color: 'text-pink-500' }
                      ].map(({ icon: Icon, label, color }) => (
                        <Button
                          key={label}
                          variant="outline"
                          className="h-24 flex flex-col gap-2"
                        >
                          <Icon className={`w-8 h-8 ${color}`} />
                          <span className="text-xs">{label}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <Button className="w-full" variant="default">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Expression Set
                      </Button>
                      <Button className="w-full mt-2" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Generate Emotional Range
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="backstory" className="p-4 space-y-4">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Character Backstory</Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedCharacter.backstory}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Edit Full Backstory
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Expand Backstory
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Behavioral Patterns
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* Right Panels */}
        <RightPanels onLayerVisibilityToggle={() => {}} />
      </div>

      <BottomBar
        activeTool={activeTool}
        zoom={100}
        cursorX={0}
        cursorY={0}
      />
    </div>
  );
}
