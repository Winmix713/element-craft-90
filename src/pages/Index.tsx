import React from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ElementProvider, useElement } from "@/contexts/ElementContext";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { PropertyInspector } from "@/components/PropertyInspector";
import { BlackTabs } from "@/components/BlackTabs";

// --- Main Workspace Area ---
const Workspace = () => {
  const { deselectElement } = useElement();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950/50">
      {/* Canvas Area */}
      <div 
        className="flex-1 overflow-auto p-16 flex items-center justify-center relative"
        onClick={() => deselectElement()}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        <div className="w-[800px] min-h-[600px] bg-background border border-border rounded-xl shadow-sm p-8 relative transition-colors duration-500 flex flex-col items-center justify-center gap-8">
          
          {/* Demo BlackTabs components */}
          <BlackTabs 
            id="tabs-main"
            tabs={[
              { label: 'Overview', value: 'overview' },
              { label: 'Settings', value: 'settings' },
              { label: 'Analytics', value: 'analytics' }
            ]}
            defaultValue="overview"
          />
          
          <BlackTabs 
            id="tabs-secondary"
            tabs={[
              { label: 'Layers', value: 'layers' },
              { label: 'Components', value: 'components' }
            ]}
            defaultValue="layers"
          />

          <BlackTabs 
            id="tabs-actions"
            tabs={[
              { label: 'Edit', value: 'edit' },
              { label: 'Preview', value: 'preview' },
              { label: 'Export', value: 'export' },
              { label: 'Share', value: 'share' }
            ]}
            defaultValue="edit"
          />

        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <ElementProvider>
        <div className="flex h-screen w-full overflow-hidden text-foreground bg-background">
          <ThemeCustomizer />
          <Workspace />
          <PropertyInspector />
        </div>
      </ElementProvider>
    </ThemeProvider>
  );
};

export default Index;
