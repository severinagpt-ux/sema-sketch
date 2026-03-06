import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package, User, Image, Video, Music, Search, Upload, Star,
  Grid3x3, Paintbrush, Mountain, Box, Trash2, Heart, FolderOpen,
  Clock, Filter, LayoutGrid, LayoutList, MoreVertical, Download,
  Tag, CheckCircle2
} from "lucide-react";
import { useProjectAssets, type AssetCategory, type ProjectAsset } from "@/hooks/useProjectAssets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categoryTabs: { icon: typeof Grid3x3; value: AssetCategory; label: string }[] = [
  { icon: Grid3x3, value: 'all', label: 'All' },
  { icon: User, value: 'characters', label: 'Characters' },
  { icon: Box, value: 'props', label: 'Props' },
  { icon: Mountain, value: 'scenes', label: 'Scenes' },
  { icon: Image, value: 'images', label: 'Images' },
  { icon: Video, value: 'video', label: 'Video' },
  { icon: Music, value: 'audio', label: 'Audio' },
  { icon: Paintbrush, value: 'textures', label: 'Textures' },
  { icon: FolderOpen, value: 'references', label: 'Refs' },
];

type ViewMode = 'grid' | 'list';
type SortMode = 'recent' | 'name' | 'size' | 'favorites';

export const AssetsBrowserPanel = () => {
  const { assets, loading, uploading, uploadAsset, toggleFavorite, deleteAsset, updateCategory } = useProjectAssets();
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      // Auto-detect category from mime
      let cat: AssetCategory = 'uncategorized';
      if (file.type.startsWith('image/')) cat = 'images';
      else if (file.type.startsWith('video/')) cat = 'video';
      else if (file.type.startsWith('audio/')) cat = 'audio';
      await uploadAsset(file, cat);
    }
  }, [uploadAsset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const filteredAssets = assets
    .filter(a => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (sortMode === 'favorites' && !a.is_favorite) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name);
      if (sortMode === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const toggleSelect = (id: string) => {
    setSelectedAssets(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getCategoryCount = (cat: AssetCategory) => {
    if (cat === 'all') return assets.length;
    return assets.filter(a => a.category === cat).length;
  };

  return (
    <TooltipProvider>
      <div
        className="flex flex-col h-full bg-panel-bg relative"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Upload className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">Drop files to upload</p>
            </div>
          </div>
        )}

        {/* Header with search + upload */}
        <div className="p-3 border-b border-panel-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="pl-8 h-8 text-xs"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Upload files</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Category icon tabs */}
        <div className="px-2 py-1.5 border-b border-panel-border">
          <div className="flex flex-wrap gap-0.5">
            {categoryTabs.map(({ icon: Icon, value, label }) => {
              const count = getCategoryCount(value);
              const isActive = activeCategory === value;
              return (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 relative ${isActive ? '' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveCategory(value)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {count > 0 && (
                        <span className={`absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 ${
                          isActive ? 'bg-primary-foreground text-primary' : 'bg-primary/80 text-primary-foreground'
                        }`}>
                          {count > 99 ? '99+' : count}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {label} {count > 0 && `(${count})`}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Sort & View controls */}
        <div className="px-3 py-1.5 border-b border-panel-border flex items-center justify-between">
          <div className="flex gap-1">
            {([
              { value: 'recent', icon: Clock, label: 'Recent' },
              { value: 'favorites', icon: Heart, label: 'Favorites' },
            ] as const).map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={sortMode === value ? "secondary" : "ghost"}
                size="sm"
                className="h-6 text-[10px] px-2 gap-1"
                onClick={() => setSortMode(value)}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            ))}
          </div>
          <div className="flex gap-0.5">
            <Button
              variant={viewMode === 'grid' ? "secondary" : "ghost"}
              size="icon"
              className="h-6 w-6"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-3 h-3" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "secondary" : "ghost"}
              size="icon"
              className="h-6 w-6"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Asset content */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-muted-foreground">Loading assets…</p>
              </div>
            ) : uploading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-muted-foreground">Uploading…</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <Package className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {searchQuery ? 'No results found' : 'No assets yet'}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Upload images, videos, or audio to get started. Drag & drop or click the upload button.'}
                  </p>
                </div>
                {!searchQuery && (
                  <Button
                    size="sm"
                    className="mt-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    Upload Files
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-1.5">
                {filteredAssets.map(asset => (
                  <AssetGridCard
                    key={asset.id}
                    asset={asset}
                    selected={selectedAssets.has(asset.id)}
                    onSelect={() => toggleSelect(asset.id)}
                    onFavorite={() => toggleFavorite(asset.id)}
                    onDelete={() => deleteAsset(asset.id)}
                    onCategoryChange={(cat) => updateCategory(asset.id, cat)}
                    formatSize={formatSize}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredAssets.map(asset => (
                  <AssetListRow
                    key={asset.id}
                    asset={asset}
                    selected={selectedAssets.has(asset.id)}
                    onSelect={() => toggleSelect(asset.id)}
                    onFavorite={() => toggleFavorite(asset.id)}
                    onDelete={() => deleteAsset(asset.id)}
                    formatSize={formatSize}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom status bar */}
        {assets.length > 0 && (
          <div className="px-3 py-1.5 border-t border-panel-border flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{filteredAssets.length} of {assets.length} assets</span>
            {selectedAssets.size > 0 && (
              <span className="text-primary font-medium">{selectedAssets.size} selected</span>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

// Grid card sub-component
function AssetGridCard({ asset, selected, onSelect, onFavorite, onDelete, onCategoryChange, formatSize }: {
  asset: ProjectAsset;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onDelete: () => void;
  onCategoryChange: (cat: string) => void;
  formatSize: (n: number) => string;
}) {
  const isImage = asset.file_type === 'image';
  const isVideo = asset.file_type === 'video';
  const isAudio = asset.file_type === 'audio';

  return (
    <div
      className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${
        selected ? 'border-primary ring-1 ring-primary/30' : 'border-panel-border'
      }`}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-secondary relative overflow-hidden">
        {isImage ? (
          <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isVideo ? <Video className="w-8 h-8 text-muted-foreground" /> : isAudio ? <Music className="w-8 h-8 text-muted-foreground" /> : <Package className="w-8 h-8 text-muted-foreground" />}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7 bg-background/80" onClick={(e) => { e.stopPropagation(); onFavorite(); }}>
            <Heart className={`w-3.5 h-3.5 ${asset.is_favorite ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="icon" variant="ghost" className="h-7 w-7 bg-background/80">
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => window.open(asset.file_url, '_blank')}>
                <Download className="w-3.5 h-3.5 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-muted-foreground" disabled>Move to…</DropdownMenuItem>
              {['characters','props','scenes','images','textures','references'].map(cat => (
                <DropdownMenuItem key={cat} onClick={() => onCategoryChange(cat)} className="capitalize text-xs pl-6">
                  {cat}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected check */}
        {selected && (
          <div className="absolute top-1 left-1">
            <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
          </div>
        )}

        {/* Favorite badge */}
        {asset.is_favorite && (
          <div className="absolute top-1 right-1">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-1.5">
        <p className="text-[11px] font-medium text-foreground truncate">{asset.name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <Badge variant="secondary" className="text-[9px] h-4 px-1 capitalize">{asset.category}</Badge>
          <span className="text-[9px] text-muted-foreground">{formatSize(asset.file_size || 0)}</span>
        </div>
      </div>
    </div>
  );
}

// List row sub-component
function AssetListRow({ asset, selected, onSelect, onFavorite, onDelete, formatSize }: {
  asset: ProjectAsset;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onDelete: () => void;
  formatSize: (n: number) => string;
}) {
  const isImage = asset.file_type === 'image';

  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer transition-all hover:border-primary/50 group ${
        selected ? 'border-primary bg-primary/5' : 'border-panel-border'
      }`}
      onClick={onSelect}
    >
      <div className="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0">
        {isImage ? (
          <img src={asset.file_url} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {asset.file_type === 'video' ? <Video className="w-4 h-4 text-muted-foreground" /> : <Music className="w-4 h-4 text-muted-foreground" />}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{asset.name}</p>
        <p className="text-[10px] text-muted-foreground">{formatSize(asset.file_size || 0)} · {asset.category}</p>
      </div>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onFavorite(); }}>
          <Heart className={`w-3 h-3 ${asset.is_favorite ? 'fill-primary text-primary' : ''}`} />
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
