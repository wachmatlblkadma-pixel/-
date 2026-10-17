import React, { useState } from 'react';
import { StudentEvaluation } from '../types';

interface DetailedEvaluationModalProps {
  student: StudentEvaluation;
  onClose: () => void;
  onSave: (updatedStudent: StudentEvaluation, isDraft: boolean) => void;
  onOpenWhatsAppPreview: (student: StudentEvaluation) => void;
}

export const DetailedEvaluationModal: React.FC<DetailedEvaluationModalProps> = ({
  student,
  onClose,
  onSave,
  onOpenWhatsAppPreview,
}) => {
  // Local state for interactive editing inside the modal
  const [formData, setFormData] = useState<StudentEvaluation>({
    ...student,
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingNote, setIsRecordingNote] = useState(false);

  const calculateTotalScore = () => {
    // 50% New Mem, 25% Near Rev, 25% Far Rev
    const newScore = formData.newMemorization.score || 0;
    const nearScore = formData.nearRevision.score || 0;
    const farScore = formData.farRevision.score || 0;
    const total = newScore * 0.5 + nearScore * 0.25 + farScore * 0.25;
    return Number(total.toFixed(1));
  };

  const handleAttendanceChange = (status: StudentEvaluation['attendance']) => {
    setFormData((prev) => ({
      ...prev,
      attendance: status,
    }));
  };

  const appendNoteTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tajweed: {
        ...prev.tajweed,
        notes: prev.tajweed.notes
          ? `${prev.tajweed.notes}، ${tag}`
          : tag,
      },
    }));
  };

  const totalScore = calculateTotalScore();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#004331]/60 backdrop-blur-sm overflow-y-auto"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#bfc9c2]/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#eff4ff] px-6 py-4 border-b border-[#bfc9c2]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#004331] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[28px] text-[#85f8c4]">
                menu_book
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl text-[#0b1c30] font-bold">
                  رصد وتوثيق التقييم اليومي للحافظة
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#005137] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#005d3f] animate-ping"></span>
                  جلسة نشطة ومباشرة 🟢
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[#3f4944] text-xs font-medium">
                <span>
                  الحافظة:{' '}
                  <strong className="text-[#004331] font-bold">
                    {formData.studentName}
                  </strong>
                </span>
                <span className="text-[#bfc9c2]">•</span>
                <span>{formData.circleName}</span>
                <span className="text-[#bfc9c2]">•</span>
                <span>الثلاثاء ١٤ شعبان ١٤٤٦هـ</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            title="إغلاق النافذة"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 font-sans text-sm">
          {/* الفرع الأول: الحفظ الجديد */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#0d5c46]/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-[#bfc9c2]/30 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004331] text-[22px]">
                  auto_stories
                </span>
                <h3 className="font-serif text-base text-[#004331] font-bold">
                  الفرع الأول: الحفظ الجديد (New Memorization)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#004331]/10 text-[#004331] text-xs font-bold">
                  الوزن: ٥٠% من التقييم
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#0d5c46] text-white font-bold text-sm shadow-sm flex items-center gap-1">
                  <span>{formData.newMemorization.score} / ١٠</span>
                  <span className="text-xs text-[#85f8c4]">
                    • {formData.newMemorization.ratingLabel}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Portion */}
              <div className="bg-white p-3 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                <label className="text-[11px] text-[#3f4944] block mb-1 font-medium">
                  السورة والآيات المحددة:
                </label>
                <div className="flex items-center justify-between font-bold text-[#0b1c30]">
                  <input
                    type="text"
                    value={formData.newMemorization.surahRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newMemorization: {
                          ...formData.newMemorization,
                          surahRange: e.target.value,
                        },
                      })
                    }
                    className="w-full font-bold text-[#0b1c30] bg-transparent focus:outline-none focus:bg-[#eff4ff] rounded px-1"
                  />
                  <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                    verified
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-white p-3 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                <label className="text-[11px] text-[#3f4944] block mb-1 font-medium">
                  المقدار والصفحات:
                </label>
                <div className="flex items-center justify-between font-bold text-[#0b1c30]">
                  <input
                    type="text"
                    value={formData.newMemorization.pagesAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newMemorization: {
                          ...formData.newMemorization,
                          pagesAmount: e.target.value,
                        },
                      })
                    }
                    className="w-full font-bold text-[#0b1c30] bg-transparent focus:outline-none focus:bg-[#eff4ff] rounded px-1"
                  />
                  <span className="text-xs text-[#005d3f] font-semibold bg-[#85f8c4]/40 px-2 py-0.5 rounded-full">
                    مكتمل ✓
                  </span>
                </div>
              </div>

              {/* Errors & Warnings */}
              <div className="bg-white p-3 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                <span className="text-[11px] text-[#3f4944] block mb-1 font-medium">
                  الأخطاء والتنبيهات:
                </span>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span>أخطاء لفظية:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMemorization: {
                            ...formData.newMemorization,
                            verbalErrors: Math.max(
                              0,
                              formData.newMemorization.verbalErrors - 1
                            ),
                          },
                        })
                      }
                      className="w-5 h-5 rounded bg-[#eff4ff] text-[#004331] font-bold"
                    >
                      -
                    </button>
                    <strong className="text-[#ba1a1a] font-bold text-sm">
                      {formData.newMemorization.verbalErrors}
                    </strong>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMemorization: {
                            ...formData.newMemorization,
                            verbalErrors:
                              formData.newMemorization.verbalErrors + 1,
                          },
                        })
                      }
                      className="w-5 h-5 rounded bg-[#eff4ff] text-[#004331] font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>تنبيهات:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMemorization: {
                            ...formData.newMemorization,
                            warningCount: Math.max(
                              0,
                              formData.newMemorization.warningCount - 1
                            ),
                          },
                        })
                      }
                      className="w-5 h-5 rounded bg-[#eff4ff] text-[#004331] font-bold"
                    >
                      -
                    </button>
                    <strong className="text-[#775a19] font-bold text-sm">
                      {formData.newMemorization.warningCount}
                    </strong>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMemorization: {
                            ...formData.newMemorization,
                            warningCount:
                              formData.newMemorization.warningCount + 1,
                          },
                        })
                      }
                      className="w-5 h-5 rounded bg-[#eff4ff] text-[#004331] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Slider & Rating Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#3f4944] font-medium">
                  تعديل الدرجة:
                </span>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={formData.newMemorization.score}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    let label = 'متقن';
                    if (val >= 9.8) label = 'ممتاز مرتفع (متقن)';
                    else if (val >= 9.0) label = 'ممتاز';
                    else if (val >= 8.0) label = 'جيد جداً';
                    else label = 'يحتاج تثبيت';
                    setFormData({
                      ...formData,
                      newMemorization: {
                        ...formData.newMemorization,
                        score: val,
                        ratingLabel: label,
                      },
                    });
                  }}
                  className="w-32 accent-[#004331] cursor-pointer"
                />
                <span className="font-bold text-[#004331]">
                  {formData.newMemorization.score} / ١٠
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {['ممتاز مرتفع (متقن)', 'ممتاز', 'جيد جداً', 'إعادة تسميع'].map(
                  (badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMemorization: {
                            ...formData.newMemorization,
                            ratingLabel: badge,
                          },
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        formData.newMemorization.ratingLabel === badge
                          ? 'bg-[#0d5c46] text-white'
                          : 'bg-white hover:bg-[#e5eeff] text-[#3f4944]'
                      }`}
                    >
                      {badge}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* الفرع الثاني & الثالث: المراجعة الصغرى والكبرى */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Near Revision */}
            <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bfc9c2]/30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#bfc9c2]/30">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">
                    history
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#0b1c30]">
                    الفرع الثاني: المراجعة الصغرى (القريبة)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#005137] text-xs font-bold">
                  {formData.nearRevision.ratingLabel}
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#3f4944]">المقرر:</span>
                  <input
                    type="text"
                    value={formData.nearRevision.surahRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nearRevision: {
                          ...formData.nearRevision,
                          surahRange: e.target.value,
                        },
                      })
                    }
                    className="font-bold text-[#0b1c30] text-left bg-transparent border-b border-dashed border-[#bfc9c2] focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#3f4944]">درجة الإتقان والطلاقة:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.nearRevision.score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nearRevision: {
                            ...formData.nearRevision,
                            score: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-14 text-center font-bold text-[#004331] text-sm bg-white rounded border border-[#bfc9c2]/30"
                    />
                    <span className="font-bold text-[#004331]">/ ١٠</span>
                  </div>
                </div>
                <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#0d5c46] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(formData.nearRevision.score / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Far Revision */}
            <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bfc9c2]/30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#bfc9c2]/30">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#005d3f] text-[20px]">
                    library_books
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#0b1c30]">
                    الفرع الثالث: المراجعة الكبرى (البعيدة)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  ختم تثبيت السرد
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#3f4944]">المقرر التراكمي:</span>
                  <input
                    type="text"
                    value={formData.farRevision.surahRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        farRevision: {
                          ...formData.farRevision,
                          surahRange: e.target.value,
                        },
                      })
                    }
                    className="font-bold text-[#0b1c30] text-left bg-transparent border-b border-dashed border-[#bfc9c2] focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#3f4944]">درجة السرد بدون تردد:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.farRevision.score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          farRevision: {
                            ...formData.farRevision,
                            score: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-14 text-center font-bold text-[#004331] text-sm bg-white rounded border border-[#bfc9c2]/30"
                    />
                    <span className="font-bold text-[#004331]">
                      / ١٠ (امتياز تام)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#005d3f] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(formData.farRevision.score / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* الفرع الرابع: تقييم التجويد والمخارج والأداء الصوتي */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bfc9c2]/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#775a19] text-[20px]">
                  record_voice_over
                </span>
                <h4 className="font-serif text-sm font-bold text-[#0b1c30]">
                  الفرع الرابع: تقييم التجويد والمخارج والأداء الصوتي
                </h4>
              </div>
              <span className="text-xs text-[#775a19] font-semibold">
                معايير التدقيق المهاري
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Criterion 1 */}
              <div className="bg-white p-2.5 rounded-xl border border-[#bfc9c2]/30 flex flex-col items-center text-center">
                <span className="text-xs text-[#3f4944] mb-1 font-medium">
                  مخارج الحروف وصفاتها
                </span>
                <select
                  value={formData.tajweed.makhaarij}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tajweed: {
                        ...formData.tajweed,
                        makhaarij: e.target
                          .value as StudentEvaluation['tajweed']['makhaarij'],
                      },
                    })
                  }
                  className="px-2.5 py-1 rounded-full bg-[#85f8c4]/50 text-[#005137] font-bold text-xs cursor-pointer focus:outline-none"
                >
                  <option value="ممتاز">ممتاز ✓</option>
                  <option value="متقن">متقن ✓</option>
                  <option value="متميز">متميز ✓</option>
                  <option value="جيد">جيد</option>
                  <option value="يحتاج مراجعة">يحتاج مراجعة</option>
                </select>
              </div>

              {/* Criterion 2 */}
              <div className="bg-white p-2.5 rounded-xl border border-[#bfc9c2]/30 flex flex-col items-center text-center">
                <span className="text-xs text-[#3f4944] mb-1 font-medium">
                  أحكام النون والتنوين والمدود
                </span>
                <select
                  value={formData.tajweed.ahkam}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tajweed: {
                        ...formData.tajweed,
                        ahkam: e.target
                          .value as StudentEvaluation['tajweed']['ahkam'],
                      },
                    })
                  }
                  className="px-2.5 py-1 rounded-full bg-[#85f8c4]/50 text-[#005137] font-bold text-xs cursor-pointer focus:outline-none"
                >
                  <option value="ممتاز">ممتاز ✓</option>
                  <option value="متقن">متقن ✓</option>
                  <option value="متميز">متميز ✓</option>
                  <option value="جيد">جيد</option>
                  <option value="يحتاج مراجعة">يحتاج مراجعة</option>
                </select>
              </div>

              {/* Criterion 3 */}
              <div className="bg-white p-2.5 rounded-xl border border-[#bfc9c2]/30 flex flex-col items-center text-center">
                <span className="text-xs text-[#3f4944] mb-1 font-medium">
                  الوقف والابتداء وحسن الترتيل
                </span>
                <select
                  value={formData.tajweed.waqf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tajweed: {
                        ...formData.tajweed,
                        waqf: e.target
                          .value as StudentEvaluation['tajweed']['waqf'],
                      },
                    })
                  }
                  className="px-2.5 py-1 rounded-full bg-[#fed488] text-[#785a1a] font-bold text-xs cursor-pointer focus:outline-none"
                >
                  <option value="ممتاز">ممتاز ✓</option>
                  <option value="متقن">متقن ✓</option>
                  <option value="متميز">متميز ✓</option>
                  <option value="جيد">جيد</option>
                  <option value="يحتاج مراجعة">يحتاج مراجعة</option>
                </select>
              </div>
            </div>

            {/* Quick Skill Add Tag Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#3f4944]">إضافة إشادة سريعة:</span>
              {[
                'زمن الغنة متقن',
                'تفخيم حروف الاستعلاء',
                'قلقلة صغرى مضبوطة',
                'حسن الوقف والابتداء',
                'توسط المنفصل',
                'سلامة صفير الصاد والزاي',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => appendNoteTag(tag)}
                  className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-[#e5eeff] text-[#004331] text-[11px] font-medium border border-[#bfc9c2]/30 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1">
              <label className="text-xs text-[#3f4944] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#004331]">
                  edit_note
                </span>
                ملاحظات المشرفة التوجيهية للحافظة:
              </label>
              <textarea
                value={formData.tajweed.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tajweed: {
                      ...formData.tajweed,
                      notes: e.target.value,
                    },
                  })
                }
                className="w-full bg-white p-3 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none focus:border-[#004331] focus:ring-2 focus:ring-[#004331]/10 transition-all"
                rows={2}
              />
            </div>

            {/* Voice Recitation Simulator Bar */}
            <div className="p-2.5 rounded-xl bg-white border border-[#bfc9c2]/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-[#ba1a1a] text-white animate-pulse'
                      : 'bg-[#004331] text-white hover:bg-[#0d5c46]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingAudio ? 'stop' : 'play_arrow'}
                  </span>
                  <span>
                    {isPlayingAudio
                      ? 'إيقاف التلاوة المسجلة'
                      : 'الاستماع لمقطع تلاوة الحافظة'}
                  </span>
                </button>
                <span className="text-[11px] text-[#3f4944]">
                  تسجيل جلسة الفجر (٠٢:١٤ دقيقة)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordingNote(!isRecordingNote)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  isRecordingNote
                    ? 'bg-[#ba1a1a]/10 text-[#ba1a1a] font-bold border border-[#ba1a1a]'
                    : 'bg-[#eff4ff] text-[#004331] hover:bg-[#e5eeff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  mic
                </span>
                <span>
                  {isRecordingNote
                    ? 'جارٍ تسجيل توجيه صوتي للمشرفة...'
                    : 'تسجيل ملاحظة صوتية'}
                </span>
              </button>
            </div>
          </div>

          {/* الفرع الخامس: الحضور والمواظبة اليومية */}
          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bfc9c2]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#0b1c30] block mb-2">
                الفرع الخامس: الحضور والمواظبة اليومية
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'present', label: 'حاضرة في الموعد', icon: 'check' },
                  { id: 'late', label: 'متأخرة', icon: 'schedule' },
                  { id: 'excused', label: 'معذورة', icon: 'event_busy' },
                  { id: 'absent', label: 'غائبة', icon: 'close' },
                ].map((item) => {
                  const isSelected = formData.attendance === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleAttendanceChange(
                          item.id as StudentEvaluation['attendance']
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? item.id === 'present'
                            ? 'bg-[#0d5c46] text-white shadow-xs'
                            : item.id === 'excused'
                            ? 'bg-[#775a19] text-white shadow-xs'
                            : item.id === 'late'
                            ? 'bg-[#fed488] text-[#785a1a] shadow-xs'
                            : 'bg-[#ba1a1a] text-white shadow-xs'
                          : 'bg-white hover:bg-[#e5eeff] text-[#3f4944]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start sm:items-end">
              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={formData.sendWhatsAppNotice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sendWhatsAppNotice: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-[#004331] focus:ring-[#004331]"
                />
                <span className="text-xs text-[#0b1c30] font-semibold">
                  إرسال إشعار التقييم لولي الأمر والحافظة عبر واتساب والبوابة
                </span>
              </label>
              {formData.sendWhatsAppNotice && (
                <button
                  type="button"
                  onClick={() => onOpenWhatsAppPreview(formData)}
                  className="text-[11px] text-[#004331] font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    visibility
                  </span>
                  معاينة نص تقرير الواتساب
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#eff4ff] border-t border-[#bfc9c2]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#e5eeff] text-[#0b1c30] text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => onSave(formData, true)}
              className="px-4 py-2 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-[#004331] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                drafts
              </span>
              <span>حفظ كمسودة</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSave(formData, false)}
            className="px-5 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
              verified
            </span>
            <span>اعتماد ورصد التقييم النهائي ({totalScore}/١٠)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
