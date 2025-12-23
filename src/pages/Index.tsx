import { PropertyInspector } from "@/components/PropertyInspector";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ElementProvider, useElement } from "@/contexts/ElementContext";
import { BlackTabs } from "@/components/BlackTabs";

const EditorCanvas = () => {
  const { deselectElement } = useElement();

  const handleCanvasClick = () => {
    deselectElement();
  };

  return (
    <div 
      onClick={handleCanvasClick}
      className="flex-1 flex flex-col items-center justify-center gap-8 p-8"
    >
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">Kattints egy elemre a szerkesztéshez</h2>
        <p className="text-sm text-muted-foreground">Az Inspector panelen beállíthatod a kiválasztott elem összes tulajdonságát</p>
      </div>

      {/* Fekete Tab komponensek */}
      <div className="flex flex-col gap-6 items-center">
        <BlackTabs 
          id="main-tabs"
          tabs={[
            { label: 'Dashboard', value: 'dashboard' },
            { label: 'Analytics', value: 'analytics' },
            { label: 'Settings', value: 'settings' },
          ]}
          defaultValue="dashboard"
        />

        <BlackTabs 
          id="secondary-tabs"
          tabs={[
            { label: 'Overview', value: 'overview' },
            { label: 'Details', value: 'details' },
          ]}
          defaultValue="overview"
        />

        <BlackTabs 
          id="filter-tabs"
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Completed', value: 'completed' },
            { label: 'Archived', value: 'archived' },
          ]}
          defaultValue="all"
        />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <ElementProvider>
        <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] flex">
          {/* Left Panel - Theme Customizer */}
          <div className="p-4">
            <ThemeCustomizer />
          </div>

          {/* Center - Canvas with editable elements */}
          <EditorCanvas />

          {/* Right Panel - Property Inspector */}
          <div className="p-4">
            <PropertyInspector />
          </div>
        </div>
      </ElementProvider>
    </ThemeProvider>
  );
};

export default Index;
