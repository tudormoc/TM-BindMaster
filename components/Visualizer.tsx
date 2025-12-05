import React from 'react';
import { CoverDimensions, CalculatedSpecs } from '../types';

interface VisualizerProps {
  dimensions: CoverDimensions;
  specs: CalculatedSpecs;
}

export const Visualizer: React.FC<VisualizerProps> = ({ dimensions, specs }) => {
  const { totalWidth, totalHeight } = specs;
  const { turnIn, boardHeight, boardWidth, spineWidth, hingeGap, unit, bleed } = dimensions;

  // Padding calculation
  const bleedPadding = bleed; 
  
  // Padding settings
  const padTop = totalHeight * 0.25; 
  const padBottom = totalHeight * 0.25;
  const padX = totalWidth * 0.25; // Increased horizontal padding for right dimensions
  
  const viewBoxX = -bleedPadding - (padX * 0.6); 
  const viewBoxY = -bleedPadding - padTop;
  const viewBoxW = totalWidth + (bleedPadding * 2) + (padX * 1.5); // Wider viewbox
  const viewBoxH = totalHeight + (bleedPadding * 2) + padTop + padBottom;

  const guideColor = "#06b6d4"; // Cyan-500
  const boardColor = "#27272a"; // Zinc-800
  const foldColor = "#d946ef"; // Fuschia-500
  const dimColor = "#a1a1aa"; // Zinc-400
  const bleedColor = "#ef4444"; // Red-500
  const cutLineColor = "#52525b"; // Zinc-600
  const labelColor = "#ffffff";

  // Helper for dimension lines
  const DimLine = ({ 
    x1, y1, x2, y2, 
    text, 
    vertical = false, 
    textAbove = false, 
    rotateText = false,
    withExtension = false, 
    extensionY = 0, // Y coordinate of object to connect to (for horizontal dims)
    extensionX = 0  // X coordinate of object to connect to (for vertical dims)
  }: any) => {
    const fontSize = totalWidth * 0.014;
    const tickSize = totalWidth * 0.005;
    const textOffset = fontSize * 0.5;

    // Center point
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    let textX = cx;
    let textY = cy;
    let anchor = "middle";
    let baseline = "middle"; 

    if (vertical) {
      if (rotateText) {
        textX = cx - textOffset; 
        textY = cy;
        anchor = "middle";
        baseline = "auto";
      } else {
        textX = x1 - tickSize * 2;
        anchor = "end";
      }
    } else {
      // Horizontal
      if (textAbove) {
        textY = y1 - tickSize - textOffset;
        baseline = "auto"; 
      } else {
        textY = y1 + tickSize + fontSize + textOffset;
        baseline = "hanging";
      }
    }

    return (
      <g>
        {/* Extension Lines (Witness lines) */}
        {withExtension && !vertical && (
          <>
            <line x1={x1} y1={extensionY} x2={x1} y2={y1} stroke={dimColor} strokeWidth={totalWidth * 0.0005} strokeDasharray="2 2" opacity="0.5" />
            <line x1={x2} y1={extensionY} x2={x2} y2={y2} stroke={dimColor} strokeWidth={totalWidth * 0.0005} strokeDasharray="2 2" opacity="0.5" />
          </>
        )}
        {withExtension && vertical && (
          <>
            <line x1={extensionX} y1={y1} x2={x1} y2={y1} stroke={dimColor} strokeWidth={totalWidth * 0.0005} strokeDasharray="2 2" opacity="0.5" />
            <line x1={extensionX} y1={y2} x2={x2} y2={y2} stroke={dimColor} strokeWidth={totalWidth * 0.0005} strokeDasharray="2 2" opacity="0.5" />
          </>
        )}

        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={dimColor} strokeWidth={totalWidth * 0.001} />
        
        {/* Ticks */}
        {vertical ? (
          <>
            <line x1={x1 - tickSize} y1={y1} x2={x1 + tickSize} y2={y1} stroke={dimColor} strokeWidth={totalWidth * 0.001} />
            <line x1={x2 - tickSize} y1={y2} x2={x2 + tickSize} y2={y2} stroke={dimColor} strokeWidth={totalWidth * 0.001} />
          </>
        ) : (
          <>
            <line x1={x1} y1={y1 - tickSize} x2={x1} y2={y1 + tickSize} stroke={dimColor} strokeWidth={totalWidth * 0.001} />
            <line x1={x2} y1={y2 - tickSize} x2={x2} y2={y2 + tickSize} stroke={dimColor} strokeWidth={totalWidth * 0.001} />
          </>
        )}
        
        <text 
          x={textX} 
          y={textY} 
          fill={dimColor} 
          textAnchor={anchor} 
          dominantBaseline={baseline}
          fontSize={fontSize}
          transform={rotateText ? `rotate(-90, ${textX}, ${textY})` : ""}
        >
          {text}
        </text>
      </g>
    );
  };

  // Updated Registration Mark helper
  const RegMark = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r={totalWidth * 0.002} fill="none" stroke="black" strokeWidth={totalWidth * 0.0005} />
      <line x1={-totalWidth * 0.006} y1="0" x2={totalWidth * 0.006} y2="0" stroke="black" strokeWidth={totalWidth * 0.0005} />
      <line x1="0" y1={-totalWidth * 0.006} x2="0" y2={totalWidth * 0.006} stroke="black" strokeWidth={totalWidth * 0.0005} />
    </g>
  );

  const BleedTick = ({ x }: { x: number }) => (
    <g>
      <line x1={x} y1={-bleed} x2={x} y2={-bleed * 0.2} stroke="black" strokeWidth={totalWidth * 0.001} />
      <line x1={x} y1={totalHeight + bleed} x2={x} y2={totalHeight + bleed * 0.2} stroke="black" strokeWidth={totalWidth * 0.001} />
    </g>
  );

  // Text Label positions
  const labelY = turnIn + (boardHeight * 0.2); 

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
      <div className="absolute top-4 left-4 text-xs font-mono text-zinc-500 z-10 pointer-events-none">
        Blueprint Preview {bleed > 0 && <span className="text-red-400 ml-2">• Bleed Active ({bleed}{unit})</span>}
      </div>
      
      <svg 
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" style={{stroke:bleedColor, strokeWidth:1, opacity: 0.1}} />
          </pattern>
        </defs>

        {/* --- Bleed Area --- */}
        {bleed > 0 && (
          <rect 
            x={-bleed} 
            y={-bleed} 
            width={totalWidth + (bleed * 2)} 
            height={totalHeight + (bleed * 2)} 
            fill="url(#diagonalHatch)"
            stroke={bleedColor}
            strokeWidth={totalWidth * 0.001}
            strokeDasharray="4 2"
          />
        )}

        {/* --- Bleed Elements (Marks) --- */}
        {bleed > 0 && (
          <>
            <RegMark x={totalWidth / 2} y={-bleed / 2} />
            <RegMark x={-bleed / 2} y={totalHeight / 2} />
            <RegMark x={totalWidth + bleed / 2} y={totalHeight / 2} />
            <RegMark x={totalWidth / 2} y={totalHeight + bleed / 2} />

            <BleedTick x={specs.spineStart} />
            <BleedTick x={specs.spineEnd} />
            <BleedTick x={specs.frontBoardStart} />
            <BleedTick x={turnIn + boardWidth} />
          </>
        )}

        {/* --- Trim Box (Paper) --- */}
        <rect 
          x="0" 
          y="0" 
          width={totalWidth} 
          height={totalHeight} 
          fill="#f4f4f5" 
          stroke={cutLineColor}
          strokeWidth={totalWidth * 0.002}
        />

        {/* --- Boards & Spine Simulation --- */}
        
        {/* Back Cover Board */}
        <rect
          x={turnIn}
          y={turnIn}
          width={boardWidth}
          height={boardHeight}
          fill={boardColor}
          opacity="0.8"
        />
        <text x={turnIn + boardWidth/2} y={labelY} textAnchor="middle" fill={labelColor} fontSize={totalWidth * 0.02} fontFamily="monospace" style={{pointerEvents: 'none'}}>BACK</text>

        {/* Spine Board */}
        <rect
          x={turnIn + boardWidth + hingeGap}
          y={turnIn}
          width={spineWidth}
          height={boardHeight}
          fill={boardColor}
          opacity="0.8"
        />
        <text 
          x={turnIn + boardWidth + hingeGap + spineWidth/2} 
          y={labelY} 
          textAnchor="middle" 
          fill={labelColor} 
          fontSize={totalWidth * 0.015} 
          fontFamily="monospace" 
          transform={`rotate(90, ${turnIn + boardWidth + hingeGap + spineWidth/2}, ${labelY})`} 
          style={{pointerEvents: 'none'}}
        >
          SPINE
        </text>


        {/* Front Cover Board */}
        <rect
          x={turnIn + boardWidth + hingeGap + spineWidth + hingeGap}
          y={turnIn}
          width={boardWidth}
          height={boardHeight}
          fill={boardColor}
          opacity="0.8"
        />
        
        {/* Front Label (Moved Top) */}
        <text x={specs.frontBoardStart + boardWidth/2} y={labelY} textAnchor="middle" fill={labelColor} fontSize={totalWidth * 0.02} fontFamily="monospace" style={{pointerEvents: 'none'}}>FRONT</text>

        {/* --- Guides --- */}
        <line x1="0" y1={turnIn} x2={totalWidth} y2={turnIn} stroke={guideColor} strokeDasharray="4" strokeWidth={totalWidth * 0.001} />
        <line x1="0" y1={totalHeight - turnIn} x2={totalWidth} y2={totalHeight - turnIn} stroke={guideColor} strokeDasharray="4" strokeWidth={totalWidth * 0.001} />
        <line x1={specs.spineStart} y1={0} x2={specs.spineStart} y2={totalHeight} stroke={foldColor} strokeDasharray="4" strokeWidth={totalWidth * 0.002} />
        <line x1={specs.spineEnd} y1={0} x2={specs.spineEnd} y2={totalHeight} stroke={foldColor} strokeDasharray="4" strokeWidth={totalWidth * 0.002} />

        {/* --- Dimensions Annotations --- */}

        {/* Total Width (Top) - Text ABOVE line */}
        <DimLine 
          x1={0} y1={-bleed - (totalHeight * 0.08)} 
          x2={totalWidth} y2={-bleed - (totalHeight * 0.08)} 
          text={`Total Width: ${totalWidth.toFixed(1)}${unit}`} 
          textAbove={true}
        />

        {/* Total Height (Far Left) - Text Vertical Rotated */}
        <DimLine 
          x1={-bleed - (totalWidth * 0.08)} y1={0} 
          x2={-bleed - (totalWidth * 0.08)} y2={totalHeight} 
          text={`Total Height: ${totalHeight.toFixed(1)}${unit}`} 
          vertical={true} 
          rotateText={true}
        />

        {/* Detailed Vertical Breakdown (Right Side) */}
        {(() => {
          const dimRightX = totalWidth + bleed + (totalWidth * 0.08);
          const objRightEdge = totalWidth;
          
          return (
            <>
              {/* Top Turn-in */}
              <DimLine 
                x1={dimRightX} y1={0} 
                x2={dimRightX} y2={turnIn} 
                text={`${turnIn}`} 
                vertical={true} 
                rotateText={true} 
                withExtension={true} 
                extensionX={objRightEdge} 
              />
              
              {/* Board Height */}
              <DimLine 
                x1={dimRightX} y1={turnIn} 
                x2={dimRightX} y2={totalHeight - turnIn} 
                text={`${boardHeight}`} 
                vertical={true} 
                rotateText={true} 
                withExtension={true} 
                extensionX={objRightEdge} 
              />
              
              {/* Bottom Turn-in */}
              <DimLine 
                x1={dimRightX} y1={totalHeight - turnIn} 
                x2={dimRightX} y2={totalHeight} 
                text={`${turnIn}`} 
                vertical={true} 
                rotateText={true} 
                withExtension={true} 
                extensionX={objRightEdge} 
              />
            </>
          )
        })()}

        {/* Detailed Horizontal Breakdown (Bottom) - Single Line Chain with Extensions */}
        {(() => {
          const dimY = totalHeight + bleed + (totalHeight * 0.08);
          const objBottom = totalHeight;
          return (
            <>
              {/* Left Turnin */}
              <DimLine x1={0} y1={dimY} x2={turnIn} y2={dimY} text={`${turnIn}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Back Board */}
              <DimLine x1={turnIn} y1={dimY} x2={turnIn + boardWidth} y2={dimY} text={`${boardWidth}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Gap 1 */}
              <DimLine x1={turnIn + boardWidth} y1={dimY} x2={specs.spineStart} y2={dimY} text={`${hingeGap}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Spine */}
              <DimLine x1={specs.spineStart} y1={dimY} x2={specs.spineEnd} y2={dimY} text={`${spineWidth}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Gap 2 */}
              <DimLine x1={specs.spineEnd} y1={dimY} x2={specs.frontBoardStart} y2={dimY} text={`${hingeGap}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Front Board */}
              <DimLine x1={specs.frontBoardStart} y1={dimY} x2={specs.frontBoardStart + boardWidth} y2={dimY} text={`${boardWidth}`} textAbove={true} withExtension={true} extensionY={objBottom} />
              
              {/* Right Turnin */}
              <DimLine x1={specs.frontBoardStart + boardWidth} y1={dimY} x2={totalWidth} y2={dimY} text={`${turnIn}`} textAbove={true} withExtension={true} extensionY={objBottom} />
            </>
          )
        })()}

      </svg>
    </div>
  );
};