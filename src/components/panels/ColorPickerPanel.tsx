import { useToolContext } from '@/contexts/ToolContext';
import { Palette } from 'lucide-react';

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF8000', '#8000FF',
  '#0080FF', '#FF0080', '#80FF00', '#00FF80', '#8B4513',
  '#FFD700', '#C0C0C0', '#808080', '#800000', '#008000'
];

export const ColorPickerPanel = () => {
  const { settings, updateSettings } = useToolContext();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Palette className="w-4 h-4" />
        <h3 className="text-sm font-semibold">Color</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Current Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className="w-16 h-16 rounded border border-panel-border cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={settings.color.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(value)) {
                    updateSettings({ color: value });
                  }
                }}
                className="w-full px-3 py-2 bg-background border border-panel-border rounded text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Preset Colors</label>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ color })}
                className="w-full aspect-square rounded border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: settings.color === color ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
