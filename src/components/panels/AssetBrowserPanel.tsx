import { useState } from 'react';
import { Search, User, Image, Mountain, Car, Building, Package, Trees, UtensilsCrossed, Plane, Dog, Grid3x3, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const categories = [
  { icon: Grid3x3, label: 'All', value: 'all' },
  { icon: User, label: 'Characters', value: 'characters' },
  { icon: User, label: 'Portraits', value: 'portraits' },
  { icon: Mountain, label: 'Landscapes', value: 'landscapes' },
  { icon: Car, label: 'Automotive', value: 'automotive' },
  { icon: Building, label: 'Architecture', value: 'architecture' },
  { icon: Package, label: 'Products', value: 'products' },
  { icon: Trees, label: 'Nature', value: 'nature' },
  { icon: UtensilsCrossed, label: 'Food', value: 'food' },
  { icon: Plane, label: 'Travel', value: 'travel' },
  { icon: Dog, label: 'Animals', value: 'animals' },
  { icon: Image, label: 'Textures', value: 'textures' },
  { icon: Upload, label: 'Import', value: 'import' },
];

export const AssetBrowserPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex bg-panel-bg">
      {/* Category Sidebar */}
      <div className="w-14 border-r border-panel-border flex flex-col items-center py-2 gap-1 overflow-y-auto">
        {categories.map(({ icon: Icon, label, value }) => (
          <Button
            key={value}
            variant={selectedCategory === value ? 'default' : 'ghost'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setSelectedCategory(value)}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="p-3 border-b border-panel-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="pl-8 h-8"
            />
          </div>
        </div>

        {/* Library Tabs */}
        <div className="px-3 py-2 border-b border-panel-border overflow-x-auto">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="h-7 text-xs whitespace-nowrap">
              Recent
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs whitespace-nowrap">
              Favorites
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs whitespace-nowrap">
              Project
            </Button>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded border border-panel-border hover:border-primary/50 cursor-pointer transition-all group"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:text-primary">
                  Asset {i}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-panel-border flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1">
            Edit Asset
          </Button>
          <Button size="sm" className="flex-1">
            Add to Layer
          </Button>
        </div>
      </div>
    </div>
  );
};
