
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Camera } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger standard file picker (Album/File)
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Trigger Camera specifically
  const triggerCameraInput = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop bubbling to prevent triggering the parent file input
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md">
      <div
        className={`
          relative group cursor-pointer 
          bg-white/70 backdrop-blur-md
          border-3 border-dashed rounded-[2rem] 
          flex flex-col items-center justify-center 
          h-96 transition-all duration-300 ease-in-out shadow-xl
          ${isDragging ? 'border-amber-500 bg-amber-50/90 scale-105 shadow-amber-200' : 'border-amber-200 hover:border-amber-400 hover:bg-white/80'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput} // Default click opens generic picker (Album on mobile)
      >
        {/* Standard File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept="image/*"
        />
        
        {/* Camera Specific Input - forces environment camera on mobile */}
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept="image/*"
          capture="environment"
        />

        <div className="flex flex-col items-center space-y-6 p-6 text-center z-10 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-amber-800">正在分析银杏叶...</p>
              <p className="text-sm text-gray-500">正在观察颜色与纹理</p>
            </div>
          ) : (
            <>
              {/* Main Icon Area */}
              <div className="flex flex-col items-center space-y-3 group-hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-md">
                  <UploadCloud className="w-10 h-10 text-amber-600 animate-pulse-slow" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">上传银杏照片</p>
                  <p className="text-sm text-gray-500">点击选择相册或拖拽上传</p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center w-full max-w-[200px] gap-2 opacity-50">
                 <div className="h-px bg-gray-400 flex-grow"></div>
                 <span className="text-xs text-gray-500 font-medium">或者</span>
                 <div className="h-px bg-gray-400 flex-grow"></div>
              </div>

              {/* Camera Button */}
              <button 
                onClick={triggerCameraInput}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>直接拍照</span>
              </button>

              <div className="px-4 py-1.5 bg-amber-50/80 rounded-full text-xs text-amber-700 font-medium border border-amber-100 mt-2">
                建议拍摄清晰的树叶特写
              </div>
            </>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-[2rem] ring-4 ring-transparent group-hover:ring-amber-100/50 pointer-events-none transition-all duration-300" />
        
        {/* Custom CSS for slow pulse */}
        <style>{`
            @keyframes pulseSlow {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(0.95); }
            }
            .animate-pulse-slow {
                animation: pulseSlow 3s infinite ease-in-out;
            }
        `}</style>
      </div>
    </div>
  );
};

export default ImageUploader;
