
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  language: 'en' | 'ar';
  onToggleLanguage: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, language, onToggleLanguage }) => {
  const isRtl = language === 'ar';

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-4 md:px-6 transition-colors duration-500 bg-[#020617] text-slate-100"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <header className="w-full max-w-4xl py-8 md:py-10 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className={`absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="relative bg-blue-600 p-2.5 rounded-xl border border-blue-400/40 shadow-lg transition-transform duration-500 group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
              SM <span className="text-blue-600 font-black">PC</span>
            </h1>
            <span className={`text-[9px] font-bold opacity-30 uppercase mt-1 ${isRtl ? '' : 'tracking-widest'}`}>
              {isRtl ? 'خبير التجهيزات' : 'Setup master'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLanguage}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase transition-all text-slate-400"
          >
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {children}
      </main>

      <footer className="w-full max-w-4xl py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
        <div className="text-[10px] font-bold">
          &copy; {new Date().getFullYear()} {isRtl ? 'بيتا. النواة المحسنة.' : 'Beta. Optimized Core.'}
        </div>
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2">Engine {isRtl ? 'يعمل' : 'Live'}</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
