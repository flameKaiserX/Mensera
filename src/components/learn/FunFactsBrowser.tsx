import React, { useState } from 'react';
import { X, Lightbulb, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { FUN_FACTS } from '../../data/funFactsData';
import type { FunFact } from '../../types';

export const FunFactsBrowser: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const categories = [
    'All',
    'Periods',
    'Hormones',
    'Exercise',
    'Nutrition',
    'Sleep',
    'PMS',
    'Ovulation',
    'Common Myths',
    'Female Physiology',
  ];

  const filteredFacts =
    selectedCategory === 'All'
      ? FUN_FACTS
      : FUN_FACTS.filter((f) => f.category === selectedCategory);

  const currentFact: FunFact = filteredFacts[currentIndex] || filteredFacts[0] || FUN_FACTS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredFacts.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredFacts.length - 1));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`💡 ${currentFact.title}: ${currentFact.fact} (Source: ${currentFact.source}) - via Mensera`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-1 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-md h-[calc(100dvh-0.5rem)] max-h-[98vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col justify-between"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex-none bg-[#FAF7F2]/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Lightbulb size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Did You Know? Explorer
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Short, science-backed body facts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Pills Slider */}
        <div className="flex-none px-4 py-2 border-b border-slate-200/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Fact Card Presentation */}
        <div className="p-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y no-scrollbar flex flex-col justify-center items-center text-center">
          <div className="w-full bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md relative overflow-hidden transition-all duration-300">
            {/* Category Tag & Counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                {currentFact.category}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentIndex + 1} / {filteredFacts.length}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug">
              {currentFact.title}
            </h4>

            {/* Fact Body */}
            <p className="text-sm text-slate-600 mt-3 leading-relaxed font-medium">
              “{currentFact.fact}”
            </p>

            {/* Source */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-left">
              <div className="flex-1 pr-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Scientific Source
                </span>
                <span className="text-[11px] font-semibold text-slate-700 italic">
                  {currentFact.source}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Copy fact to clipboard"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50"
              aria-label="Previous fact"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs font-bold text-slate-500">Swipe or Click</span>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs hover:bg-slate-50"
              aria-label="Next fact"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 border-t border-slate-200/80 bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
