import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ShieldAlert,
  Apple,
  Lightbulb,
  Activity,
  MessageCircle,
} from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../../data/educationData';
import type { EducationalArticle } from '../../types';
import { ArticleDetailModal } from './ArticleDetailModal';
import { NutritionGuidanceModal } from './NutritionGuidanceModal';
import { MedicalSafetyModal } from './MedicalSafetyModal';
import { FunFactsBrowser } from './FunFactsBrowser';
import { useApp } from '../../context/AppContext';

export const LearnScreen: React.FC<{ onOpenChat: () => void }> = ({ onOpenChat }) => {
  const { openModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showFactsModal, setShowFactsModal] = useState(false);

  const categories = ['All', 'Biology', 'Fitness', 'Wellness', 'Myths', 'Medical'];

  const filteredArticles = EDUCATIONAL_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.sections.some((s) =>
        s.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-4 py-3 space-y-4 animate-fadeIn pb-6">
      {/* Search & Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Education & Knowledge
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Understand your body’s biology, fitness, and nutrition
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hormones, training, PMS, cramps..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenChat}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-violet-700 to-rose-600 text-white text-left shadow-md flex items-center justify-between gap-3"
      >
        <span className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-white/15"><MessageCircle size={19} /></span>
          <span>
            <span className="block text-sm font-extrabold">Ask Mensera Guide</span>
            <span className="block text-[11px] text-violet-100 mt-0.5">Questions about cycles, symptoms, movement, and more</span>
          </span>
        </span>
        <ArrowRight size={17} />
      </button>

      {/* 4 Interactive Feature Jump Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 4 Phases Explorer */}
        <button
          onClick={() => openModal('phases-explorer')}
          className="p-3.5 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 text-white text-left shadow-xs hover:opacity-95 transition-all flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <Activity size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">4 Cycle Phases</h4>
            <p className="text-[10px] text-violet-100 mt-0.5">Deep biological guide</p>
          </div>
        </button>

        {/* Phase Nutrition */}
        <button
          onClick={() => setShowNutritionModal(true)}
          className="p-3.5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-left shadow-xs hover:opacity-95 transition-all flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <Apple size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Phase Nutrition</h4>
            <p className="text-[10px] text-emerald-100 mt-0.5">Fueling without diets</p>
          </div>
        </button>

        {/* Did You Know? Facts */}
        <button
          onClick={() => setShowFactsModal(true)}
          className="p-3.5 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-left shadow-xs hover:opacity-95 transition-all flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <Lightbulb size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Did You Know?</h4>
            <p className="text-[10px] text-amber-100 mt-0.5">Short science facts</p>
          </div>
        </button>

        {/* Medical Safety */}
        <button
          onClick={() => setShowMedicalModal(true)}
          className="p-3.5 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-700 text-white text-left shadow-xs hover:opacity-95 transition-all flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Medical Advice</h4>
            <p className="text-[10px] text-rose-100 mt-0.5">Red flags & doctor guide</p>
          </div>
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Educational Guides ({filteredArticles.length})
          </span>
          <span className="text-[11px] text-slate-400">Tap to read</span>
        </div>

        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock size={11} />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-800 mt-2 group-hover:text-violet-700 transition-colors">
              {article.title}
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
              {article.preview}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-600">
              <span className="text-[11px] text-slate-400 font-normal">
                {article.sections.length} Key Sections
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Read Guide</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {activeArticle && (
        <ArticleDetailModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}

      {showNutritionModal && (
        <NutritionGuidanceModal onClose={() => setShowNutritionModal(false)} />
      )}

      {showMedicalModal && (
        <MedicalSafetyModal onClose={() => setShowMedicalModal(false)} />
      )}

      {showFactsModal && (
        <FunFactsBrowser onClose={() => setShowFactsModal(false)} />
      )}
    </div>
  );
};
