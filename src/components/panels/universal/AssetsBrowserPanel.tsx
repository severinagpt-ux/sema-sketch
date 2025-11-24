import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, User, Image, Video, Music, Search } from "lucide-react";

export const AssetsBrowserPanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Assets Browser</h3>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border px-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="characters">
            <User className="w-4 h-4 mr-1" />
            Characters
          </TabsTrigger>
          <TabsTrigger value="props">
            <Package className="w-4 h-4 mr-1" />
            Props
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="w-4 h-4 mr-1" />
            Images
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="w-4 h-4 mr-1" />
            Video
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Music className="w-4 h-4 mr-1" />
            Audio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                All assets from your project will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="characters" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Your created characters will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="props" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Your props and scenes will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="images" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Your images will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="video" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Your video shots will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="audio" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                Your audio files will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
