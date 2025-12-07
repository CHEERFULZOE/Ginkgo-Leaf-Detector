
import React from 'react';
import { GinkgoAnalysis, ViewingStatus } from '../types';
import { Camera, RefreshCw, Calendar, TrendingUp, Info, ArrowRight } from 'lucide-react';

interface AnalysisResultProps {
  analysis: GinkgoAnalysis;
  onNext: () => void;
  onReanalyze: () => void;
}

const GinkgoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
     <path d="M12 23c-0.6-4-1-7-0.5-9-5-1-8.5-5-7.5-9.5C4.5 2 7.5 2.5 10 4.5c1.2 1 2 2.5 2 2.5s0.8-1.5 2-2.5c2.5-2 5.5-2.5 6-0.5 1 4.5-2.5 8.5-7.5 9.5 0.5 2 0.1 5-0.5 9h-1z" />
  </svg>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onNext, onReanalyze }) => {
  const isEarly = analysis.status === ViewingStatus.EARLY;
  const isSuitable = analysis.status === ViewingStatus.SUITABLE;
  const isBest = analysis.status === ViewingStatus.BEST;

  // Calculate timeline position (0-100)
  // Early: 0-33, Suitable: 34-66, Best: 67-100
  // Adjust based on percentageYellow for smoother visual
  let timelineProgress = analysis.percentageYellow;
  
  // Color logic
  const getStatusColor = () => {
    if (isEarly) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (isSuitable) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    if (isBest) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const getStatusAccent = () => {
    if (isEarly) return 'text-emerald-600';
    if (isSuitable) return 'text-yellow-600';
    if (isBest) return 'text-amber-600';
    return 'text-gray-600';
  };
  
  const getGradientText = () => {
    if (isEarly) return 'bg-gradient-to-br from-emerald-600 to-green-500';
    if (isSuitable) return 'bg-gradient-to-br from-yellow-600 to-amber-500';
    if (isBest) return 'bg-gradient-to-br from-amber-600 to-orange-600';
    return 'bg-gradient-to-br from-gray-600 to-gray-500';
  }

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden animate-fade-in-up flex flex-col h-full">
      
      {/* 1. Header & Big Result */}
      <div className="p-6 md:p-10 border-b border-gray-100 flex flex-col items-center justify-center text-center space-y-1 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className={`absolute top-0 left-0 w-full h-full opacity-10 ${isEarly ? 'bg-emerald-200' : isSuitable ? 'bg-yellow-200' : 'bg-amber-200'} blur-3xl pointer-events-none transform -translate-y-1/2`} />
        
        <div className="flex flex-col items-center relative z-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>检测结果</span>
          </h2>
          
          <div className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text ${getGradientText()} drop-shadow-sm pb-2 pt-1`}>
            {analysis.status}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 flex-grow">
        
        {/* 2. Phenology Timeline Visualizer */}
        <div className="space-y-3">
          <div className="flex justify-between items-end mb-2">
             <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isEarly ? 'bg-emerald-500' : isSuitable ? 'bg-yellow-500' : 'bg-amber-500'}`} />
                黄化指数
             </span>
             <span className={`text-3xl font-black ${getStatusAccent()} tabular-nums`}>{analysis.percentageYellow}%</span>
          </div>
          
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner ring-1 ring-black/5">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out 
                ${isEarly ? 'bg-gradient-to-r from-green-500 to-emerald-400' : ''}
                ${isSuitable ? 'bg-gradient-to-r from-emerald-400 via-yellow-400 to-yellow-500' : ''}
                ${isBest ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : ''}
              `}
              style={{ width: `${timelineProgress}%` }}
            />
            {/* Markers */}
            <div className="absolute top-0 left-[33%] h-full w-px bg-white/60" />
            <div className="absolute top-0 left-[66%] h-full w-px bg-white/60" />
          </div>
          
          <div className="grid grid-cols-3 text-xs font-medium text-center text-gray-400 pt-1">
            <span className={isEarly ? 'text-emerald-700 font-bold' : ''}>初变色期</span>
            <span className={isSuitable ? 'text-yellow-700 font-bold' : ''}>适宜观赏期</span>
            <span className={isBest ? 'text-amber-700 font-bold' : ''}>最佳观赏期</span>
          </div>
        </div>

        {/* 3. Scientific Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card A: Prediction */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60 flex flex-col gap-3 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wide">
                    <TrendingUp className="w-4 h-4" />
                    <span>时令预测</span>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                    {analysis.prediction}
                </p>
            </div>

            {/* Card B: Visual Features */}
            <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 hover:bg-gray-100 transition-colors">
                 <div className="flex items-center gap-2 text-gray-600 font-bold text-sm uppercase tracking-wide">
                    <Camera className="w-4 h-4" />
                    <span>色彩特征</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                    {analysis.colorDescription}
                </p>
            </div>
        </div>

        {/* 4. Expert Advice */}
        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 hover:bg-amber-50 transition-colors">
             <div className="flex items-center gap-2 text-amber-700 font-bold text-sm uppercase tracking-wide mb-3">
                <Info className="w-4 h-4" />
                <span>专家观赏建议</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {analysis.scientificAssessment}
            </p>
        </div>
      </div>

      {/* 5. Footer Action Buttons */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-4">
        <button
          onClick={onReanalyze}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl font-bold shadow-sm border border-gray-200 transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>重新检测</span>
        </button>
        
        <button
          onClick={onNext}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 bg-amber-950 hover:bg-amber-900 text-amber-50 rounded-2xl font-bold shadow-lg hover:shadow-amber-900/20 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          <span>检测下一张</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
