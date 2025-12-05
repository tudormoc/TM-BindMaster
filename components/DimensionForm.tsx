import React from 'react';
import { CoverDimensions, Unit } from '../types';
import { Ruler, ArrowLeftRight, ArrowUpDown, Book, FoldHorizontal, Scissors } from 'lucide-react';

interface Props {
  dimensions: CoverDimensions;
  setDimensions: React.Dispatch<React.SetStateAction<CoverDimensions>>;
}

export const DimensionForm: React.FC<Props> = ({ dimensions, setDimensions }) => {
  const handleChange = (field: keyof CoverDimensions, value: string | number) => {
    setDimensions(prev => ({
      ...prev,
      [field]: field === 'unit' ? value : Number(value)
    }));
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-xl">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-100">
        <Ruler className="text-cyan-400" size={20} />
        Dimensions Setup
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Unit Selection */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Unit</label>
          <div className="flex bg-zinc-950 p-1 rounded-md border border-zinc-800 w-fit">
            {Object.values(Unit).map((u) => (
              <button
                key={u}
                onClick={() => handleChange('unit', u)}
                className={`px-4 py-1.5 rounded text-sm font-mono transition-all ${
                  dimensions.unit === u 
                    ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Board Dimensions */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Book size={16} /> Board Size (Greyboard)
          </label>
          
          <div className="relative group">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Width</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <ArrowLeftRight size={16} className="text-zinc-600 mr-2" />
              <input
                type="number"
                value={dimensions.boardWidth}
                onChange={(e) => handleChange('boardWidth', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.1"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Height</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <ArrowUpDown size={16} className="text-zinc-600 mr-2" />
              <input
                type="number"
                value={dimensions.boardHeight}
                onChange={(e) => handleChange('boardHeight', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.1"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
          </div>
        </div>

        {/* Binding Details */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <FoldHorizontal size={16} /> Spine & Details
          </label>
          
          <div className="relative group">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Spine Width</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <input
                type="number"
                value={dimensions.spineWidth}
                onChange={(e) => handleChange('spineWidth', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.1"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Hinge Gap</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <input
                type="number"
                value={dimensions.hingeGap}
                onChange={(e) => handleChange('hingeGap', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.1"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
          </div>

           <div className="relative group">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Turn-In (Wrap)</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <input
                type="number"
                value={dimensions.turnIn}
                onChange={(e) => handleChange('turnIn', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.1"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
          </div>
        </div>

        {/* Printing Specs */}
        <div className="col-span-1 md:col-span-2 space-y-4 pt-2 border-t border-zinc-800">
           <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Scissors size={16} /> Prepress / Print
          </label>
           <div className="relative group max-w-[50%]">
            <label className="absolute -top-2.5 left-2 text-[10px] bg-zinc-900 px-1 text-zinc-500 group-focus-within:text-cyan-400">Bleed (Optional)</label>
            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 focus-within:border-cyan-500 transition-colors">
              <input
                type="number"
                value={dimensions.bleed}
                onChange={(e) => handleChange('bleed', e.target.value)}
                className="bg-transparent w-full outline-none font-mono text-zinc-100 placeholder-zinc-700"
                step="0.5"
                min="0"
              />
              <span className="text-xs text-zinc-600 font-mono ml-2">{dimensions.unit}</span>
            </div>
             <p className="text-[10px] text-zinc-600 mt-1 ml-1">Standard: 3mm - 5mm. Set 0 to disable.</p>
          </div>
        </div>

      </div>
    </div>
  );
};