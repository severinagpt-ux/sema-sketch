import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Search, Plus, Filter } from "lucide-react";

export const PropsLibraryPanel = () => {
  const props = [
    { id: 1, name: "Office Desk", category: "Furniture", variants: 5 },
    { id: 2, name: "Coffee Mug", category: "Kitchen", variants: 12 },
    { id: 3, name: "Laptop", category: "Electronics", variants: 8 },
    { id: 4, name: "Armchair", category: "Furniture", variants: 6 },
    { id: 5, name: "Table Lamp", category: "Lighting", variants: 10 },
    { id: 6, name: "Bookshelf", category: "Furniture", variants: 7 },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Props Library</h3>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search props..." className="pl-9" />
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="secondary">All</Button>
          <Button size="sm" variant="outline">Furniture</Button>
          <Button size="sm" variant="outline">Electronics</Button>
          <Button size="sm" variant="outline">Kitchen</Button>
          <Button size="sm" variant="outline">
            <Filter className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-2 gap-3">
          {props.map((prop) => (
            <Button
              key={prop.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start gap-2 hover:border-primary"
            >
              <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                <Box className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="w-full space-y-1">
                <div className="font-medium text-sm text-left">{prop.name}</div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {prop.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {prop.variants} variants
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
