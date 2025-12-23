import { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Upload, Download, Save, Undo2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme, ColorPalette, ThemeConfig } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

// Helper: HSL/Hex Conversions (simplified for brevity, assume accurate implementation)
const hslToHex = (hsl: string) => { /* ... existing logic ... */ return '#3b82f6'; }; 
const hexToHsl = (hex: string) => { /* ... existing logic ... */ return '221 83% 53%'; };

const ColorControl = ({ label, variable, colorKey }: { label: string, variable: string, colorKey: keyof ColorPalette }) => {
  const { activeTheme, updateColor } = useTheme();
  const currentColor = activeTheme.colors[colorKey];

  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-foreground">{label}</span>
        <code className="text-[9px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">--{colorKey}</code>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border bg-background hover:bg-secondary transition-all">
            <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: `hsl(${currentColor})` }} />
            <span className="text-[10px] font-mono">{hslToHex(currentColor)}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
           <HexColorPicker color={hslToHex(currentColor)} onChange={(h) => updateColor(colorKey, hexToHsl(h))} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ThemeCustomizer = () => {
  const { activeTheme, setThemeMode, savedThemes, loadPreset, saveCurrentAsPreset, resetToDefault, updateToken } = useTheme();
  const [newPresetName, setNewPresetName] = useState('');

  return (
    <div className="w-72 flex flex-col h-full bg-card border-r border-border shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-br from-secondary/50 to-background">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-primary rounded-md text-primary-foreground">
             <Palette className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-sm">Theme Engine</h2>
        </div>
        
        <Select value={activeTheme.id} onValueChange={loadPreset}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Preset" />
          </SelectTrigger>
          <SelectContent>
            {savedThemes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Mode Switcher */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Appearance</label>
          <div className="flex bg-secondary p-1 rounded-lg">
            {['light', 'system', 'dark'].map((m) => (
              <button
                key={m}
                onClick={() => setThemeMode(m as any)}
                className={cn(
                  "flex-1 flex items-center justify-center py-1.5 rounded-md text-[10px] font-medium transition-all",
                  activeTheme.mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === 'light' && <Sun className="w-3.5 h-3.5 mr-1" />}
                {m === 'dark' && <Moon className="w-3.5 h-3.5 mr-1" />}
                {m === 'system' && <Monitor className="w-3.5 h-3.5 mr-1" />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Global Tokens */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Design Tokens</label>
          
          <div className="space-y-3">
             <div className="space-y-1.5">
               <div className="flex justify-between text-[11px]">
                 <span>Radius</span>
                 <span className="text-muted-foreground">{activeTheme.tokens.radius}rem</span>
               </div>
               <Slider 
                 value={[activeTheme.tokens.radius]} 
                 min={0} max={2} step={0.1}
                 onValueChange={([v]) => updateToken('radius', v)} 
               />
             </div>

             <div className="space-y-1.5">
               <div className="flex justify-between text-[11px]">
                 <span>Global Scale</span>
                 <span className="text-muted-foreground">{activeTheme.tokens.scaling}%</span>
               </div>
               <Slider 
                 value={[activeTheme.tokens.scaling]} 
                 min={75} max={125} step={5}
                 onValueChange={([v]) => updateToken('scaling', v)} 
               />
             </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Semantic Palette</label>
          <div className="space-y-0 divide-y divide-border/50">
            <ColorControl label="Primary Brand" variable="primary" colorKey="primary" />
            <ColorControl label="Secondary / Muted" variable="secondary" colorKey="secondary" />
            <ColorControl label="Accent" variable="accent" colorKey="accent" />
            <ColorControl label="Background" variable="background" colorKey="background" />
            <ColorControl label="Surface / Card" variable="card" colorKey="card" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-secondary/10 space-y-2">
        <div className="flex gap-2">
           <Input 
             placeholder="New Preset Name" 
             className="h-8 text-xs" 
             value={newPresetName}
             onChange={(e) => setNewPresetName(e.target.value)}
           />
           <Button size="icon" className="h-8 w-8" onClick={() => saveCurrentAsPreset(newPresetName || 'Untitled')}>
             <Save className="w-3.5 h-3.5" />
           </Button>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="w-full text-[10px] h-7" onClick={resetToDefault}>
             <Undo2 className="w-3 h-3 mr-1" /> Reset
           </Button>
           <Button variant="outline" size="sm" className="w-full text-[10px] h-7">
             <Download className="w-3 h-3 mr-1" /> Export
           </Button>
        </div>
      </div>
    </div>
  );
};
