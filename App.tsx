
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { analyzeGinkgoImage } from './services/geminiService';
import { GinkgoAnalysis } from './types';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GinkgoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64Image: string) => {
    setCurrentImage(base64Image);
    performAnalysis(base64Image);
  };

  const performAnalysis = async (base64Image: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeGinkgoImage(base64Image);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("无法分析图片，请稍后重试或更换一张图片。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = () => {
    if (currentImage) {
      performAnalysis(currentImage);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 text-gray-800 font-sans selection:bg-amber-200 relative overflow-x-hidden">
      
      {/* Background Texture Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-2 15-5 25-2.5 35 2 8 8 12 15 15 5 2 10 1 15-2l-5 10c-5 3-12 3-18 0-6-3-9-8-10-15-1-7 2-15 5.5-28z' fill='%23d97706' fill-rule='evenodd'/%3E%3C/svg%3E")`,
             backgroundSize: '80px 80px'
           }}
      />

      {/* Main Container */}
      <div className="w-full flex flex-col items-center relative z-10">
        <Header />

        <main className="w-full max-w-6xl px-4 pb-20 flex flex-col items-center justify-center space-y-10">
          
          {/* State 1: Uploading - Centered */}
          {!analysis && !currentImage && (
             <div className="animate-fade-in w-full flex justify-center py-10">
               <ImageUploader onImageSelected={handleImageSelected} isLoading={false} />
             </div>
          )}

          {/* State 2: Loading / Preview - Centered */}
          {isLoading && currentImage && (
             <div className="w-full max-w-md flex flex-col items-center space-y-8 animate-fade-in py-10">
               <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/60 bg-white">
                  <img src={currentImage} alt="Preview" className="w-full h-full object-cover opacity-90 blur-[2px]" />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                    <div className="w-4/5 h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className="h-full bg-amber-500 animate-progress-indeterminate shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    </div>
                  </div>
               </div>
               <div className="text-center space-y-2">
                 <p className="text-2xl font-bold text-gray-800 animate-pulse">
                   正在检测分析中...
                 </p>
                 <p className="text-gray-500 font-medium">智能识别颜色与形态</p>
               </div>
             </div>
          )}

          {/* State 3: Error */}
          {error && (
            <div className="bg-red-50/90 backdrop-blur border border-red-200 rounded-2xl p-8 text-center max-w-md w-full animate-fade-in shadow-xl">
              <p className="text-red-600 mb-6 text-lg font-medium">{error}</p>
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-bold shadow-sm"
              >
                重试
              </button>
            </div>
          )}

          {/* State 4: Result - Two Column Layout on Desktop */}
          {analysis && !isLoading && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in-up items-start">
              
              {/* Left: Image (Takes 5 cols on large screens) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/60 transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full max-w-md lg:max-w-full aspect-[4/5] bg-gray-100">
                   <img src={currentImage!} alt="Analyzed Ginkgo" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              </div>
              
              {/* Right: Analysis Card (Takes 7 cols on large screens) */}
              <div className="lg:col-span-7 w-full order-2">
                 <AnalysisResult 
                    analysis={analysis} 
                    onNext={handleReset} 
                    onReanalyze={handleReanalyze}
                  />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-progress-indeterminate {
          animation: progressIndeterminate 1.5s infinite linear;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
