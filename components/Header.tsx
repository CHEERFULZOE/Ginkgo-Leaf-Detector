import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center py-10 px-4 relative z-10">
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 tracking-tight drop-shadow-sm pb-2">
          银杏观赏助手
        </h1>
        <div className="absolute -top-6 -right-6 text-4xl animate-bounce-slow opacity-80">
          🍂
        </div>
      </div>
      <p className="mt-4 text-lg text-gray-700 font-medium max-w-lg mx-auto leading-relaxed shadow-sm">
        上传银杏照片，智能识别<br className="hidden sm:block"/>
        <span className="text-amber-600 font-bold">精准判断</span> 最佳观赏窗口期
      </p>
    </header>
  );
};

export default Header;