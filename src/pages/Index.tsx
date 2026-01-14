import { PropertyInspector } from "@/components/PropertyInspector";

const Index = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-center overflow-hidden relative">
      <div className="absolute top-4 left-4 text-white text-sm">Inspector Loading...</div>
      <PropertyInspector />
    </div>
  );
};

export default Index;
