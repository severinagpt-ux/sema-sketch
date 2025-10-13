import { useState } from 'react';
import { Search, User, Image, Mountain, Car, Building, Package, Trees, UtensilsCrossed, Plane, Dog, Grid3x3, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import portrait1 from '@/assets/portrait-1.jpg';
import portrait2 from '@/assets/portrait-2.jpg';
import portrait3 from '@/assets/portrait-3.jpg';
import landscape1 from '@/assets/landscape-1.jpg';
import nature1 from '@/assets/nature-1.jpg';
import nature2 from '@/assets/nature-2.jpg';
import product1 from '@/assets/product-1.jpg';
import architecture1 from '@/assets/architecture-1.jpg';

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

const assets = [
  { id: 1, src: portrait1, category: 'portraits', name: 'Portrait 1' },
  { id: 2, src: portrait2, category: 'portraits', name: 'Portrait 2' },
  { id: 3, src: portrait3, category: 'portraits', name: 'Portrait 3' },
  { id: 4, src: landscape1, category: 'landscapes', name: 'Landscape 1' },
  { id: 5, src: nature1, category: 'nature', name: 'Nature 1' },
  { id: 6, src: nature2, category: 'nature', name: 'Nature 2' },
  { id: 7, src: product1, category: 'products', name: 'Product 1' },
  { id: 8, src: architecture1, category: 'architecture', name: 'Architecture 1' },
];

export const AssetBrowserPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="aspect-square bg-muted rounded border border-panel-border hover:border-primary/50 cursor-pointer transition-all group overflow-hidden"
              >
                <img 
                  src={asset.src} 
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
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
