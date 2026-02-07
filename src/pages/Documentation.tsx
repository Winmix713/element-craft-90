import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Layers, Code2, Wand2, Move, Palette, Type, RotateCw,
  Eye, Square, Scan, Image, Sparkles, Save, Upload, Download,
  RotateCcw, MousePointer2, Trash2, Copy, ChevronRight, Box,
  Smartphone, Monitor, Tablet, Laptop, Zap, Maximize, Send,
  Figma, Paperclip, WandSparkles, Check, X, Plus, Settings2,
  BookOpen, Cpu, Database, GitBranch, Shield, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ─── Section Card ────────────────────────────────────
const DocSection: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  badge?: string;
}> = ({ id, icon, title, subtitle, children, badge }) => (
  <section id={id} className="scroll-mt-24">
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-panel)] hover:shadow-lg transition-shadow duration-300">
      <div className="border-b border-border bg-secondary/30 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {badge && (
              <span className="text-[10px] font-medium uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </section>
);

// ─── Feature Row ─────────────────────────────────────
const FeatureRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  code?: string;
}> = ({ icon, title, description, code }) => (
  <div className="flex gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      {code && (
        <pre className="mt-2 text-[10px] font-mono bg-background/80 border border-border/50 rounded-lg px-3 py-2 overflow-x-auto text-muted-foreground">
          {code}
        </pre>
      )}
    </div>
  </div>
);

// ─── Code Block ──────────────────────────────────────
const CodeBlock: React.FC<{ title: string; language: string; children: string }> = ({ title, language, children }) => (
  <div className="rounded-xl border border-border overflow-hidden">
    <div className="bg-secondary/50 px-4 py-2 flex items-center justify-between border-b border-border">
      <span className="text-[10px] font-mono uppercase text-muted-foreground">{title}</span>
      <span className="text-[10px] font-mono text-primary/70">{language}</span>
    </div>
    <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto bg-background/50 text-foreground">
      {children}
    </pre>
  </div>
);

// ─── Architecture Diagram ────────────────────────────
const ArchitectureDiagram: React.FC = () => (
  <div className="rounded-xl border border-border bg-secondary/10 p-6">
    <div className="flex flex-col items-center gap-4">
      {/* Top Level */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl px-6 py-3 text-center">
        <div className="text-xs font-semibold text-primary">InspectorProvider</div>
        <div className="text-[10px] text-muted-foreground">Context + State Management</div>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-px h-6 bg-border" />
      </div>

      {/* Main Component */}
      <div className="bg-card border border-border rounded-xl px-6 py-3 text-center shadow-sm">
        <div className="text-xs font-semibold text-foreground">PropertyInspector</div>
        <div className="text-[10px] text-muted-foreground">Draggable Panel Shell</div>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-px h-4 bg-border" />
      </div>

      {/* Tabs Row */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
        <div className="bg-card border border-primary/40 rounded-xl px-4 py-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-primary">EDIT Tab</div>
          <div className="text-[10px] text-muted-foreground mt-1">Visual Controls</div>
          <div className="text-[10px] text-muted-foreground">12 Accordion Sections</div>
        </div>
        <div className="bg-card border border-accent/40 rounded-xl px-4 py-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-accent">PROMPT Tab</div>
          <div className="text-[10px] text-muted-foreground mt-1">AI Integration</div>
          <div className="text-[10px] text-muted-foreground">SSE Streaming</div>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3 text-center shadow-sm">
          <div className="text-xs font-semibold text-foreground">CODE Tab</div>
          <div className="text-[10px] text-muted-foreground mt-1">Monaco Editor</div>
          <div className="text-[10px] text-muted-foreground">Two-way Binding</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-px h-4 bg-border" />
      </div>

      {/* Shared Components */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-lg">
        {[
          { name: 'ColorPicker', icon: '🎨' },
          { name: 'GradientPicker', icon: '🌈' },
          { name: 'Slider', icon: '🎚️' },
          { name: 'IconInput', icon: '📝' },
        ].map((comp) => (
          <div key={comp.name} className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-center">
            <div className="text-sm">{comp.icon}</div>
            <div className="text-[10px] font-mono text-muted-foreground">{comp.name}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-px h-4 bg-border" />
      </div>

      {/* Canvas */}
      <div className="bg-card border border-border rounded-xl px-6 py-3 text-center shadow-sm">
        <div className="text-xs font-semibold text-foreground">Canvas</div>
        <div className="text-[10px] text-muted-foreground">Live Preview with Computed Styles</div>
      </div>
    </div>
  </div>
);

// ─── State Flow Diagram ──────────────────────────────
const StateFlowDiagram: React.FC = () => (
  <div className="rounded-xl border border-border bg-secondary/10 p-6 space-y-3">
    <h4 className="text-xs font-semibold text-foreground mb-4">Állapotkezelés Folyamatábrája</h4>
    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
      {[
        { label: 'User Input', color: 'bg-primary/10 text-primary border-primary/30' },
        { label: '→', color: 'text-muted-foreground' },
        { label: 'updateState()', color: 'bg-accent/10 text-accent border-accent/30' },
        { label: '→', color: 'text-muted-foreground' },
        { label: 'History Push', color: 'bg-secondary text-foreground border-border' },
        { label: '→', color: 'text-muted-foreground' },
        { label: 'setState()', color: 'bg-primary/10 text-primary border-primary/30' },
        { label: '→', color: 'text-muted-foreground' },
        { label: 'Re-render', color: 'bg-accent/10 text-accent border-accent/30' },
        { label: '→', color: 'text-muted-foreground' },
        { label: 'localStorage', color: 'bg-secondary text-foreground border-border' },
      ].map((item, i) => (
        item.label === '→'
          ? <ChevronRight key={i} className="w-3 h-3 text-muted-foreground" />
          : <span key={i} className={`px-2 py-1 rounded-md border font-mono ${item.color}`}>{item.label}</span>
      ))}
    </div>
  </div>
);

// ─── Nav Item ────────────────────────────────────────
const NavItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}> = ({ href, icon, label, active, onClick }) => (
  <a
    href={href}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
      active
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
    }`}
  >
    {icon}
    {label}
  </a>
);

// ─── Main Documentation Page ─────────────────────────
const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navSections = [
    { id: 'overview', icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Áttekintés' },
    { id: 'architecture', icon: <GitBranch className="w-3.5 h-3.5" />, label: 'Architektúra' },
    { id: 'state', icon: <Database className="w-3.5 h-3.5" />, label: 'Állapotkezelés' },
    { id: 'edit-tab', icon: <Settings2 className="w-3.5 h-3.5" />, label: 'EDIT Tab' },
    { id: 'prompt-tab', icon: <Wand2 className="w-3.5 h-3.5" />, label: 'PROMPT Tab' },
    { id: 'code-tab', icon: <Code2 className="w-3.5 h-3.5" />, label: 'CODE Tab' },
    { id: 'components', icon: <Box className="w-3.5 h-3.5" />, label: 'Komponensek' },
    { id: 'canvas', icon: <Eye className="w-3.5 h-3.5" />, label: 'Canvas' },
    { id: 'performance', icon: <Zap className="w-3.5 h-3.5" />, label: 'Teljesítmény' },
    { id: 'api', icon: <Cpu className="w-3.5 h-3.5" />, label: 'API Referencia' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">Vissza</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">PropertyInspector</h1>
                <p className="text-[10px] text-muted-foreground">Dokumentáció v2.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">React 18</span>
            <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-full font-medium">TypeScript</span>
            <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-full font-medium">Tailwind CSS</span>
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar Navigation */}
        <nav className="fixed left-0 top-16 bottom-0 w-56 border-r border-border bg-card/50 p-4 space-y-1 overflow-y-auto hidden lg:block">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-3 px-3">Tartalomjegyzék</p>
          {navSections.map((s) => (
            <NavItem
              key={s.id}
              href={`#${s.id}`}
              icon={s.icon}
              label={s.label}
              active={activeSection === s.id}
              onClick={() => scrollToSection(s.id)}
            />
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56 p-6 lg:p-10 max-w-4xl mx-auto space-y-8">

          {/* ───────────────── OVERVIEW ───────────────── */}
          <DocSection
            id="overview"
            icon={<BookOpen className="w-5 h-5" />}
            title="Áttekintés"
            subtitle="A PropertyInspector teljes bemutatása"
          >
            <div className="space-y-4">
              <p className="text-sm text-foreground leading-relaxed">
                A <strong>PropertyInspector</strong> egy professzionális szintű, lebegő vizuális szerkesztő panel, 
                amely valós idejű CSS/Tailwind tulajdonság-szerkesztést, AI-alapú stílusmódosítást és teljes Monaco Editor 
                integrációt biztosít. A rendszer három fő üzemmódban működik:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                  <Settings2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">EDIT</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Vizuális szerkesztés 12 kategóriában: layout, tipográfia, 2D/3D transzformáció, effektek</p>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
                  <Wand2 className="w-6 h-6 text-accent mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">PROMPT</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">AI-alapú módosítás természetes nyelven, streaming válaszokkal</p>
                </div>
                <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                  <Code2 className="w-6 h-6 text-foreground mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">CODE</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Monaco Editor kétirányú szinkronizálással és HTML/JSX szerkesztéssel</p>
                </div>
              </div>

              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">Fő jellemzők</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  {[
                    'Drag & Drop mozgatható panel',
                    'Undo/Redo history (20 lépés)',
                    'localStorage állapot-perzisztencia',
                    'JSON export/import konfiguráció',
                    'Breakpoint-specifikus szerkesztés',
                    'Tailwind CSS class generálás',
                    'Solid & Gradient színkezelés',
                    '2D & 3D transzformációk',
                    'Opacity & Blur effektek',
                    'AI prompt sablonok',
                    'SSE streaming válaszok',
                    'Monaco Editor integráció',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-primary flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DocSection>

          {/* ───────────────── ARCHITECTURE ───────────────── */}
          <DocSection
            id="architecture"
            icon={<GitBranch className="w-5 h-5" />}
            title="Architektúra"
            subtitle="Moduláris felépítés és komponens hierarchia"
          >
            <div className="space-y-6">
              <ArchitectureDiagram />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Fájlstruktúra</h4>
                <CodeBlock title="Könyvtárszerkezet" language="tree">
{`src/components/PropertyInspector/
├── index.tsx                    # Fő komponens: Draggable shell + TabButton
├── InspectorContext.tsx          # Állapotkezelés: Context, Provider, Hook
├── components/
│   ├── Canvas.tsx                # Élő előnézet computed stílusokkal
│   ├── ColorPicker.tsx           # HEX szín választó popoverrel
│   ├── GradientColorPicker.tsx   # Solid + Linear/Radial gradiens
│   ├── Slider.tsx                # Numerikus csúszka vizuális visszajelzéssel
│   ├── IconInput.tsx             # Ikonos és címkés input mezők
│   └── PropertySection.tsx       # Összecsukható szekció wrapper
└── tabs/
    ├── EditTab.tsx               # 640 sor — 12 accordion szekció
    ├── CodeTab.tsx               # Monaco Editor + kétirányú szinkron
    └── PromptTab.tsx             # AI prompt + SSE streaming`}
                </CodeBlock>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Technológiai Stack</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'React 18', desc: 'UI framework' },
                    { name: 'TypeScript', desc: 'Típusbiztonság' },
                    { name: 'Tailwind CSS', desc: 'Utility stílusok' },
                    { name: 'react-draggable', desc: 'Panel mozgatás' },
                    { name: '@monaco-editor/react', desc: 'Kódszerkesztő' },
                    { name: 'react-colorful', desc: 'Színválasztó' },
                    { name: 'Radix UI', desc: 'Accordion, Popover, Select' },
                    { name: 'Lucide React', desc: 'Ikonkészlet' },
                    { name: 'Sonner', desc: 'Toast értesítések' },
                  ].map((tech) => (
                    <div key={tech.name} className="bg-secondary/30 border border-border rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-foreground">{tech.name}</div>
                      <div className="text-[10px] text-muted-foreground">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DocSection>

          {/* ───────────────── STATE MANAGEMENT ───────────────── */}
          <DocSection
            id="state"
            icon={<Database className="w-5 h-5" />}
            title="Állapotkezelés"
            subtitle="InspectorContext és state management pattern"
          >
            <div className="space-y-6">
              <StateFlowDiagram />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">InspectorState Interfész</h4>
                <CodeBlock title="InspectorState típusdefiníció" language="TypeScript">
{`interface InspectorState {
  elementId: string;           // Egyedi elem azonosító
  elementTag: string;          // HTML tag (h1, div, p, span...)
  textContent: string;         // Szöveges tartalom
  link: string;                // Opcionális link URL
  tailwindClasses: string;     // Kézzel szerkeszthető Tailwind classok
  
  margin: { left, top, right, bottom: string };   // Tailwind margó értékek
  padding: { left, top, right, bottom: string };  // Tailwind padding értékek
  size: { width, height, maxWidth, maxHeight: string };
  
  typography: {
    fontFamily: string;        // 8 betűtípus választék
    fontSize: string;          // px-ben megadva
    fontWeight: string;        // thin → extrabold
    letterSpacing: string;     // tighter → widest
    lineHeight: string;        // tight → loose
    textAlign: string;         // left, center, right, justify
  };
  
  background: { color: string | GradientValue; image: string };
  border: { color: string; width: string; radius: string };
  
  transforms: {
    translateX/Y: number;      // -200 → 200 px
    rotate: number;            // -180 → 180°
    scale: number;             // 0 → 200%
    skewX/Y: number;           // -45 → 45°
  };
  
  transforms3d: {
    rotateX/Y/Z: number;      // -180 → 180°
    perspective: number;       // 0 → 6 (×100px)
  };
  
  opacity: number;             // 0 → 100%
  blur?: number;               // 0+ px
  backdropBlur?: number;       // 0+ px
  breakpoint: 'auto'|'base'|'sm'|'md'|'lg'|'xl'|'2xl';
}`}
                </CodeBlock>
              </div>

              <Accordion type="multiple" className="space-y-2">
                <AccordionItem value="undo" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-primary" />
                      Undo rendszer (20 lépéses history)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Minden állapotváltozás előtt az aktuális state mentésre kerül a history tömbbe (max. 20 elem). 
                        Az <code className="bg-secondary px-1 rounded">undo()</code> függvény visszaállítja az utolsó mentett állapotot.
                      </p>
                      <CodeBlock title="Undo implementáció" language="TypeScript">
{`const updateState = useCallback(<K extends keyof InspectorState>(
  key: K, value: InspectorState[K]
) => {
  setState(prev => {
    setHistory(h => [...h.slice(-19), prev]); // Max 20 elem
    return { ...prev, [key]: value };
  });
}, []);

const undo = useCallback(() => {
  if (history.length > 0) {
    const previousState = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setState(previousState);
  }
}, [history]);`}
                      </CodeBlock>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="persistence" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4 text-primary" />
                      localStorage perzisztencia (300ms debounce)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Az állapot automatikusan mentődik a <code className="bg-secondary px-1 rounded">localStorage</code>-ba 
                      300ms debounce-szal. Betöltéskor a mentett állapot mergelődik az alapértelmezettekkel, így az újonnan 
                      hozzáadott mezők is kapnak default értéket.
                    </p>
                    <CodeBlock title="Perzisztencia minta" language="TypeScript">
{`// Betöltés: merge saved + defaults
const saved = localStorage.getItem('inspector-state');
return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;

// Mentés: debounced useEffect
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('inspector-state', JSON.stringify(state));
  }, 300);
  return () => clearTimeout(timer);
}, [state]);`}
                    </CodeBlock>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tailwind-gen" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      Tailwind CSS generálás
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      A <code className="bg-secondary px-1 rounded">generateTailwindClasses()</code> az összes state tulajdonságot 
                      Tailwind utility classokká konvertálja, beleértve a breakpoint prefix-eket is.
                    </p>
                    <CodeBlock title="Generált osztályok példa" language="text">
{`// Auto breakpoint:
pl-2 pr-2 pb-3 text-[18px] font-semibold tracking-tight

// MD breakpoint:
md:pl-2 md:pr-2 md:pb-3 md:text-[18px] md:font-semibold

// Transzformációkkal:
rotate-[15deg] scale-[1.20] translate-x-[50px]
[transform:rotateY(30deg)] [perspective:400px]`}
                    </CodeBlock>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DocSection>

          {/* ───────────────── EDIT TAB ───────────────── */}
          <DocSection
            id="edit-tab"
            icon={<Settings2 className="w-5 h-5" />}
            title="EDIT Tab — Vizuális Szerkesztő"
            subtitle="12 összecsukható szekció 640 sor vizuális kontrollal"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <FeatureRow
                  icon={<Laptop className="w-4 h-4" />}
                  title="Breakpoint Selector"
                  description="7 breakpoint: AUTO, *, SM, MD, LG, XL, 2XL. Az összes generált Tailwind class megkapja a kiválasztott prefix-et (pl. md:pl-2). Az AUTO/BASE prefix nélkül generál."
                />
                <FeatureRow
                  icon={<Layers className="w-4 h-4" />}
                  title="Family Elements"
                  description="Az elem DOM hierarchiáját mutatja (szülő/testvér elemek). Vizuális breadcrumb navigáció a struktúrában."
                />
                <FeatureRow
                  icon={<Type className="w-4 h-4" />}
                  title="Text Content & Link"
                  description="Debounced szövegmezők (100ms) az elem szövegtartalmának és opcionális linkjének szerkesztéséhez. A link wrapper <a> tag-et generál a kód outputban."
                />
                <FeatureRow
                  icon={<Code2 className="w-4 h-4" />}
                  title="Tailwind Classes"
                  description="Közvetlen Tailwind class szerkesztés textarea-ban. A beírt classok azonnal megjelennek a Canvas előnézetben."
                />
                <FeatureRow
                  icon={<Scan className="w-4 h-4" />}
                  title="Margin & Padding"
                  description="4-irányú (L, T, R, B) Tailwind érték szerkesztés LabeledInput komponensekkel. Az értékek Tailwind spacing skálán értelmezettek (1 = 0.25rem)."
                  code="margin: { left: '4', top: '2' } → ml-4 mt-2"
                />
                <FeatureRow
                  icon={<Square className="w-4 h-4" />}
                  title="Size"
                  description="Width/Height szerkesztés px-ben, IconInput-tal. Arbitrary value syntax-szal generálódik: w-[320px] h-[200px]."
                />
                <FeatureRow
                  icon={<Type className="w-4 h-4" />}
                  title="Typography"
                  description="Font family (8 választék), font size (px), font weight (7 szint), letter spacing (6 szint). Select dropdown-okkal és input mezőkkel."
                />
                <FeatureRow
                  icon={<Eye className="w-4 h-4" />}
                  title="Appearance — Opacity"
                  description="0–100% opacitás csúszkával. A Slider komponens vizuális visszajelzéssel mutatja az aktuális értéket és a fill arányát."
                />
                <FeatureRow
                  icon={<Palette className="w-4 h-4" />}
                  title="Background — Solid & Gradient"
                  description="GradientColorPicker: Solid szín (HEX picker + presetek) VAGY gradiens (linear/radial, tetszőleges szögben, korlátlan stop-okkal). Élő előnézet a pickerben."
                />
                <FeatureRow
                  icon={<Square className="w-4 h-4" />}
                  title="Border"
                  description="Border szín (ColorPicker), vastagság (px) és lekerekítés (px). A színt, szélességet és radiust külön-külön Tailwind classokra konvertálja."
                />
                <FeatureRow
                  icon={<Move className="w-4 h-4" />}
                  title="2D Transforms"
                  description="TranslateX/Y (-200↔200px), SkewX/Y (-45↔45°), Rotate (-180↔180°), Scale (0↔200%). Mind Slider komponenssel, valós idejű Canvas frissítéssel."
                />
                <FeatureRow
                  icon={<RotateCw className="w-4 h-4" />}
                  title="3D Transforms"
                  description="RotateX/Y/Z (-180↔180°) és Perspective (0–6, ×100px). A Canvas 1200px perspective wrapper-ben rendereli az eredményt."
                />
              </div>
            </div>
          </DocSection>

          {/* ───────────────── PROMPT TAB ───────────────── */}
          <DocSection
            id="prompt-tab"
            icon={<Wand2 className="w-5 h-5" />}
            title="PROMPT Tab — AI Integráció"
            subtitle="Természetes nyelvű stílusmódosítás streaming válaszokkal"
            badge="AI"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Az AI rendszer az aktuális elem állapotát (tag, classok, szöveg) küldi el a modellnek egy strukturált 
                system prompt-tal, amely JSON formátumú választ kér. A válasz automatikusan alkalmazásra kerül.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FeatureRow
                  icon={<WandSparkles className="w-4 h-4" />}
                  title="Prompt Sablonok"
                  description="5 beépített sablon: Make responsive, Add hover effect, Dark mode, Add animation, Glassmorphism. Egy kattintással betölthető."
                />
                <FeatureRow
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Modell Választó"
                  description="Dropdown a támogatott AI modellek közötti váltásra. A választott modell neve megjelenik a gombban."
                />
                <FeatureRow
                  icon={<Send className="w-4 h-4" />}
                  title="SSE Streaming"
                  description="Server-Sent Events a valós idejű válasz megjelenítéshez. A UI 3 eventenként frissül a túlzott re-renderek elkerülésére."
                />
                <FeatureRow
                  icon={<Shield className="w-4 h-4" />}
                  title="Hibakezelés"
                  description="Rate limit (429), auth hiba (401), és általános hiba kezelés toast értesítésekkel. AbortController a kérés megszakításához."
                />
              </div>

              <CodeBlock title="AI System Prompt" language="text">
{`You are a Tailwind CSS expert assistant.

Current element state:
- Element tag: h2
- Current Tailwind classes: px-2 pb-3 text-[18px] font-semibold
- Text content: Layers

Respond with ONLY valid JSON:
{
  "tailwindClasses": "updated classes...",
  "textContent": "updated text (only if changed)"
}`}
              </CodeBlock>

              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">Elérhető gombok a prompt területen</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { icon: <WandSparkles className="w-3 h-3" />, label: 'Prompt Builder', status: 'active' },
                    { icon: <Sparkles className="w-3 h-3" />, label: 'Model Selector', status: 'active' },
                    { icon: <Paperclip className="w-3 h-3" />, label: 'Attach Files', status: 'soon' },
                    { icon: <Figma className="w-3 h-3" />, label: 'Figma Import', status: 'soon' },
                  ].map((btn) => (
                    <div key={btn.label} className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                      btn.status === 'active'
                        ? 'border-primary/30 bg-primary/5 text-foreground'
                        : 'border-border bg-secondary/30 text-muted-foreground opacity-60'
                    }`}>
                      {btn.icon}
                      <span>{btn.label}</span>
                      {btn.status === 'soon' && (
                        <span className="text-[8px] bg-secondary px-1 rounded">Soon</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DocSection>

          {/* ───────────────── CODE TAB ───────────────── */}
          <DocSection
            id="code-tab"
            icon={<Code2 className="w-5 h-5" />}
            title="CODE Tab — Monaco Editor"
            subtitle="Teljes Monaco Editor integráció kétirányú szinkronizálással"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FeatureRow
                  icon={<Code2 className="w-4 h-4" />}
                  title="Monaco Editor"
                  description="VS Code-szintű szerkesztő HTML nyelvi módban. Word wrap, auto layout, 12px font, rejtett minimap és scrollbar."
                />
                <FeatureRow
                  icon={<RotateCcw className="w-4 h-4" />}
                  title="Two-way Binding"
                  description="A vizuális szerkesztés frissíti a kódot; a kód szerkesztése (Apply) frissíti a vizuális állapotot. Regex-szel kinyeri a class és text content értékeket."
                />
                <FeatureRow
                  icon={<Copy className="w-4 h-4" />}
                  title="Copy & Reset"
                  description="Copy gomb a kód vágólapra másolásához (zöld pipa visszajelzéssel). Reset gomb az utolsó generált állapotra való visszaállításhoz."
                />
                <FeatureRow
                  icon={<Eye className="w-4 h-4" />}
                  title="Dark Mode Detect"
                  description="MutationObserver figyeli a html.dark osztályt és automatikusan vált vs-dark / vs-light téma között."
                />
              </div>

              <CodeBlock title="Kód kinyerés logika" language="TypeScript">
{`// Tailwind classok kinyerése a szerkesztett kódból
const extractClassesFromCode = (code: string): string | null => {
  const classMatch = code.match(/class="([^"]*)"/);
  return classMatch ? classMatch[1] : null;
};

// Szövegtartalom kinyerése
const extractTextFromCode = (code: string): string | null => {
  const textMatch = code.match(/>([^<]+)<\\//);
  return textMatch ? textMatch[1].trim() : null;
};`}
              </CodeBlock>

              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <h4 className="text-xs font-semibold text-foreground mb-2">Generált kód példa</h4>
                <CodeBlock title="Output" language="HTML">
{`<!-- Link nélkül -->
<h2 class="px-2 pb-3 text-[18px] font-semibold tracking-tight">Layers</h2>

<!-- Linkkel -->
<a href="/page">
  <h2 class="px-2 pb-3 text-[18px] font-semibold tracking-tight">Layers</h2>
</a>`}
                </CodeBlock>
              </div>
            </div>
          </DocSection>

          {/* ───────────────── COMPONENTS ───────────────── */}
          <DocSection
            id="components"
            icon={<Box className="w-5 h-5" />}
            title="Újrafelhasználható Komponensek"
            subtitle="A shared components könyvtár részletes leírása"
          >
            <div className="space-y-4">
              <Accordion type="multiple" className="space-y-2">
                <AccordionItem value="colorpicker" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      ColorPicker — HEX szín választó
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Popover-alapú színválasztó <code className="bg-secondary px-1 rounded">react-colorful</code> HexColorPicker-rel. 
                      8 preset szín, HEX input mező, Clear és Done gombok.
                    </p>
                    <CodeBlock title="Használat" language="TSX">
{`<ColorPicker
  color={state.border.color}
  onChange={(v) => updateNestedState('border', 'color', v)}
  label="Color"
/>`}
                    </CodeBlock>
                    <div className="text-xs text-muted-foreground">
                      <strong>Props:</strong> color (string), onChange (callback), label (opcionális)
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="gradientpicker" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary" />
                      GradientColorPicker — Solid + Gradiens
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Kettős módú színválasztó: <strong>Solid</strong> (egyszerű HEX) és <strong>Gradient</strong> (linear/radial). 
                      A gradiens módban tetszőleges számú stop adható hozzá, szöge szabályozható, és élő előnézet látható.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-secondary/30 p-2 rounded-lg">
                        <strong className="text-foreground">Linear Gradient</strong>
                        <p className="text-muted-foreground">0–360° szög, N stop, pozíció %-ban</p>
                      </div>
                      <div className="bg-secondary/30 p-2 rounded-lg">
                        <strong className="text-foreground">Radial Gradient</strong>
                        <p className="text-muted-foreground">Kör alakú, N stop, pozíció %-ban</p>
                      </div>
                    </div>
                    <CodeBlock title="GradientValue interfész" language="TypeScript">
{`interface GradientValue {
  type: 'solid' | 'linear' | 'radial';
  angle: number;          // 0-360 (linear only)
  stops: GradientStop[];  // min. 2 stop
}

interface GradientStop {
  color: string;    // HEX szín
  position: number; // 0-100%
}`}
                    </CodeBlock>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="slider" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-primary" />
                      Slider — Numerikus csúszka
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Range input vizuális fill-el (primary szín a bal oldalon). ARIA attribútumokkal, 
                      ikon + label + érték megjelenítéssel. Opcionális <code className="bg-secondary px-1 rounded">valueLabel</code> override.
                    </p>
                    <CodeBlock title="Használat" language="TSX">
{`<Slider
  icon={<Eye className="w-2.5 h-2.5" />}
  label="Opacity"
  value={state.opacity}
  onChange={(v) => updateState('opacity', v)}
  min={0}
  max={100}
  unit="%"
/>`}
                    </CodeBlock>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="iconinput" className="border border-border rounded-xl overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      IconInput & LabeledInput
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>IconInput:</strong> Input mező bal oldali ikonnal (pl. szélesség/magasság).<br />
                      <strong>LabeledInput:</strong> Input mező bal oldali betűcímkével (L, T, R, B). 
                      Az üres állapotban halványított címke jelzi a kitöltetlenséget.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DocSection>

          {/* ───────────────── CANVAS ───────────────── */}
          <DocSection
            id="canvas"
            icon={<Eye className="w-5 h-5" />}
            title="Canvas — Élő Előnézet"
            subtitle="Valós idejű renderelés computed stílusokkal"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                A Canvas komponens az <code className="bg-secondary px-1 rounded">InspectorState</code>-ből számított inline stílusokat 
                alkalmazza egy dinamikus HTML elemre. Minden állapotváltozás azonnal láthatóvá válik.
              </p>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Támogatott stílus konverziók</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { prop: 'Padding/Margin', conv: 'Tailwind → rem (×0.25)' },
                    { prop: 'Typography', conv: 'fontSize(px), fontWeight, letterSpacing map, lineHeight map' },
                    { prop: 'Background', conv: 'Solid color VAGY linear-gradient/radial-gradient' },
                    { prop: 'Border', conv: 'width + color → shorthand; radius → borderRadius' },
                    { prop: 'Opacity', conv: '0-100 → 0-1 decimális' },
                    { prop: '2D Transform', conv: 'translate, rotate, scale, skew → transform string' },
                    { prop: '3D Transform', conv: 'rotateX/Y/Z → transform; perspective → stílus' },
                    { prop: 'Filters', conv: 'blur, backdrop-blur → filter string' },
                  ].map((item) => (
                    <div key={item.prop} className="bg-secondary/20 border border-border/50 rounded-lg p-2 text-xs">
                      <span className="font-medium text-foreground">{item.prop}:</span>{' '}
                      <span className="text-muted-foreground">{item.conv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CodeBlock title="Dinamikus tag renderelés" language="TSX">
{`const Tag = (state.elementTag as keyof JSX.IntrinsicElements) || 'div';

return (
  <div style={{ perspective: '1200px' }}>
    <Tag style={elementStyle} className="text-foreground">
      {state.textContent || 'Preview'}
    </Tag>
  </div>
);`}
              </CodeBlock>
            </div>
          </DocSection>

          {/* ───────────────── PERFORMANCE ───────────────── */}
          <DocSection
            id="performance"
            icon={<Zap className="w-5 h-5" />}
            title="Teljesítmény Optimalizáció"
            subtitle="Re-render minimalizáció és memorizáció stratégiák"
          >
            <div className="space-y-3">
              {[
                {
                  icon: <Clock className="w-4 h-4" />,
                  title: 'Debounced Inputs (100ms)',
                  description: 'A szöveges input mezők (link, text content) 100ms debounce-szal frissítik a globális állapotot, elkerülve a karakterenkénti re-rendert.',
                },
                {
                  icon: <Database className="w-4 h-4" />,
                  title: 'localStorage Debounce (300ms)',
                  description: 'A localStorage mentés 300ms-os debounce-szal történik, minimalizálva a szinkron I/O műveleteket.',
                },
                {
                  icon: <Cpu className="w-4 h-4" />,
                  title: 'useMemo — Generált értékek',
                  description: 'A generatedTailwind, generatedCode és canUndo értékek useMemo-val cachelődnek, csak a releváns state változásakor számítódnak újra.',
                },
                {
                  icon: <Shield className="w-4 h-4" />,
                  title: 'useCallback — Stabil referenciák',
                  description: 'Minden handler (updateState, updateNestedState, undo, resetState) useCallback-kal stabilizált, megakadályozva a felesleges child re-rendereket.',
                },
                {
                  icon: <Layers className="w-4 h-4" />,
                  title: 'React.memo — TabButton',
                  description: 'A tab gombok React.memo wrapper-rel vannak ellátva, így csak a saját props változásakor renderelődnek újra.',
                },
                {
                  icon: <Sparkles className="w-4 h-4" />,
                  title: 'SSE Throttle (3 eventenként)',
                  description: 'A streaming AI válasz UI-ja csak minden 3. SSE eseménynél vagy 50+ karakteres chunk esetén frissül.',
                },
              ].map((opt) => (
                <FeatureRow key={opt.title} icon={opt.icon} title={opt.title} description={opt.description} />
              ))}
            </div>
          </DocSection>

          {/* ───────────────── API REFERENCE ───────────────── */}
          <DocSection
            id="api"
            icon={<Cpu className="w-5 h-5" />}
            title="API Referencia"
            subtitle="Exportált komponensek, hookok és típusok"
          >
            <div className="space-y-4">
              <CodeBlock title="Importálás" language="TypeScript">
{`// Fő komponens
import PropertyInspector from '@/components/PropertyInspector';
import { InspectorProvider } from '@/components/PropertyInspector';

// Canvas előnézet
import { Canvas } from '@/components/PropertyInspector/components/Canvas';

// Context hook (child komponensekből)
import { useInspector } from '@/components/PropertyInspector/InspectorContext';

// Típusok
import type { InspectorState } from '@/components/PropertyInspector/InspectorContext';
import type { GradientValue, GradientStop } from '@/components/PropertyInspector/components/GradientColorPicker';`}
              </CodeBlock>

              <CodeBlock title="useInspector() hook API" language="TypeScript">
{`const {
  state,              // InspectorState — aktuális állapot
  updateState,        // (key, value) — top-level mező frissítés
  updateNestedState,  // (key, nestedKey, value) — beágyazott mező
  generatedCode,      // string — HTML/JSX output
  generatedTailwind,  // string — Tailwind class string
  resetState,         // () — alapértékek visszaállítása
  history,            // InspectorState[] — undo history
  undo,               // () — utolsó állapot visszaállítása
  canUndo,            // boolean — van-e undo lehetőség
} = useInspector();`}
              </CodeBlock>

              <CodeBlock title="Használati minta" language="TSX">
{`import { PropertyInspector, InspectorProvider } from '@/components/PropertyInspector';
import { Canvas } from '@/components/PropertyInspector/components/Canvas';

const MyEditor = () => (
  <InspectorProvider>
    <div className="flex gap-8">
      <Canvas className="flex-1" />
      <PropertyInspector onClose={() => console.log('closed')} />
    </div>
  </InspectorProvider>
);`}
              </CodeBlock>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-primary mb-2">📋 PropertyInspector Props</h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-2">Prop</th>
                      <th className="pb-2">Típus</th>
                      <th className="pb-2">Leírás</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    <tr className="border-t border-border/50">
                      <td className="py-2 font-mono">onClose</td>
                      <td className="py-2 text-muted-foreground">() =&gt; void</td>
                      <td className="py-2 text-muted-foreground">Opcionális bezáró callback; ha megadva, X gomb jelenik meg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </DocSection>

          {/* Footer */}
          <div className="border-t border-border pt-6 pb-12 text-center">
            <p className="text-xs text-muted-foreground">
              PropertyInspector Dokumentáció v2.0 — Készült React 18 + TypeScript + Tailwind CSS alapokon
            </p>
            <Link to="/" className="inline-flex items-center gap-2 mt-3 text-xs text-primary hover:underline">
              <ArrowLeft className="w-3 h-3" />
              Vissza az editorhoz
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
