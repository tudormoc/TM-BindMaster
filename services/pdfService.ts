import jsPDF from 'jspdf';
import { CoverDimensions, CalculatedSpecs, Unit } from '../types';

export const generateCoverPDF = (dimensions: CoverDimensions, specs: CalculatedSpecs) => {
  const { unit, turnIn, hingeGap, spineWidth, boardWidth, boardHeight, bleed } = dimensions;

  // Calculate final PDF page size (Trim Size + Bleed * 2)
  const pageWidth = specs.totalWidth + (bleed * 2);
  const pageHeight = specs.totalHeight + (bleed * 2);

  // Initialize jsPDF
  const doc = new jsPDF({
    orientation: pageWidth > pageHeight ? 'landscape' : 'portrait',
    unit: dimensions.unit,
    format: [pageWidth, pageHeight]
  });

  // Base configuration
  // We shift the origin (0,0) to be the top-left of the TRIM BOX relative to the page.
  const originX = bleed;
  const originY = bleed;

  doc.setLineWidth(unit === Unit.MM ? 0.1 : 0.005);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  // Helper to translate coordinates to account for bleed offset
  const tX = (x: number) => originX + x;
  const tY = (y: number) => originY + y;

  // Draw Cut Line (Solid Black) - representing the Trim Box
  doc.setDrawColor(0, 0, 0);
  doc.rect(tX(0), tY(0), specs.totalWidth, specs.totalHeight);

  // Helper to draw a guide line (Cyan dashed)
  const drawGuideLine = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setDrawColor(0, 255, 255); // Cyan
    doc.setLineDashPattern([1, 1], 0); // Dashed
    doc.line(tX(x1), tY(y1), tX(x2), tY(y2));
    doc.setLineDashPattern([], 0); // Reset
  };

  // Helper to draw a fold line (Magenta dashed)
  const drawFoldLine = (x: number) => {
    doc.setDrawColor(255, 0, 255); // Magenta
    doc.setLineDashPattern([2, 1], 0);
    doc.line(tX(x), tY(0), tX(x), tY(specs.totalHeight));
    doc.setLineDashPattern([], 0);
  };

  // Helper to draw Registration Mark (Small Circle with crosshair)
  const drawRegMark = (cx: number, cy: number) => {
    const r = unit === Unit.MM ? 1.0 : 0.04;
    const l = unit === Unit.MM ? 2.5 : 0.1;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(unit === Unit.MM ? 0.05 : 0.002);

    // Circle
    doc.circle(cx, cy, r);

    // Crosshair
    doc.line(cx - l, cy, cx + l, cy);
    doc.line(cx, cy - l, cx, cy + l);
  };

  // Helper to draw Tick Mark in Bleed
  const drawBleedTick = (x: number) => {
    const tickLen = bleed * 0.8;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(unit === Unit.MM ? 0.1 : 0.005);
    doc.line(tX(x), 0, tX(x), tickLen);
    doc.line(tX(x), pageHeight, tX(x), pageHeight - tickLen);
  };

  // --- Drawing ---

  // 1. Horizontal Safe Guides (Turn-ins)
  drawGuideLine(0, turnIn, specs.totalWidth, turnIn);
  drawGuideLine(0, specs.totalHeight - turnIn, specs.totalWidth, specs.totalHeight - turnIn);

  // 2. Vertical Sections & Fold Lines
  const backBoardX = turnIn;
  drawGuideLine(backBoardX, turnIn, backBoardX, specs.totalHeight - turnIn);

  const hinge1X = backBoardX + boardWidth;
  drawGuideLine(hinge1X, turnIn, hinge1X, specs.totalHeight - turnIn);
  drawFoldLine(hinge1X);

  const spineX = hinge1X + hingeGap;
  drawGuideLine(spineX, turnIn, spineX, specs.totalHeight - turnIn);
  drawFoldLine(spineX);

  const hinge2X = spineX + spineWidth;
  drawGuideLine(hinge2X, turnIn, hinge2X, specs.totalHeight - turnIn);
  drawFoldLine(hinge2X);

  const frontBoardX = hinge2X + hingeGap;
  drawGuideLine(frontBoardX, turnIn, frontBoardX, specs.totalHeight - turnIn);
  drawFoldLine(frontBoardX);

  const rightTurnInX = frontBoardX + boardWidth;
  drawGuideLine(rightTurnInX, turnIn, rightTurnInX, specs.totalHeight - turnIn);

  // 3. Bleed Elements
  if (bleed > 0) {
    // A. Registration Marks
    drawRegMark(tX(specs.totalWidth / 2), originY / 2);
    drawRegMark(originX / 2, tY(specs.totalHeight / 2));
    drawRegMark(tX(specs.totalWidth) + (bleed / 2), tY(specs.totalHeight / 2));
    drawRegMark(tX(specs.totalWidth / 2), tY(specs.totalHeight) + (bleed / 2));

    // B. Crop Marks (At the corners)
    const cmLen = unit === Unit.MM ? 3 : 0.125;
    const offset = unit === Unit.MM ? 1 : 0.04;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(unit === Unit.MM ? 0.1 : 0.005);

    // Top Left
    doc.line(tX(0) - offset - cmLen, tY(0), tX(0) - offset, tY(0));
    doc.line(tX(0), tY(0) - offset - cmLen, tX(0), tY(0) - offset);

    // Top Right
    doc.line(tX(specs.totalWidth) + offset, tY(0), tX(specs.totalWidth) + offset + cmLen, tY(0));
    doc.line(tX(specs.totalWidth), tY(0) - offset - cmLen, tX(specs.totalWidth), tY(0) - offset);

    // Bottom Left
    doc.line(tX(0) - offset - cmLen, tY(specs.totalHeight), tX(0) - offset, tY(specs.totalHeight));
    doc.line(tX(0), tY(specs.totalHeight) + offset, tX(0), tY(specs.totalHeight) + offset + cmLen);

    // Bottom Right
    doc.line(tX(specs.totalWidth) + offset, tY(specs.totalHeight), tX(specs.totalWidth) + offset + cmLen, tY(specs.totalHeight));
    doc.line(tX(specs.totalWidth), tY(specs.totalHeight) + offset, tX(specs.totalWidth), tY(specs.totalHeight) + offset + cmLen);

    // C. Spine & Hinge Guide Ticks
    drawBleedTick(hinge1X);
    drawBleedTick(spineX);
    drawBleedTick(hinge2X);
    drawBleedTick(frontBoardX);
  }

  // Save
  doc.save(`cover_template_${specs.totalWidth.toFixed(1)}x${specs.totalHeight.toFixed(1)}${unit}.pdf`);
};

/**
 * Generates an A4 Landscape blueprint PDF with schematic dimensions.
 */
export const generateBlueprintPDF = (dimensions: CoverDimensions, specs: CalculatedSpecs) => {
  const { unit, turnIn, hingeGap, spineWidth, boardWidth, boardHeight } = dimensions;

  // A4 Landscape Dimensions in MM
  const A4_WIDTH = 297;
  const A4_HEIGHT = 210;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Fonts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TM BindMaster 3D - Prepress Blueprint", 10, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 22);

  // --- Specifications Table (Left side) ---
  const startY = 40;
  const lineHeight = 7;
  doc.setFont("courier", "normal");
  doc.text(`Unit:        ${unit}`, 10, startY);
  doc.text(`Trim Width:  ${specs.totalWidth} ${unit}`, 10, startY + lineHeight);
  doc.text(`Trim Height: ${specs.totalHeight} ${unit}`, 10, startY + lineHeight * 2);
  doc.text(`Board Size:  ${boardWidth} x ${boardHeight} ${unit}`, 10, startY + lineHeight * 3);
  doc.text(`Spine Width: ${spineWidth} ${unit}`, 10, startY + lineHeight * 4);
  doc.text(`Hinge Gap:   ${hingeGap} ${unit}`, 10, startY + lineHeight * 5);
  doc.text(`Turn-in:     ${turnIn} ${unit}`, 10, startY + lineHeight * 6);
  doc.text(`Bleed:       ${dimensions.bleed} ${unit}`, 10, startY + lineHeight * 7);

  // --- Drawing the Schematic (Right Side / Center) ---
  const drawAreaX = 90; // Shifted right to avoid overlap
  const drawAreaY = 40;
  const drawAreaW = 180; // Reduced width slightly
  const drawAreaH = 130;

  // Calculate Scale to fit
  const scaleX = drawAreaW / specs.totalWidth;
  const scaleY = drawAreaH / specs.totalHeight;
  const scale = Math.min(scaleX, scaleY);

  // Centering offsets
  const scaledW = specs.totalWidth * scale;
  const scaledH = specs.totalHeight * scale;
  const offsetX = drawAreaX + (drawAreaW - scaledW) / 2;
  const offsetY = drawAreaY + (drawAreaH - scaledH) / 2;

  const s = (val: number) => val * scale;
  const tx = (x: number) => offsetX + s(x);
  const ty = (y: number) => offsetY + s(y);

  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);

  // Main Outline
  doc.rect(tx(0), ty(0), s(specs.totalWidth), s(specs.totalHeight));

  // Turn-in Lines (dashed)
  doc.setLineDashPattern([2, 2], 0);
  doc.setDrawColor(100, 100, 100);
  doc.line(tx(0), ty(turnIn), tx(specs.totalWidth), ty(turnIn));
  doc.line(tx(0), ty(specs.totalHeight - turnIn), tx(specs.totalWidth), ty(specs.totalHeight - turnIn));

  // Vertical Lines
  const x1 = turnIn; // Back Board Start
  const x2 = x1 + boardWidth; // Back Board End
  const x3 = x2 + hingeGap; // Spine Start
  const x4 = x3 + spineWidth; // Spine End
  const x5 = x4 + hingeGap; // Front Board Start
  const x6 = x5 + boardWidth; // Front Board End

  doc.line(tx(x1), ty(turnIn), tx(x1), ty(specs.totalHeight - turnIn));
  doc.line(tx(x2), ty(0), tx(x2), ty(specs.totalHeight)); // Hinge line
  doc.line(tx(x3), ty(0), tx(x3), ty(specs.totalHeight)); // Spine line
  doc.line(tx(x4), ty(0), tx(x4), ty(specs.totalHeight)); // Spine line
  doc.line(tx(x5), ty(0), tx(x5), ty(specs.totalHeight)); // Hinge line
  doc.line(tx(x6), ty(turnIn), tx(x6), ty(specs.totalHeight - turnIn));

  doc.setLineDashPattern([], 0);

  // Board Labels (Top area)
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const labelY = turnIn + (boardHeight * 0.2);
  const spineLabelY = specs.totalHeight / 2; // Centered vertically

  doc.text("BACK", tx(turnIn + boardWidth / 2), ty(labelY), { align: 'center' });
  doc.text("FRONT", tx(specs.frontBoardStart + boardWidth / 2), ty(labelY), { align: 'center' });
  // Manual offset to center text roughly (font size 8pt ~= 2.8mm height. Half ~= 1.4mm)
  // Shift right (+X) to center on the vertical spine line
  doc.text("SPINE", tx(specs.spineStart + spineWidth / 2) + 5.0, ty(spineLabelY), { align: 'center', angle: 90 });


  // --- Dimension Lines & Labels ---
  doc.setTextColor(50, 50, 50);

  // Horizontal Dimension Drawer
  const drawDimLine = (x_start: number, y: number, x_end: number, text: string, textAbove = false, extension = false) => {
    // Extension Lines
    if (extension) {
      doc.setDrawColor(150, 150, 150);
      doc.setLineDashPattern([1, 1], 0);
      // From bottom of cover to dimension line
      doc.line(tx(x_start), ty(specs.totalHeight), tx(x_start), ty(y));
      doc.line(tx(x_end), ty(specs.totalHeight), tx(x_end), ty(y));
      doc.setLineDashPattern([], 0);
      doc.setDrawColor(0, 0, 0);
    }

    doc.line(tx(x_start), ty(y), tx(x_end), ty(y));
    doc.line(tx(x_start), ty(y) - 1, tx(x_start), ty(y) + 1);
    doc.line(tx(x_end), ty(y) - 1, tx(x_end), ty(y) + 1);

    // Text Position
    const textY = textAbove ? ty(y) - 2 : ty(y) + 3;
    doc.text(text, tx((x_start + x_end) / 2), textY, { align: 'center' });
  };

  // Vertical Dimension Drawer
  const drawVertDimLine = (x: number, y_start: number, y_end: number, text: string, extension = false, extensionTargetX = 0) => {
    // Extension Lines
    if (extension) {
      doc.setDrawColor(150, 150, 150);
      doc.setLineDashPattern([1, 1], 0);
      // From target object X to dimension line X
      doc.line(tx(extensionTargetX), ty(y_start), tx(x), ty(y_start));
      doc.line(tx(extensionTargetX), ty(y_end), tx(x), ty(y_end));
      doc.setLineDashPattern([], 0);
      doc.setDrawColor(0, 0, 0);
    }

    doc.line(tx(x), ty(y_start), tx(x), ty(y_end));
    doc.line(tx(x) - 1, ty(y_start), tx(x) + 1, ty(y_start)); // tick
    doc.line(tx(x) - 1, ty(y_end), tx(x) + 1, ty(y_end)); // tick

    // Text Position (Rotated and centered on line)
    const midY = (y_start + y_end) / 2;
    doc.text(text, tx(x), ty(midY), { align: 'center', angle: 90 });
  };

  // Dimensions Bottom - SINGLE CHAIN LINE
  const dimLevel1 = specs.totalHeight + (specs.totalHeight * 0.08);

  // Bottom Chain with Text Above + Extensions
  drawDimLine(0, dimLevel1, turnIn, `${turnIn}`, true, true);
  drawDimLine(x1, dimLevel1, x2, `${boardWidth}`, true, true);

  drawDimLine(x2, dimLevel1, x3, `${hingeGap}`, true, true);
  drawDimLine(x3, dimLevel1, x4, `${spineWidth}`, true, true);
  drawDimLine(x4, dimLevel1, x5, `${hingeGap}`, true, true);

  drawDimLine(x5, dimLevel1, x6, `${boardWidth}`, true, true);
  drawDimLine(x6, dimLevel1, specs.totalWidth, `${turnIn}`, true, true);

  // Vertical Dimensions - RIGHT SIDE CHAIN
  const rightDimX = specs.totalWidth + (specs.totalWidth * 0.08);

  // Top Turn-in
  drawVertDimLine(rightDimX, 0, turnIn, `${turnIn}`, true, specs.totalWidth);
  // Board Height
  drawVertDimLine(rightDimX, turnIn, specs.totalHeight - turnIn, `${boardHeight}`, true, specs.totalWidth);
  // Bottom Turn-in
  drawVertDimLine(rightDimX, specs.totalHeight - turnIn, specs.totalHeight, `${turnIn}`, true, specs.totalWidth);

  // Overall Dimensions
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  // Top Total Width (Text Above)
  const topDimY = -specs.totalHeight * 0.08;
  doc.line(tx(0), ty(topDimY), tx(specs.totalWidth), ty(topDimY));
  doc.line(tx(0), ty(topDimY) - 1, tx(0), ty(topDimY) + 1);
  doc.line(tx(specs.totalWidth), ty(topDimY) - 1, tx(specs.totalWidth), ty(topDimY) + 1);
  doc.text(`Total Width: ${specs.totalWidth} ${unit}`, tx(specs.totalWidth / 2), ty(topDimY) - 2, { align: 'center' });

  // Left Total Height (Text Vertical)
  // Use fixed offset instead of percentage to avoid overlapping with sidebar text
  const leftDimX = -45;
  doc.line(tx(leftDimX), ty(0), tx(leftDimX), ty(specs.totalHeight));
  doc.line(tx(leftDimX) - 1, ty(0), tx(leftDimX) + 1, ty(0));
  doc.line(tx(leftDimX) - 1, ty(specs.totalHeight), tx(leftDimX) + 1, ty(specs.totalHeight));
  doc.text(`Total Height: ${specs.totalHeight} ${unit}`, tx(leftDimX) + 16, ty(specs.totalHeight / 2), { angle: 90, align: 'center' });


  doc.save("blueprint_spec_sheet.pdf");
};