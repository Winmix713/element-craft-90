import { PropertyInspector } from "@/components/PropertyInspector";

const Index = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-center">
      <PropertyInspector />
    </div>
  );
};

export default Index;
