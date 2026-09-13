import React from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Stethoscope,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MedicalSafetyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { exportDataCSV } = useApp();

  const redFlags = [
    {
      title: 'Very Heavy Bleeding (Menorrhagia)',
      desc: 'Soaking through one or more menstrual pads or tampons every hour for several consecutive hours, or passing clots larger than a quarter.',
    },
    {
      title: 'Severe, Debilitating Pelvic Pain',
      desc: 'Cramps that cause fainting, vomiting, don’t respond to standard pain relievers, or keep you from work, school, or routine daily activities.',
    },
    {
      title: 'Major Cycle Irregularities or Missing Periods',
      desc: 'Periods that suddenly stop for 90+ days (when not pregnant), cycles consistently shorter than 21 days or longer than 38 days, or bleeding between periods.',
    },
    {
      title: 'Fainting or Extreme Dizziness',
      desc: 'Feeling faint, severe lightheadedness upon standing, or paleness and shortness of breath (possible signs of iron-deficiency anemia).',
    },
    {
      title: 'Sudden Changes or Severe Mood Symptoms',
      desc: 'Severe depression, panic, hopelessness, or rage that reliably occurs before your period and vanishes shortly after bleeding (suggestive of PMDD).',
    },
  ];

  const doctorQuestions = [
    'How long has this symptom or cycle shift been occurring?',
    'Does the pain correlate specifically with ovulation, pre-period, or during bleeding?',
    'Could symptoms be related to conditions like Endometriosis, PCOS, or Fibroids?',
    'Should we check a complete blood count (CBC) and ferritin for iron levels?',
  ];

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
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                When to Seek Medical Advice
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Health safety, red flags & advocacy guide
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

        {/* Content Body */}
        <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y no-scrollbar">
          {/* Primary Legal & Safety Disclaimer Card */}
          <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200/80 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-950 leading-relaxed font-semibold">
                “This app provides general educational and wellness information. It is not a
                substitute for professional medical advice, diagnosis, or treatment.”
              </p>
            </div>
          </div>

          {/* Red Flag Symptoms to Discuss with a Doctor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope size={14} className="text-violet-600" />
              <span>Red Flag Symptoms That Warrant Clinical Evaluation</span>
            </h4>
            <div className="space-y-2">
              {redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs"
                >
                  <h5 className="text-xs font-bold text-slate-800">{flag.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{flag.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Discussion Guide & Data Export */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-600" />
              <span>Preparing for Your OB/GYN or GP Visit</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Having accurate symptom records transforms doctor visits from vague memory into clear
              clinical data.
            </p>

            <div className="space-y-1.5 pt-1">
              {doctorQuestions.map((q, qIdx) => (
                <div key={qIdx} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-violet-600 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>

            <button
              onClick={exportDataCSV}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-bold border border-violet-200 flex items-center justify-center gap-1.5"
            >
              <FileText size={14} />
              <span>Export My Cycle Logs CSV for My Doctor</span>
            </button>
          </div>

          {/* Empowering Note */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Info size={14} className="text-violet-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold text-slate-800">You deserve to be heard:</span> Severe
              pain is not just "part of being a woman." If a healthcare provider dismisses your
              symptoms, it is entirely reasonable to seek a second opinion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
