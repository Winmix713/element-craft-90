import { PropertyInspector } from "@/components/PropertyInspector";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-center overflow-hidden">
        <PropertyInspector />
      </div>
      <Toaster />
    </>
  );
};

export default Index;
