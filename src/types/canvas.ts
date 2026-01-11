export interface CanvasElement {
  id: string;
  type: 'button' | 'text' | 'div';
  content: string;
  className: string;
  position: { x: number; y: number };
  selected: boolean;
}
