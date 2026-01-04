import { PropertyInspector } from "@/components/PropertyInspector";
import { PreviewBox } from "@/components/PropertyInspector/PreviewBox";
import { useInspectorState, useGeneratedClasses, useGeneratedStyles } from "@/components/PropertyInspector/hooks";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-6 md:p-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground/90 mb-2">
            Visual Editor
          </h1>
          <p className="text-sm text-muted-foreground/70">
            CSS & Tailwind Property Inspector
          </p>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 max-w-7xl mx-auto">
          {/* Theme Customizer */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <ThemeCustomizer />
          </div>
          
          {/* Property Inspector */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <PropertyInspector />
          </div>
          
          {/* Preview Panel */}
          <PreviewPanel />
        </div>
      </div>
    </ThemeProvider>
  );
};

// Separate Preview Panel component
const PreviewPanel = () => {
  const { state } = useInspectorState({
    textContent: 'Preview Element',
    tag: 'div'
  });
  const generatedClasses = useGeneratedClasses(state);
  const generatedStyles = useGeneratedStyles(state);
  
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-panel)] overflow-hidden">
        <div className="border-b border-border py-2 px-4 bg-secondary/50">
          <h3 className="text-xs uppercase font-bold text-primary">Előnézet</h3>
        </div>
        <div className="p-4">
          <PreviewBox 
            state={state}
            generatedClasses={generatedClasses}
            generatedStyles={generatedStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
