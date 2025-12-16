import { PropertyInspector } from "@/components/PropertyInspector";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-center gap-6">
        <ThemeCustomizer />
        <PropertyInspector />
      </div>
    </ThemeProvider>
  );
};

export default Index;
