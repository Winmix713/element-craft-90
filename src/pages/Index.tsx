import { PropertyInspector } from "@/components/PropertyInspector";
import { Canvas } from "@/components/PropertyInspector/components/Canvas";
import { InspectorProvider } from "@/components/PropertyInspector/InspectorContext";

const Index = () => {
  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-between gap-8">
        {/* Canvas Preview - Left Side */}
        <div className="flex-1 flex items-center justify-center">
          <Canvas className="w-full max-w-2xl" />
        </div>

        {/* Inspector Panel - Right Side */}
        <PropertyInspector />
      </div>
    </InspectorProvider>
  );
};

export default Index;
