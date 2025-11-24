import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Box, Users, MapPin } from "lucide-react";

export const SceneBreakdownPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Box className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Scene Breakdown</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Required assets and resources
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Characters</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">John</Badge>
              <Badge variant="secondary">Sarah</Badge>
              <Badge variant="secondary">Detective Martinez</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Props</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Office Desk</Badge>
              <Badge variant="outline">Computer</Badge>
              <Badge variant="outline">Coffee Mug</Badge>
              <Badge variant="outline">Documents</Badge>
              <Badge variant="outline">Phone</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">Locations</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Modern Office</Badge>
              <Badge>Conference Room</Badge>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-semibold">Production Notes:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Natural lighting preferred</li>
              <li>• Need practical monitor screens</li>
              <li>• Background extras: 3-5 people</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
