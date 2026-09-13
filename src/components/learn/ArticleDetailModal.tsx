import React from 'react';
import { X, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import type { EducationalArticle } from '../../types';

interface ArticleDetailModalProps {
  article: EducationalArticle;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-1 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg h-[calc(100dvh-0.5rem)] max-h-[98vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex-none bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              <span>{article.readTime}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Article Body */}
        <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y no-scrollbar">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
              {article.title}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed italic border-l-2 border-violet-500 pl-3">
              {article.preview}
            </p>
          </div>

          {/* Key Takeaway Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-rose-50 border border-violet-100 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-violet-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-900">
                  Key Takeaway
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {article.keyTakeaway}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4 pt-1">
            {article.sections.map((section, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  {section.heading}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {section.body}
                </p>

                {section.highlights && (
                  <div className="pt-2 space-y-1.5">
                    {section.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-violet-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Educational Note */}
          <p className="text-[11px] text-slate-400 text-center italic">
            Mensera Educational Library • Content grounded in peer-reviewed physiological research
          </p>
        </div>
      </div>
    </div>
  );
};
