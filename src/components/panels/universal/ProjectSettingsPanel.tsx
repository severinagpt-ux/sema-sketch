import { Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const ProjectSettingsPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Project Settings</h3>
        </div>
      </div>

      {/* Settings Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Project Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Project Information</h4>
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="My Cinematic Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Input id="project-description" placeholder="A brief description..." />
            </div>
          </div>

          <Separator />

          {/* Canvas Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Canvas Settings</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto-save</Label>
              <Switch id="auto-save" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid">Show Grid</Label>
              <Switch id="show-grid" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="snap-to-grid">Snap to Grid</Label>
              <Switch id="snap-to-grid" />
            </div>
          </div>

          <Separator />

          {/* AI Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">AI Settings</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-suggestions">AI Suggestions</Label>
              <Switch id="ai-suggestions" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-enhance">Auto-enhance Images</Label>
              <Switch id="auto-enhance" />
            </div>
          </div>

          <Separator />

          {/* Export Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Export Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="default-format">Default Format</Label>
              <Input id="default-format" value="PNG" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Input id="quality" type="number" value="100" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
