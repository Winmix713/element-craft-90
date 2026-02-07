import { PropertyInspector, InspectorProvider } from "@/components/PropertyInspector";
import { Canvas } from "@/components/PropertyInspector/components/Canvas";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[hsl(var(--editor-bg))] bg-[image:var(--gradient-editor)] p-8 flex items-center justify-between gap-8 relative">
        {/* Docs Link */}
        <Link to="/docs" className="absolute top-4 left-4 z-50">
          <Button variant="outline" size="sm" className="gap-2 text-xs bg-card/80 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5" />
            Dokumentáció
          </Button>
        </Link>

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
