import React, { useState, useMemo } from 'react';
import { CoverDimensions, Unit, CalculatedSpecs } from './types';
import { DimensionForm } from './components/DimensionForm';
import { Visualizer } from './components/Visualizer';
import { InfoPanel } from './components/InfoPanel';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  // Default State: A5 Book Size approx with standard turn-in
  const [dimensions, setDimensions] = useState<CoverDimensions>({
    unit: Unit.MM,
    boardWidth: 153,  // A5 width + 5mm overshoot
    boardHeight: 216, // A5 height + 6mm overshoot
    spineWidth: 20,
    hingeGap: 7,
    turnIn: 18,
    bleed: 0 // Default to 0 (optional)
  });

  // Real-time calculation of the total flat sheet size (Cut Size)
  const specs: CalculatedSpecs = useMemo(() => {
    // Layout: [TurnIn] [Board] [Hinge] [Spine] [Hinge] [Board] [TurnIn]
    const totalWidth =
      dimensions.turnIn +
      dimensions.boardWidth +
      dimensions.hingeGap +
      dimensions.spineWidth +
      dimensions.hingeGap +
      dimensions.boardWidth +
      dimensions.turnIn;

    // Layout: [TurnIn] [Board] [TurnIn]
    const totalHeight =
      dimensions.turnIn +
      dimensions.boardHeight +
      dimensions.turnIn;

    return {
      totalWidth,
      totalHeight,
      spineStart: dimensions.turnIn + dimensions.boardWidth + dimensions.hingeGap,
      spineEnd: dimensions.turnIn + dimensions.boardWidth + dimensions.hingeGap + dimensions.spineWidth,
      frontBoardStart: dimensions.turnIn + dimensions.boardWidth + dimensions.hingeGap + dimensions.spineWidth + dimensions.hingeGap,
      backBoardEnd: dimensions.turnIn + dimensions.boardWidth
    };
  }, [dimensions]);

  return (
    <div className="h-screen bg-zinc-950 text-zinc-200 flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden">

      {/* Header */}
      <header className="flex-none border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md z-10">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-1 rounded text-zinc-900">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white leading-none">TM BindMaster <span className="text-cyan-400 font-mono">3D</span></h1>
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono hidden sm:block uppercase tracking-widest">
            Prepress Ready v1.2
          </div>
        </div>
      </header>

      {/* Main Content Grid - Full height minus header */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Col: Controls - Scrollable */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 pb-20 lg:pb-0 scrollbar-thin">
            <DimensionForm dimensions={dimensions} setDimensions={setDimensions} />
            <InfoPanel dimensions={dimensions} specs={specs} />
          </div>

          {/* Right Col: Visualization - Flex container to fit space */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[400px]">
            <Visualizer dimensions={dimensions} specs={specs} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;