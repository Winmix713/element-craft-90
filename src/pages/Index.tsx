import { PropertyInspector } from "@/components/PropertyInspector";
import { CodePreviewProvider } from "@/contexts/CodePreviewContext";

const Index = () => {
  return (
    <CodePreviewProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-center relative overflow-hidden">
        <PropertyInspector />
      </div>
    </CodePreviewProvider>
  );
};

export default Index;
