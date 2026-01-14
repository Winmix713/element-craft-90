import { PropertyInspector } from "@/components/PropertyInspector";
import { DesignCanvas } from "@/components/DesignCanvas";
import { InspectorProvider } from "@/components/PropertyInspector/InspectorContext";

const Index = () => {
  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] relative overflow-hidden">
        {/* Design Canvas - Main workspace */}
        <DesignCanvas />
        
        {/* Property Inspector - Floating panel */}
        <PropertyInspector />
      </div>
    </InspectorProvider>
  );
};

export default Index;
