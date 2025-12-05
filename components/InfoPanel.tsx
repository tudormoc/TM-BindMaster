import React from 'react';
import { CoverDimensions, CalculatedSpecs } from '../types';
import { Download, FileText } from 'lucide-react';
import { generateCoverPDF, generateBlueprintPDF } from '../services/pdfService';

interface Props {
  dimensions: CoverDimensions;
  specs: CalculatedSpecs;
}

export const InfoPanel: React.FC<Props> = ({ dimensions, specs }) => {

  const handleDownloadPDF = () => {
    generateCoverPDF(dimensions, specs);
  };

  const handleDownloadBlueprint = () => {
    generateBlueprintPDF(dimensions, specs);
  };

  // Guide calculations
  const g1 = dimensions.turnIn;
  const g2 = g1 + dimensions.boardWidth;
  const g3 = g2 + dimensions.hingeGap;
  const g4 = g3 + dimensions.spineWidth;
  const g5 = g4 + dimensions.hingeGap;
  const g6 = g5 + dimensions.boardWidth;
  
  const h1 = dimensions.turnIn;
  const h2 = specs.totalHeight - dimensions.turnIn;

  return (
    <div className="flex flex-col gap-4">
      {/* Specs Card */}
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-zinc-100">Document Specs</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 text-sm">Trim Width (Cut)</span>
            <span className="text-2xl font-mono text-cyan-400 font-bold">{specs.totalWidth.toFixed(2)} {dimensions.unit}</span>
          </div>
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
             <span className="text-zinc-400 text-sm">Trim Height (Cut)</span>
            <span className="text-2xl font-mono text-cyan-400 font-bold">{specs.totalHeight.toFixed(2)} {dimensions.unit}</span>
          </div>
          {dimensions.bleed > 0 && (
             <div className="flex justify-between items-end border-b border-zinc-800 pb-2 bg-zinc-900/50">
               <span className="text-red-400 text-sm">Size incl. Bleed</span>
               <span className="text-lg font-mono text-red-400">
                 {(specs.totalWidth + (dimensions.bleed * 2)).toFixed(2)} x {(specs.totalHeight + (dimensions.bleed * 2)).toFixed(2)}
               </span>
             </div>
          )}
          
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">InDesign Setup Instructions</h3>
            <div className="text-sm text-zinc-300 space-y-3">
              <div>
                <strong className="block text-cyan-300 mb-1">1. Document</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-xs font-mono text-zinc-400">
                  <li>W: {specs.totalWidth} | H: {specs.totalHeight}</li>
                  <li>Margins: {dimensions.turnIn} (Top/Btm/Left/Right)</li>
                  <li>Bleed: {dimensions.bleed} (Top/Btm/Left/Right)</li>
                </ul>
              </div>

              <div>
                <strong className="block text-cyan-300 mb-1">2. Vertical Guidelines (X)</strong>
                <p className="text-[10px] text-zinc-500 mb-1">Place guides at these X coordinates:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-xs font-mono text-zinc-400">
                  <li>{g1} (Back Board Start)</li>
                  <li>{g2} (Back Board End)</li>
                  <li>{g3} (Spine Start)</li>
                  <li>{g4} (Spine End)</li>
                  <li>{g5} (Front Board Start)</li>
                  <li>{g6} (Front Board End)</li>
                </ul>
              </div>

              <div>
                <strong className="block text-cyan-300 mb-1">3. Horizontal Guidelines (Y)</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-xs font-mono text-zinc-400">
                  <li>{h1} (Top Board Edge)</li>
                  <li>{h2} (Bottom Board Edge)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownloadPDF}
          className="col-span-1 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-lg border border-zinc-700 transition-all flex items-center justify-center gap-2 group"
        >
          <Download size={18} className="group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-medium">Template PDF</span>
        </button>

        <button 
          onClick={handleDownloadBlueprint}
          className="col-span-1 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-lg border border-zinc-700 transition-all flex items-center justify-center gap-2 group"
        >
          <FileText size={18} className="group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-medium">Blueprint PDF</span>
        </button>
      </div>
    </div>
  );
};