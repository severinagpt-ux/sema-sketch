import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { RightPanels } from "@/components/RightPanels";
import { BottomToolbar } from "@/components/BottomToolbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Film, Sparkles, Grid3x3, LayoutGrid, PlayCircle, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Storyboard() {
  const [selectedPanel, setSelectedPanel] = useState<string | null>("panel-3");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");

  const storyboardPanels = [
    {
      id: "panel-1",
      sceneNumber: "1A",
      shotType: "Extreme Wide Shot",
      description: "Establishing shot of modern city skyline at dawn",
      duration: "5s",
      camera: "Static",
      lighting: "Natural Dawn",
      characters: [],
      props: ["Cityscape"]
    },
    {
      id: "panel-2",
      sceneNumber: "1B",
      shotType: "Medium Shot",
      description: "Sarah enters her office building, looking determined",
      duration: "3s",
      camera: "Dolly In",
      lighting: "Natural + Fill",
      characters: ["Sarah Chen"],
      props: ["Office Building", "Briefcase"]
    },
    {
      id: "panel-3",
      sceneNumber: "2A",
      shotType: "Close-Up",
      description: "Sarah's face as she reads concerning email on phone",
      duration: "4s",
      camera: "Handheld",
      lighting: "Soft Key Light",
      characters: ["Sarah Chen"],
      props: ["Smartphone"]
    },
    {
      id: "panel-4",
      sceneNumber: "2B",
      shotType: "Over-the-Shoulder",
      description: "View of phone screen showing threatening message",
      duration: "2s",
      camera: "Static",
      lighting: "Phone Glow + Fill",
      characters: ["Sarah Chen"],
      props: ["Smartphone"]
    },
    {
      id: "panel-5",
      sceneNumber: "3A",
      shotType: "Wide Shot",
      description: "Sarah sits at her desk, surrounded by case files",
      duration: "4s",
      camera: "Slow Pan Right",
      lighting: "Office Fluorescent",
      characters: ["Sarah Chen"],
      props: ["Desk", "Computer", "Files", "Coffee Mug"]
    },
    {
      id: "panel-6",
      sceneNumber: "3B",
      shotType: "Medium Close-Up",
      description: "Detective Martinez enters, knocks on door frame",
      duration: "3s",
      camera: "Static",
      lighting: "Natural + Office Mix",
      characters: ["Detective Martinez"],
      props: ["Door Frame"]
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar onToolChange={() => {}} />
        
        {/* Main Storyboard Workspace */}
        <div className="flex-1 flex flex-col bg-muted/30">
          {/* Storyboard Header */}
          <div className="border-b border-border bg-background/50 backdrop-blur-sm">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">StoryboardForge</h2>
                <Badge variant="secondary">{storyboardPanels.length} Panels</Badge>
                <Badge variant="outline">Scene 1-3</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "timeline")}>
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="timeline">
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Preview Animatic
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Panel
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-3 gap-6">
                  {storyboardPanels.map((panel) => (
                    <Card
                      key={panel.id}
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                        selectedPanel === panel.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedPanel(panel.id)}
                    >
                      {/* Panel Preview */}
                      <div className="aspect-video bg-gradient-to-br from-muted via-muted-foreground/10 to-muted flex items-center justify-center relative">
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="font-mono">
                            {panel.sceneNumber}
                          </Badge>
                        </div>
                        <div className="text-center p-4">
                          <Film className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{panel.shotType}</p>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge variant="outline" className="text-xs">
                            {panel.duration}
                          </Badge>
                        </div>
                      </div>

                      {/* Panel Details */}
                      <div className="p-4 space-y-3">
                        <p className="text-sm font-medium line-clamp-2">{panel.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Camera:</span>
                            <p className="font-medium">{panel.camera}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lighting:</span>
                            <p className="font-medium">{panel.lighting}</p>
                          </div>
                        </div>

                        {panel.characters.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {panel.characters.map((char, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {panel.props.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {panel.props.map((prop, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {prop}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {/* Add New Panel Card */}
                  <Card className="aspect-video border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-center">
                    <div className="text-center">
                      <Plus className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add New Panel</p>
                    </div>
                  </Card>
                </div>
              ) : (
                // Timeline View
                <div className="space-y-4">
                  {storyboardPanels.map((panel) => (
                    <Card
                      key={panel.id}
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                        selectedPanel === panel.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedPanel(panel.id)}
                    >
                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div className="w-48 aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 rounded flex items-center justify-center flex-shrink-0">
                          <Film className="w-8 h-8 text-muted-foreground" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="font-mono">
                                  {panel.sceneNumber}
                                </Badge>
                                <Badge variant="outline">{panel.shotType}</Badge>
                                <Badge variant="outline">{panel.duration}</Badge>
                              </div>
                              <p className="text-sm font-medium">{panel.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground block mb-1">Camera</span>
                              <p className="font-medium">{panel.camera}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Lighting</span>
                              <p className="font-medium">{panel.lighting}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Characters</span>
                              <p className="font-medium">{panel.characters.length || "None"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">Props</span>
                              <p className="font-medium">{panel.props.length}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {panel.characters.map((char, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <RightPanels currentPage="storyboard" onLayerVisibilityToggle={() => {}} />
      </div>
      <BottomToolbar><div /></BottomToolbar>
    </div>
  );
}
