import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Upload, TrendingUp, DollarSign } from "lucide-react";

export const MarketplacePanel = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Marketplace</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Publish and monetize assets
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Button className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Publish Asset
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Your Sales</span>
              </div>
              <p className="text-2xl font-bold">$1,247</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Published</span>
              </div>
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs text-muted-foreground">Assets</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Your Published Assets</p>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Modern Office Set</p>
                  <p className="text-xs text-muted-foreground">45 sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">$29</p>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Urban Street Props</p>
                  <p className="text-xs text-muted-foreground">32 sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">$19</p>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </div>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Earnings Potential</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Top sellers earn $5,000+ per month. Create high-quality, unique assets to maximize your earnings.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
