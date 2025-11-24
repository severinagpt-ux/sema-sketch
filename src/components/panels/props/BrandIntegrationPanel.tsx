import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, CheckCircle2 } from "lucide-react";

export const BrandIntegrationPanel = () => {
  const brands = [
    { id: 1, name: "Apple", products: 24, verified: true },
    { id: 2, name: "Nike", products: 18, verified: true },
    { id: 3, name: "Coca-Cola", products: 12, verified: true },
    { id: 4, name: "Samsung", products: 30, verified: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Brand Integration</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Real brand assets with legal authentication
        </p>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search brands..." className="pl-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {brands.map((brand) => (
            <Button
              key={brand.id}
              variant="outline"
              className="w-full h-auto p-3 flex items-center gap-3 hover:border-primary"
            >
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{brand.name}</span>
                  {brand.verified && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {brand.products} products
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
            </Button>
          ))}

          <div className="p-3 bg-muted rounded-lg space-y-2 mt-4">
            <p className="text-xs font-semibold">Legal Framework</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Licensed brand assets</li>
              <li>✓ Legal authentication</li>
              <li>✓ Usage rights verified</li>
              <li>✓ Automatic attribution</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
