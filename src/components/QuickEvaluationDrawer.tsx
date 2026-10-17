import React, { useState } from 'react';
import { StudentEvaluation } from '../types';

interface QuickEvaluationDrawerProps {
  student: StudentEvaluation;
  onClose: () => void;
  onSave: (updatedStudent: StudentEvaluation) => void;
}

export const QuickEvaluationDrawer: React.FC<QuickEvaluationDrawerProps> = ({
  student,
  onClose,
  onSave,
}) => {
  const [hifdhRange, setHifdhRange] = useState(student.newMemorization.surahRange);
  const [hifdhScore, setHifdhScore] = useState(student.newMemorization.score);
  const [nearRange, setNearRange] = useState(student.nearRevision.surahRange);
  const [nearScore, setNearScore] = useState(student.nearRevision.score);
  const [farRange, setFarRange] = useState(student.farRevision.surahRange);
  const [farScore, setFarScore] = useState(student.farRevision.score);
  const [tajweedNotes, setTajweedNotes] = useState(student.tajweed.notes);
  const [nextAssignment, setNextAssignment] = useState(student.nextAssignment);

  const handleSave = () => {
    const updated: StudentEvaluation = {
      ...student,
      newMemorization: {
        ...student.newMemorization,
        surahRange: hifdhRange,
        score: hifdhScore,
      },
      nearRevision: {
        ...student.nearRevision,
        surahRange: nearRange,
        score: nearScore,
      },
      farRevision: {
        ...student.farRevision,
        surahRange: farRange,
        score: farScore,
      },
      tajweed: {
        ...student.tajweed,
        notes: tajweedNotes,
      },
      nextAssignment,
      isEvaluatedToday: true,
      lastUpdated: 'الآن',
    };
    onSave(updated);
  };

  return (
    <div
      className="fixed inset-0 bg-[#004331]/40 backdrop-blur-xs z-50 flex justify-end transition-opacity"
      dir="rtl"
    >
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-6 bg-[#eff4ff] flex items-center justify-between border-b border-[#bfc9c2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004331] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px] text-[#85f8c4]">
                assignment_turned_in
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold text-[#0b1c30]">
                نموذج تدقيق ورصد تقييم الحافظة
              </span>
              <span className="text-xs text-[#775a19] font-semibold">
                بوابة الإشراف والاعتماد الميداني
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Form Body */}
        <div className="p-6 flex-1 space-y-4">
          {/* Target Student Card */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] flex items-center justify-between border border-[#bfc9c2]/30">
            <div className="flex items-center gap-3">
              <img
                src={student.avatarUrl}
                alt={student.studentName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-serif text-base text-[#0b1c30] font-bold">
                  {student.studentName}
                </span>
                <span className="text-xs text-[#3f4944]">
                  {student.circleName} • {student.level}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold">
              {student.track}
            </span>
          </div>

          {/* 1. Hifdh Evaluation Fieldset */}
          <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm text-[#004331] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  menu_book
                </span>
                ١. الحفظ الجديد (اليومي)
              </span>
              <span className="text-xs text-[#3f4944]">الوزن: ٥٠% من التقييم</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#3f4944]">المقرر المتلو اليوم:</label>
                <input
                  type="text"
                  value={hifdhRange}
                  onChange={(e) => setHifdhRange(e.target.value)}
                  className="w-full bg-[#eff4ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#3f4944]">الدرجة من ١٠:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={hifdhScore}
                  onChange={(e) => setHifdhScore(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#eff4ff] px-3 py-2 rounded-xl text-xs text-[#004331] font-bold border border-[#dce9ff] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Revisions Fieldsets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 space-y-2 shadow-2xs">
              <span className="font-serif text-xs text-[#775a19] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  history
                </span>
                ٢. المراجعة الصغرى
              </span>
              <input
                type="text"
                value={nearRange}
                onChange={(e) => setNearRange(e.target.value)}
                className="w-full bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs text-[#3f4944]">الدرجة:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={nearScore}
                  onChange={(e) => setNearScore(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center bg-[#eff4ff] py-1 rounded font-bold text-xs"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 space-y-2 shadow-2xs">
              <span className="font-serif text-xs text-[#005d3f] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  library_books
                </span>
                ٣. المراجعة الكبرى
              </span>
              <input
                type="text"
                value={farRange}
                onChange={(e) => setFarRange(e.target.value)}
                className="w-full bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs text-[#3f4944]">الدرجة:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={farScore}
                  onChange={(e) => setFarScore(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center bg-[#eff4ff] py-1 rounded font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Tajweed Assessment */}
          <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 space-y-2 shadow-2xs">
            <span className="font-serif text-xs text-[#0b1c30] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                record_voice_over
              </span>
              ملاحظات التجويد والوقف والابتداء
            </span>
            <textarea
              value={tajweedNotes}
              onChange={(e) => setTajweedNotes(e.target.value)}
              className="w-full bg-[#eff4ff] p-3 rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
              rows={3}
            />
          </div>

          {/* Daily Homework */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bfc9c2]/30 space-y-1">
            <span className="text-xs text-[#0b1c30] font-bold">
              مقرر وتكليف اليوم التالي:
            </span>
            <input
              type="text"
              value={nextAssignment}
              onChange={(e) => setNextAssignment(e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
            />
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 bg-[#eff4ff] border-t border-[#bfc9c2]/30 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white text-[#0b1c30] text-xs font-semibold hover:bg-[#e5eeff] transition-colors"
          >
            إلغاء الأمر
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-5 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              verified_user
            </span>
            اعتماد التقييم وحفظ السجل
          </button>
        </div>
      </div>
    </div>
  );
};
