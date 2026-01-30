
import React, { useState, useEffect, useRef } from 'react';
import { SetupRequest, SetupPurpose } from '../types';

interface SetupFormProps {
  onSubmit: (request: SetupRequest) => void;
  isLoading: boolean;
  language: 'en' | 'ar';
}

const PURPOSES: { id: SetupPurpose; label: { en: string; ar: string }; icon: React.ReactNode }[] = [
  { id: 'Gaming PC', label: { en: 'Gaming PC', ar: 'تجهيز ألعاب' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg> },
  { id: 'Streaming', label: { en: 'Streaming', ar: 'بث مباشر' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { id: 'Office', label: { en: 'Office', ar: 'مكتبي' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id: 'Programming', label: { en: 'Programming', ar: 'برمجة' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg> },
  { id: 'Graphic Design', label: { en: 'Graphic Design', ar: 'تصميم جرافيك' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg> },
  { id: 'Video Editing', label: { en: 'Video Editing', ar: 'مونتاج فيديو' }, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
];

const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading, language }) => {
  const [budget, setBudget] = useState<number>(1500);
  const [purpose, setPurpose] = useState<SetupPurpose>('Gaming PC');
  const [preferences, setPreferences] = useState<string>('');
  const [includePC, setIncludePC] = useState(true);
  const [includeMonitor, setIncludeMonitor] = useState(true);
  const [includePeripherals, setIncludePeripherals] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRtl = language === 'ar';

  const t = {
    config: isRtl ? 'إعدادات النظام' : 'SYSTEM CONFIG',
    budget: isRtl ? 'الميزانية ($)' : 'BUDGET ($)',
    purpose: isRtl ? 'الغرض من التجهيز' : 'SETUP PURPOSE',
    grid: isRtl ? 'شبكة التوزيع' : 'DEPLOYMENT GRID',
    preferences: isRtl ? 'تفضيلات إضافية' : 'PREFERENCES',
    placeholder: isRtl ? 'مثلاً: 32 جيجابايت رام، هادئ، إضاءة RGB...' : 'e.g. 32GB RAM, Quiet build, RGB setup...',
    deploy: isRtl ? 'نشر محرك الأجهزة' : 'DEPLOY HARDWARE ENGINE',
    machine: isRtl ? 'نواة الجهاز' : 'MACHINE CORE',
    machineSub: isRtl ? 'المعالج وكارت الشاشة' : 'DESKTOP CPU/GPU',
    optics: isRtl ? 'وحدة البصريات' : 'OPTICS UNIT',
    opticsSub: isRtl ? 'الشاشة' : 'SCREEN/DISPLAY',
    inputs: isRtl ? 'المدخلات' : 'INPUTS',
    inputsSub: isRtl ? 'لوحة المفاتيح والماوس' : 'KBM/SETUP',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ budget, purpose, preferences, includePC, includeMonitor, includePeripherals, language });
  };

  const selectedPurpose = PURPOSES.find(p => p.id === purpose);

  const incrementBudget = () => setBudget(prev => prev + 100);
  const decrementBudget = () => setBudget(prev => Math.max(0, prev - 100));

  return (
    <div className="glass-effect rounded-[2rem] p-8 md:p-12 relative overflow-visible border border-white/5 transition-all duration-300">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xl font-black flex items-center gap-3 text-white">
            <div className="w-2 h-6 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            {t.config}
          </h2>
          <div className="text-[10px] font-black text-blue-600 uppercase border border-blue-500/20 px-4 py-1.5 rounded-full bg-blue-500/5">V 4.2</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Main Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black opacity-50 uppercase tracking-widest text-white">{t.budget}</label>
              <div className="relative group">
                <span className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-blue-500 font-black text-2xl`}>$</span>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-[#0f172a] text-white rounded-2xl py-6 px-16 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex flex-col gap-1`}>
                    <button type="button" onClick={incrementBudget} className="p-1 text-white/30 hover:text-blue-400 opacity-60 hover:opacity-100 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"/></svg>
                    </button>
                    <button type="button" onClick={decrementBudget} className="p-1 text-white/30 hover:text-red-400 opacity-60 hover:opacity-100 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black opacity-50 uppercase tracking-widest text-white">{t.purpose}</label>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#0f172a] text-white rounded-2xl py-6 px-8 flex items-center justify-between cursor-pointer focus:ring-2 ring-blue-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">{selectedPurpose?.icon}</div>
                  <span className="text-xl font-bold tracking-tight">{selectedPurpose?.label[language]}</span>
                </div>
                <svg className={`w-5 h-5 text-white/30 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"/></svg>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-[#1e293b] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in">
                  {PURPOSES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setPurpose(p.id); setIsDropdownOpen(false); }}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${purpose === p.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
                    >
                      {p.icon}
                      <span className="font-bold text-sm">{p.label[language]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deployment Grid */}
          <div className="space-y-6">
            <label className="text-[10px] font-black opacity-50 uppercase tracking-widest text-white">{t.grid}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'pc', label: t.machine, sub: t.machineSub, checked: includePC, setter: setIncludePC },
                { id: 'monitor', label: t.optics, sub: t.opticsSub, checked: includeMonitor, setter: setIncludeMonitor },
                { id: 'peripherals', label: t.inputs, sub: t.inputsSub, checked: includePeripherals, setter: setIncludePeripherals }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.setter(!item.checked)}
                  className={`relative flex flex-col p-7 rounded-[1.5rem] border-2 transition-all ${
                    item.checked 
                      ? 'bg-blue-500/5 border-blue-500 shadow-lg shadow-blue-500/5' 
                      : 'bg-slate-900/50 border-white/5 opacity-40 grayscale'
                  }`}
                >
                  <span className={`text-[13px] font-black uppercase tracking-tight mb-1 ${item.checked ? 'text-blue-600' : 'text-white'}`}>{item.label}</span>
                  <span className={`text-[10px] font-bold mb-6 tracking-wide ${item.checked ? 'opacity-60 text-blue-600' : 'opacity-40 text-slate-400'}`}>{item.sub}</span>
                  <div className={`mt-auto h-1.5 rounded-full transition-all duration-500 ${item.checked ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <label className="text-[10px] font-black opacity-50 uppercase tracking-widest text-white">{t.preferences}</label>
            <textarea 
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full bg-[#0f172a] text-white rounded-[1.5rem] py-7 px-8 text-base font-medium h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
              placeholder={t.placeholder}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-6 rounded-[1.5rem] font-black text-lg shadow-2xl flex items-center justify-center gap-4 group transition-all ${
              isLoading
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
            }`}
          >
             <span className="uppercase tracking-tight">{t.deploy}</span>
             <svg className={`w-6 h-6 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupForm;
