export enum Unit {
  MM = 'mm',
  CM = 'cm',
  INCH = 'in'
}

export interface CoverDimensions {
  boardWidth: number;
  boardHeight: number;
  spineWidth: number;
  hingeGap: number; // The space between board and spine (approx 5-7mm usually)
  turnIn: number;   // The wrap around material (usually 15-20mm)
  bleed: number;    // Extra print margin (usually 3-5mm)
  unit: Unit;
}

export interface CalculatedSpecs {
  totalWidth: number;
  totalHeight: number;
  spineStart: number;
  spineEnd: number;
  frontBoardStart: number;
  backBoardEnd: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}