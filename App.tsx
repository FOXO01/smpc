
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SetupForm from './components/SetupForm';
import SetupResult from './components/SetupResult';
import { SetupRequest, SetupResponse } from './types';
import { generateSetup } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SetupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ar';
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');

  const handleGenerate = async (request: SetupRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSetup(request);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const isRtl = language === 'ar';

  return (
    <Layout 
      language={language} 
      onToggleLanguage={toggleLanguage}
    >
      <div className="relative w-full max-w-4xl mx-auto min-h-[500px]">
        {!result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SetupForm onSubmit={handleGenerate} isLoading={loading} language={language} />
            
            {error && (
              <div className="mt-6 p-5 bg-red-500/10 border border-red-500/30 rounded-3xl text-red-500 text-sm flex gap-4 items-center">
                <div className="p-2 bg-red-500/10 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-black uppercase tracking-widest text-[9px] mb-0.5">{isRtl ? 'خطأ في النظام' : 'System Error'}</span>
                  <span className="font-bold text-xs">{error}</span>
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40 hover:opacity-100 transition-opacity">
               {['Budget Gaming', '4K Production', 'Coding Hub', 'Minimalist Office'].map(tag => (
                  <div key={tag} className="p-3 bg-white/5 border border-white/10 rounded-xl text-center text-[9px] font-black uppercase tracking-widest">
                    {tag}
                  </div>
                ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center p-8 min-h-[500px] animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-6 border-blue-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 border-6 border-t-blue-500 rounded-3xl animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black tracking-tighter uppercase">{isRtl ? 'تحليل الأسواق' : 'Analyzing Markets'}</h3>
              <p className="opacity-50 font-bold uppercase tracking-[0.2em] text-[10px]">{isRtl ? 'فحص المخزون العالمي والأسعار...' : 'Scanning Global Inventory & Prices...'}</p>
              
              <div className="mt-8 max-w-[200px] mx-auto bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 group"
              >
                <svg className={`w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {isRtl ? 'تجهيز جديد' : 'New Build'}
              </button>
              
              <div className="flex items-center gap-4">
                 <div className="hidden md:block h-px w-16 bg-white/10"></div>
                 <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{isRtl ? 'تجهيز ذكاء اصطناعي' : 'AI Sourced build'}</span>
              </div>
            </div>

            <SetupResult result={result} language={language} />
            
            <div className="mt-12 flex justify-center">
               <button 
                  onClick={handleReset}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs transition-all active:scale-95"
               >
                 {isRtl ? 'بدء تجهيز آخر' : 'Start Another Build'}
               </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        [dir="rtl"] @keyframes loading {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-300%); }
        }
      `}</style>
    </Layout>
  );
};

export default App;
