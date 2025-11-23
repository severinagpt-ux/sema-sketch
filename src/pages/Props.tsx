import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { RightPanels } from '@/components/RightPanels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Box, Grid3x3, List, Search, Plus, 
  Package, Building2, Palette, Camera, 
  Sparkles, Wand2, Image as ImageIcon, Layers,
  Lightbulb, Eye, Upload, Download,
  ShoppingCart, Award, Tag, Filter
} from 'lucide-react';
import { Tool } from '@/lib/types';

interface PropData {
  id: string;
  name: string;
  category: string;
  type: 'prop' | 'scene';
  thumbnail: string;
  description: string;
  tags: string[];
  price: string;
  quality: 'community' | 'premium' | 'professional';
  brand?: string;
}

const sampleAssets: PropData[] = [
  {
    id: '1',
    name: 'Modern Office Chair',
    category: 'Furniture',
    type: 'prop',
    thumbnail: '/placeholder.svg',
    description: 'High-quality office chair with realistic materials',
    tags: ['furniture', 'office', 'modern'],
    price: 'Free',
    quality: 'community'
  },
  {
    id: '2',
    name: 'Cyberpunk City Street',
    category: 'Urban',
    type: 'scene',
    thumbnail: '/placeholder.svg',
    description: 'Neon-lit futuristic city street with detailed environment',
    tags: ['urban', 'cyberpunk', 'night'],
    price: '$12.99',
    quality: 'premium'
  },
  {
    id: '3',
    name: 'Tesla Model S',
    category: 'Vehicles',
    type: 'prop',
    thumbnail: '/placeholder.svg',
    description: 'Officially licensed Tesla vehicle with authentic details',
    tags: ['vehicle', 'car', 'electric'],
    price: '$29.99',
    quality: 'professional',
    brand: 'Tesla'
  },
  {
    id: '4',
    name: 'Medieval Castle Interior',
    category: 'Historical',
    type: 'scene',
    thumbnail: '/placeholder.svg',
    description: 'Detailed medieval castle interior with torch lighting',
    tags: ['historical', 'medieval', 'interior'],
    price: '$19.99',
    quality: 'premium'
  },
  {
    id: '5',
    name: 'Nike Air Jordan',
    category: 'Fashion',
    type: 'prop',
    thumbnail: '/placeholder.svg',
    description: 'Authentic Nike Air Jordan sneakers with brand licensing',
    tags: ['fashion', 'shoes', 'sports'],
    price: '$8.99',
    quality: 'professional',
    brand: 'Nike'
  },
  {
    id: '6',
    name: 'Tokyo Coffee Shop',
    category: 'Commercial',
    type: 'scene',
    thumbnail: '/placeholder.svg',
    description: 'Cozy Tokyo-style coffee shop with detailed interior',
    tags: ['commercial', 'interior', 'japan'],
    price: 'Free',
    quality: 'community'
  }
];

const propsTools = [
  { icon: Box, tool: 'select' as Tool, label: 'Select Asset' },
  { icon: Plus, tool: 'magic-wand' as Tool, label: 'Create Asset' },
  { icon: Wand2, tool: 'ai-tools' as Tool, label: 'AI Generate' },
  { icon: Palette, tool: 'gradient' as Tool, label: 'Style Transfer' },
  { icon: ImageIcon, tool: 'brush' as Tool, label: 'In-Painting' },
  { icon: Layers, tool: 'shapes' as Tool, label: 'Segmentation' },
  { icon: Camera, tool: 'crop' as Tool, label: 'View Change' },
  { icon: Lightbulb, tool: 'dodge-burn' as Tool, label: 'Lighting Setup' },
  { icon: Building2, tool: 'pen' as Tool, label: 'Scene Composer' },
  { icon: Package, tool: 'clone' as Tool, label: 'Asset Manager' },
  { icon: Eye, tool: 'measure' as Tool, label: 'Quality Check' },
  { icon: Sparkles, tool: 'magnifier' as Tool, label: 'AI Enhance' }
];

const categories = [
  'All', 'Furniture', 'Vehicles', 'Fashion', 'Urban', 'Historical', 
  'Commercial', 'Nature', 'Technology', 'Fantasy', 'Weapons', 'Architecture'
];

export default function Props() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedAsset, setSelectedAsset] = useState<PropData | null>(sampleAssets[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'prop' | 'scene'>('prop');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAssets = sampleAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = asset.type === activeTab;
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-canvas overflow-hidden">
      <TopBar projectName="Props & Scenes Studio" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-14 bg-toolbar border-r border-panel-border flex flex-col items-center py-2 gap-1">
          {propsTools.map(({ icon: Icon, tool, label }) => (
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
          {/* Asset Browser Header */}
          <div className="bg-panel border-b border-panel-border">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'prop' | 'scene')} className="w-full">
              <div className="px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="prop" className="gap-2">
                    <Package className="w-4 h-4" />
                    Props
                  </TabsTrigger>
                  <TabsTrigger value="scene" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Scenes
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
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
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex-shrink-0"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Tabs>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Asset Gallery */}
            <div className="flex-1 overflow-auto p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedAsset?.id === asset.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative">
                          {asset.type === 'prop' ? (
                            <Package className="w-16 h-16 text-muted-foreground" />
                          ) : (
                            <Building2 className="w-16 h-16 text-muted-foreground" />
                          )}
                          {asset.brand && (
                            <Badge className="absolute top-2 right-2" variant="secondary">
                              <Award className="w-3 h-3 mr-1" />
                              {asset.brand}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm">{asset.name}</h3>
                          <Badge variant={asset.price === 'Free' ? 'secondary' : 'default'} className="text-xs">
                            {asset.price}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{asset.category}</p>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedAsset?.id === asset.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
                          {asset.type === 'prop' ? (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          ) : (
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              <p className="text-sm text-muted-foreground">{asset.category}</p>
                            </div>
                            <Badge variant={asset.price === 'Free' ? 'secondary' : 'default'}>
                              {asset.price}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{asset.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {asset.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {asset.brand && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                {asset.brand}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Asset Details Panel */}
            {selectedAsset && (
              <div className="w-96 border-l border-panel-border bg-panel overflow-auto">
                <Tabs defaultValue="details" className="h-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="variations">Variations</TabsTrigger>
                    <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Asset Name</Label>
                      <p className="font-semibold mt-1">{selectedAsset.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Type</Label>
                      <div className="mt-1">
                        <Badge variant="secondary">
                          {selectedAsset.type === 'prop' ? (
                            <>
                              <Package className="w-3 h-3 mr-1" />
                              Prop
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3 mr-1" />
                              Scene
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <p className="mt-1">{selectedAsset.category}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="mt-1 text-sm">{selectedAsset.description}</p>
                    </div>
                    {selectedAsset.brand && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Brand</Label>
                        <div className="mt-1">
                          <Badge variant="secondary">
                            <Award className="w-3 h-3 mr-1" />
                            {selectedAsset.brand}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-muted-foreground">Quality</Label>
                      <div className="mt-1">
                        <Badge variant={
                          selectedAsset.quality === 'professional' ? 'default' :
                          selectedAsset.quality === 'premium' ? 'secondary' : 'outline'
                        }>
                          {selectedAsset.quality}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedAsset.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <Button className="w-full" variant="default">
                        <Download className="w-4 h-4 mr-2" />
                        Add to Project
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview in 3D
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="variations" className="p-4 space-y-4">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Asset Variations</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Original', 'Style 1', 'Style 2', 'Custom'].map((variation) => (
                          <Button
                            key={variation}
                            variant="outline"
                            className="h-24 flex flex-col gap-2"
                          >
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            <span className="text-xs">{variation}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <Button className="w-full" variant="default">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Generate Variations
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Palette className="w-4 h-4 mr-2" />
                        Apply Style Transfer
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Generate Multi-Angle
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="marketplace" className="p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Price</Label>
                      <p className="font-semibold text-lg mt-1">{selectedAsset.price}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">License Type</Label>
                      <p className="mt-1 text-sm">
                        {selectedAsset.price === 'Free' ? 'Free Use with Attribution' : 'Commercial License'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Downloads</Label>
                      <p className="mt-1">2,345</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Rating</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">4.8 ⭐</Badge>
                        <span className="text-xs text-muted-foreground">(126 reviews)</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <Button className="w-full" variant="default">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {selectedAsset.price === 'Free' ? 'Download Free' : 'Purchase Asset'}
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Award className="w-4 h-4 mr-2" />
                        View in Marketplace
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
