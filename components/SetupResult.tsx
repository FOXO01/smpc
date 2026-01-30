
import React from 'react';
import { SetupResponse } from '../types';

interface SetupResultProps {
  result: SetupResponse;
  language: 'en' | 'ar';
}

const SetupResult: React.FC<SetupResultProps> = ({ result, language }) => {
  const isRtl = language === 'ar';
  
  const cleanMarkdown = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/##/g, '').trim();
  };

  const formatInline = (text: string) => {
    let html = text
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-blue-600 font-bold italic">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-600 font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="opacity-60 italic">$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline font-bold transition-all">$1</a>');
    return html;
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTable: string[][] = [];
    let inTable = false;

    const flushTable = (key: number, isPerformance: boolean = false) => {
      if (currentTable.length > 0) {
        const header = currentTable[0];
        const rows = currentTable.slice(1).filter(r => !r.every(c => c.trim() === '' || c.includes('---')));
        
        elements.push(
          <div key={`table-${key}`} className={`my-10 overflow-hidden rounded-[2rem] border ${isPerformance ? 'border-blue-500/20 bg-blue-500/5 shadow-lg shadow-blue-500/5' : 'bg-slate-950 border-white/5'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className={`border-b ${isPerformance ? 'bg-blue-500/10' : 'bg-white/5'}`}>
                    {header.map((cell, i) => (
                      <th key={i} className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60 text-slate-400 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {cleanMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/5 last:border-0 hover:bg-blue-500/5 transition-colors">
                      {row.map((cell, ci) => (
                        <td key={ci} className={`px-8 py-5 text-sm font-semibold text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {isPerformance && cell.toUpperCase().includes('FPS') ? (
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-xl shadow-lg font-black text-[11px]">
                              {cell.trim()}
                            </span>
                          ) : (
                            <span dangerouslySetInnerHTML={{ __html: formatInline(cell.trim()) }} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        currentTable = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('|') && trimmedLine.includes('|')) {
        inTable = true;
        const cells = trimmedLine.split('|').slice(1, -1);
        currentTable.push(cells);
        return;
      } else if (inTable && (trimmedLine.length === 0 || !trimmedLine.startsWith('|'))) {
        const lastHeading = elements[elements.length - 1];
        const isPerf = React.isValidElement(lastHeading) && (lastHeading.props as any).className?.includes('perf-header');
        flushTable(i, isPerf);
        inTable = false;
      }

      if (inTable) return;

      if (trimmedLine.startsWith('##')) {
        const content = cleanMarkdown(trimmedLine);
        const isPerf = content.toLowerCase().includes('performance') || content.includes('الأداء');
        elements.push(
          <h2 key={i} className={`text-xl font-black mt-16 mb-8 flex items-center gap-4 ${isPerf ? 'perf-header text-blue-600' : 'text-white'}`}>
            <div className={`w-2 h-7 rounded-full ${isPerf ? 'bg-blue-600 shadow-lg' : 'bg-white opacity-20'}`}></div>
            {content}
          </h2>
        );
      } else if (trimmedLine.startsWith('#')) {
        elements.push(
          <h1 key={i} className="text-3xl font-black mt-20 mb-10 uppercase tracking-tight bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            {cleanMarkdown(trimmedLine)}
          </h1>
        );
      } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        elements.push(
          <li key={i} className="mb-4 flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0 shadow-md shadow-blue-600/20"></div>
            <span className="text-base font-semibold text-slate-200" dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine.substring(1).trim()) }} />
          </li>
        );
      } else if (trimmedLine.length > 0) {
        elements.push(
          <p key={i} className="mb-6 opacity-80 leading-relaxed text-base font-medium text-slate-300">
            <span dangerouslySetInnerHTML={{ __html: formatInline(trimmedLine) }} />
          </p>
        );
      }
    });

    if (inTable) flushTable(lines.length);
    return elements;
  };

  return (
    <div className="space-y-12">
      <div className="glass-effect rounded-[3rem] p-10 md:p-16 shadow-2xl relative border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <article className={`prose dark:prose-invert max-w-none ${isRtl ? 'prose-rtl' : ''}`}>
          {renderContent(result.text)}
        </article>
      </div>

      {result.sources.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {result.sources.slice(0, 4).map((source, idx) => (
            <a 
              key={idx} 
              href={source.url} 
              target="_blank" 
              className="group p-6 bg-slate-950 border border-white/5 rounded-[2rem] hover:border-blue-600 hover:shadow-xl transition-all flex flex-col gap-3"
            >
              <span className="text-blue-600 font-black text-xs uppercase truncate pr-6">{source.title}</span>
              <span className="opacity-40 text-[9px] font-black uppercase tracking-widest">{new URL(source.url).hostname.replace('www.', '')}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetupResult;
