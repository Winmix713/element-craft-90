import { useState } from 'react';
import {
  Laptop,
  UnfoldHorizontal,
  UnfoldVertical,
  Scan,
  Square,
  Eye,
  Image,
  Move,
  Zap,
  RotateCw,
  Maximize,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ColorPickerPopover } from './ColorPickerPopover';

interface EditTabProps {
  elementContent: string;
  onContentChange: (content: string) => void;
}

export const EditTab = ({ elementContent, onContentChange }: EditTabProps) => {
  const [opacity, setOpacity] = useState(100);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(100);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [perspective, setPerspective] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {/* Breakpoint Selector */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex border border-border rounded-md overflow-hidden h-6">
          <button className="px-2 text-[9px] transition-all bg-primary text-primary-foreground">AUTO</button>
          <button className="px-2 text-[9px] transition-all bg-card text-muted-foreground border-l border-border hover:bg-secondary">*</button>
          <button className="px-2 text-[9px] transition-all bg-accent/20 text-accent-foreground border-l border-border">MD</button>
        </div>
        <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1">
          <Laptop className="w-3 h-3" />
          <span>Auto Breakpoint</span>
        </span>
      </div>

      <Accordion type="multiple" defaultValue={['family', 'text', 'typography', 'background', 'transforms']} className="space-y-1">
        {/* Family Elements */}
        <AccordionItem value="family" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Family Elements
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">div</Button>
              <div className="text-muted-foreground text-[10px]">├</div>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">div</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">div</Button>
              <Button variant="outline" size="sm" className="h-6 text-[11px] px-1.5 py-0.5">p</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Link */}
        <AccordionItem value="link" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Link
          </AccordionTrigger>
          <AccordionContent>
            <Input type="text" placeholder="/page or url..." className="h-8 text-xs" />
          </AccordionContent>
        </AccordionItem>

        {/* Text Content */}
        <AccordionItem value="text" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Text Content
          </AccordionTrigger>
          <AccordionContent>
            <Textarea
              placeholder="Enter text content..."
              rows={1}
              className="resize-none text-xs"
              value={elementContent}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tailwind Classes */}
        <AccordionItem value="classes" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Tailwind Classes
          </AccordionTrigger>
          <AccordionContent>
            <Textarea
              placeholder="Enter Tailwind classes..."
              rows={1}
              className="resize-none text-xs opacity-50 cursor-not-allowed"
              disabled
              defaultValue="px-2 pb-3 text-[18px] md:text-[20px] font-semibold tracking-tight"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Margin */}
        <AccordionItem value="margin" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Margin
              <Scan className="w-3 h-3" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} />
              <IconInput icon={<UnfoldVertical className="w-3 h-3" />} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Padding */}
        <AccordionItem value="padding" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Padding
              <Square className="w-3 h-3" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput label="L" defaultValue="2" />
                <LabeledInput label="T" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput label="R" defaultValue="2" />
                <LabeledInput label="B" defaultValue="3" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <IconInput icon={<UnfoldHorizontal className="w-3 h-3" />} />
              <IconInput icon={<UnfoldVertical className="w-3 h-3" />} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Typography */}
        <AccordionItem value="typography" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Typography
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Select defaultValue="inter">
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="default">
                  <SelectTrigger className="h-7 text-xs opacity-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select defaultValue="semibold">
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semibold">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="tight">
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">Tight</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Appearance */}
        <AccordionItem value="appearance" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Appearance
              <Eye className="w-3 h-3" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="opacity">
                <SelectTrigger className="h-7 text-xs opacity-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opacity">Opacity</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="blend">
                <SelectTrigger className="h-7 text-xs opacity-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blend">Blend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Background */}
        <AccordionItem value="background" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Background
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <ColorPickerPopover
                color={backgroundColor}
                onChange={setBackgroundColor}
                label="Background"
              />
              <button className="h-7 flex items-center gap-2 px-2 py-1 text-xs rounded-md border border-border bg-card opacity-30">
                <div className="w-4 h-4 rounded border border-border bg-muted flex items-center justify-center">
                  <Image className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
                <span className="text-xs truncate">No Image</span>
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Border */}
        <AccordionItem value="border" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Border
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <ColorPickerPopover
                color={borderColor}
                onChange={setBorderColor}
                label="Border Color"
              />
              <Input type="text" placeholder="Width" className="h-7 text-xs" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transforms */}
        <AccordionItem value="transforms" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            Transforms
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Slider icon={<Move className="w-2.5 h-2.5" />} label="Translate X" value={translateX} onChange={setTranslateX} min={-200} max={200} unit="" />
                <Slider icon={<Move className="w-2.5 h-2.5" />} label="Translate Y" value={translateY} onChange={setTranslateY} min={-200} max={200} unit="" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Slider icon={<Zap className="w-2.5 h-2.5" />} label="Skew X" value={skewX} onChange={setSkewX} min={-45} max={45} unit="°" />
                <Slider icon={<Zap className="w-2.5 h-2.5" />} label="Skew Y" value={skewY} onChange={setSkewY} min={-45} max={45} unit="°" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Slider icon={<RotateCw className="w-2.5 h-2.5" />} label="Rotate" value={rotate} onChange={setRotate} min={-180} max={180} unit="°" />
                <Slider icon={<Maximize className="w-2.5 h-2.5" />} label="Scale" value={scale} onChange={setScale} min={0} max={200} unit="%" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3D Transform */}
        <AccordionItem value="transform3d" className="border-none">
          <AccordionTrigger className="text-xs font-medium text-muted-foreground py-2 hover:no-underline">
            3D Transform
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Slider icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate X" value={rotateX} onChange={setRotateX} min={-180} max={180} unit="°" />
                <Slider icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Y" value={rotateY} onChange={setRotateY} min={-180} max={180} unit="°" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Slider icon={<RotateCw className="w-2.5 h-2.5" />} label="3D Rotate Z" value={rotateZ} onChange={setRotateZ} min={-180} max={180} unit="°" />
                <Slider icon={<Maximize className="w-2.5 h-2.5" />} label="Perspective" value={perspective} onChange={setPerspective} min={0} max={6} unit="" valueLabel={perspective === 0 ? 'Default' : perspective.toString()} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Helper Components
const IconInput = ({ icon }: { icon: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-30">
      {icon}
    </div>
    <Input type="text" className="h-8 text-xs pl-8" />
  </div>
);

const LabeledInput = ({ label, defaultValue }: { label: string; defaultValue?: string }) => (
  <div className="relative">
    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xs font-light text-foreground pointer-events-none ${!defaultValue ? 'opacity-30' : ''}`}>
      {label}
    </span>
    <Input type="text" defaultValue={defaultValue} className="h-8 text-xs pl-8" />
  </div>
);

const Slider = ({
  icon,
  label,
  value,
  onChange,
  min,
  max,
  unit,
  valueLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  valueLabel?: string;
}) => (
  <div className="-space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground">{valueLabel || `${value}${unit}`}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
    />
  </div>
);
