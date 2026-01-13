import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface PropertySectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  value: string;
}

export const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  value,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? value : undefined}>
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="py-2 hover:no-underline">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Simple version without accordion for inline use
export const PropertySectionSimple: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-medium text-muted-foreground">{title}</label>
      {icon && (
        <button className="text-muted-foreground hover:text-foreground rounded-full p-1">
          {icon}
        </button>
      )}
    </div>
    {children}
  </div>
);
