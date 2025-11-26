import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { RightPanels } from "@/components/RightPanels";
import { BottomToolbar } from "@/components/BottomToolbar";
import { ToolProvider } from "@/contexts/ToolContext";
import { LeftSidebar } from "@/components/LeftSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Sparkles, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Characters() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>("char-1");

  const characters = [
    {
      id: "char-1",
      name: "Sarah Chen",
      role: "Protagonist",
      personality: "INFJ",
      consistency: 99.9,
      images: 47,
      status: "active"
    },
    {
      id: "char-2",
      name: "Marcus Williams",
      role: "Antagonist",
      personality: "ENTJ",
      consistency: 99.5,
      images: 32,
      status: "active"
    },
    {
      id: "char-3",
      name: "Detective Martinez",
      role: "Supporting",
      personality: "ISTJ",
      consistency: 98.8,
      images: 18,
      status: "draft"
    }
  ];

  const characterTools = [
    { id: "new", icon: Plus, label: "New Character", action: "create" },
    { id: "ai-gen", icon: Sparkles, label: "AI Generate", action: "generate" },
    { id: "import", icon: Upload, label: "Import", action: "import" },
    { id: "browse", icon: Users, label: "Browse Library", action: "browse" },
  ];

  return (
    <ToolProvider>
      <div className="h-screen flex flex-col bg-background">
        <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar currentPage="characters" />
        
        {/* Main Character Workspace */}
        <div className="flex-1 flex flex-col bg-muted/30">
          {/* Character Browser Header */}
          <div className="border-b border-border bg-background/50 backdrop-blur-sm">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Casting Studio</h2>
                <Badge variant="secondary">{characters.length} Characters</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search characters..." 
                    className="pl-9 w-64"
                  />
                </div>
                {characterTools.map(tool => (
                  <Button key={tool.id} variant="outline" size="sm">
                    <tool.icon className="w-4 h-4 mr-2" />
                    {tool.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Character List Sidebar */}
            <div className="w-80 border-r border-border bg-background/50 backdrop-blur-sm">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {characters.map(char => (
                    <Card
                      key={char.id}
                      className={`p-4 cursor-pointer transition-all hover:border-primary ${
                        selectedCharacter === char.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedCharacter(char.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{char.name}</h3>
                          <p className="text-xs text-muted-foreground">{char.role}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{char.personality}</Badge>
                            <Badge 
                              variant={char.status === "active" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {char.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{char.images} images</span>
                            <span className="text-primary font-semibold">{char.consistency}%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Character Preview/Editor */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-8">
                  {selectedCharacter ? (
                    <div className="space-y-6">
                      {/* Character Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-3xl font-bold mb-2">Sarah Chen</h1>
                          <p className="text-muted-foreground">The Advocate • INFJ Personality • Age 28</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Export</Button>
                          <Button>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Variation
                          </Button>
                        </div>
                      </div>

                      {/* Character Preview Grid */}
                      <div className="grid grid-cols-4 gap-4">
                        {["Front View", "3/4 View", "Side Profile", "Back View"].map((view, idx) => (
                          <Card key={idx} className="overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">{view}</span>
                            </div>
                            <div className="p-3 border-t border-border">
                              <p className="text-xs font-medium">{view}</p>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Expression Gallery */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Expression Library</h3>
                        <div className="grid grid-cols-6 gap-3">
                          {["Neutral", "Happy", "Sad", "Angry", "Surprised", "Thoughtful"].map((expr, idx) => (
                            <Card key={idx} className="overflow-hidden hover:border-primary cursor-pointer transition-colors">
                              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">{expr}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Character Stats */}
                      <Card className="p-6 bg-primary/5 border-primary/20">
                        <h3 className="text-lg font-semibold mb-4">Character Consistency</h3>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                            <p className="text-3xl font-bold text-primary">99.9%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Generations</p>
                            <p className="text-3xl font-bold">47</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">DNA Lock Status</p>
                            <p className="text-3xl font-bold text-green-500">Active</p>
                          </div>
                        </div>
                      </Card>

                      {/* Personality Overview */}
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Personality Profile</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Openness</span>
                              <span className="text-sm text-primary">82%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Conscientiousness</span>
                              <span className="text-sm text-primary">65%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Extraversion</span>
                              <span className="text-sm text-primary">45%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Character Selected</h3>
                        <p className="text-muted-foreground mb-4">Select a character or create a new one</p>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Character
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <RightPanels currentPage="characters" onLayerVisibilityToggle={() => {}} />
      </div>
        <BottomToolbar><div /></BottomToolbar>
      </div>
    </ToolProvider>
  );
}
