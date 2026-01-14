import React, { useMemo } from 'react';
import { useInspector } from '../InspectorContext';

interface CanvasProps {
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ className = '' }) => {
  const { state } = useInspector();

  const elementStyle = useMemo(() => {
    const style: React.CSSProperties = {};

    // Size
    if (state.size.width) style.width = `${state.size.width}px`;
    if (state.size.height) style.height = `${state.size.height}px`;
    if (state.size.maxWidth) style.maxWidth = `${state.size.maxWidth}px`;
    if (state.size.maxHeight) style.maxHeight = `${state.size.maxHeight}px`;

    // Padding
    const paddingLeft = state.padding.left ? `${parseFloat(state.padding.left) * 0.25}rem` : '0';
    const paddingTop = state.padding.top ? `${parseFloat(state.padding.top) * 0.25}rem` : '0';
    const paddingRight = state.padding.right ? `${parseFloat(state.padding.right) * 0.25}rem` : '0';
    const paddingBottom = state.padding.bottom ? `${parseFloat(state.padding.bottom) * 0.25}rem` : '0';
    style.padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;

    // Margin
    const marginLeft = state.margin.left ? `${parseFloat(state.margin.left) * 0.25}rem` : '0';
    const marginTop = state.margin.top ? `${parseFloat(state.margin.top) * 0.25}rem` : '0';
    const marginRight = state.margin.right ? `${parseFloat(state.margin.right) * 0.25}rem` : '0';
    const marginBottom = state.margin.bottom ? `${parseFloat(state.margin.bottom) * 0.25}rem` : '0';
    style.margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;

    // Typography
    if (state.typography.fontSize) style.fontSize = `${state.typography.fontSize}px`;
    if (state.typography.fontWeight) style.fontWeight = state.typography.fontWeight as any;
    if (state.typography.letterSpacing) {
      const letterSpacingMap: Record<string, string> = {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      };
      style.letterSpacing = letterSpacingMap[state.typography.letterSpacing] || '0';
    }
    if (state.typography.lineHeight) {
      const lineHeightMap: Record<string, string> = {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      };
      style.lineHeight = lineHeightMap[state.typography.lineHeight] || '1.5';
    }
    if (state.typography.textAlign) style.textAlign = state.typography.textAlign as any;

    // Background
    if (typeof state.background.color === 'string' && state.background.color) {
      style.backgroundColor = state.background.color;
    } else if (typeof state.background.color === 'object' && state.background.color !== null) {
      const gradient = state.background.color as any;
      if (gradient.type === 'linear') {
        const stops = gradient.stops
          .sort((a: any, b: any) => a.position - b.position)
          .map((stop: any) => `${stop.color} ${stop.position}%`)
          .join(', ');
        style.backgroundImage = `linear-gradient(${gradient.angle}deg, ${stops})`;
      } else if (gradient.type === 'radial') {
        const stops = gradient.stops
          .sort((a: any, b: any) => a.position - b.position)
          .map((stop: any) => `${stop.color} ${stop.position}%`)
          .join(', ');
        style.backgroundImage = `radial-gradient(circle, ${stops})`;
      }
    }

    // Border
    if (state.border.radius) style.borderRadius = `${state.border.radius}px`;
    if (state.border.width && state.border.color) {
      style.border = `${state.border.width}px solid ${state.border.color}`;
    } else if (state.border.width) {
      style.borderWidth = `${state.border.width}px`;
    } else if (state.border.color) {
      style.borderColor = state.border.color;
    }

    // Opacity
    style.opacity = state.opacity / 100;

    // Transforms
    const transforms: string[] = [];
    if (state.transforms.translateX !== 0) transforms.push(`translateX(${state.transforms.translateX}px)`);
    if (state.transforms.translateY !== 0) transforms.push(`translateY(${state.transforms.translateY}px)`);
    if (state.transforms.rotate !== 0) transforms.push(`rotate(${state.transforms.rotate}deg)`);
    if (state.transforms.scale !== 100) transforms.push(`scale(${(state.transforms.scale / 100).toFixed(2)})`);
    if (state.transforms.skewX !== 0) transforms.push(`skewX(${state.transforms.skewX}deg)`);
    if (state.transforms.skewY !== 0) transforms.push(`skewY(${state.transforms.skewY}deg)`);

    // 3D Transforms
    if (state.transforms3d.rotateX !== 0) transforms.push(`rotateX(${state.transforms3d.rotateX}deg)`);
    if (state.transforms3d.rotateY !== 0) transforms.push(`rotateY(${state.transforms3d.rotateY}deg)`);
    if (state.transforms3d.rotateZ !== 0) transforms.push(`rotateZ(${state.transforms3d.rotateZ}deg)`);

    if (transforms.length > 0) {
      style.transform = transforms.join(' ');
    }

    // Perspective
    if (state.transforms3d.perspective > 0) {
      style.perspective = `${state.transforms3d.perspective * 100}px`;
    }

    // Blur effects
    const filters: string[] = [];
    if (state.blur && state.blur > 0) filters.push(`blur(${state.blur}px)`);
    if (state.backdropBlur && state.backdropBlur > 0) filters.push(`backdrop-blur(${state.backdropBlur}px)`);
    if (filters.length > 0) {
      style.filter = filters.join(' ');
    }

    return style;
  }, [state]);

  const Tag = (state.elementTag as keyof JSX.IntrinsicElements) || 'div';

  return (
    <div
      className={`flex items-center justify-center min-h-64 rounded-lg border border-border bg-gradient-to-b from-secondary/30 to-background p-8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 100%)',
      }}
    >
      <div style={{ perspective: '1200px' }}>
        <Tag style={elementStyle} className="text-foreground">
          {state.textContent || 'Preview'}
        </Tag>
      </div>
    </div>
  );
};
