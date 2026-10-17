import React from 'react';
import { SUPERVISOR_INFO, STATS_SUMMARY } from '../data/mockData';
import { StudentEvaluation } from '../types';

interface SupervisorDashboardViewProps {
  students: StudentEvaluation[];
  onOpenDetailedModal: (student: StudentEvaluation) => void;
  onNavigateToTracking: () => void;
  onShowToast: (message: string) => void;
}

export const SupervisorDashboardView: React.FC<SupervisorDashboardViewProps> = ({
  students,
  onOpenDetailedModal,
  onNavigateToTracking,
  onShowToast,
}) => {
  const topStudents = [...students]
    .sort((a, b) => b.newMemorization.score - a.newMemorization.score)
    .slice(0, 3);

  const pendingStudents = students.filter(
    (s) => s.newMemorization.score === 0 && s.attendance === 'present'
  );

  const strugglingStudents = students.filter(
    (s) => s.newMemorization.verbalErrors >= 2 || s.newMemorization.score < 8.8
  );

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Welcome Banner */}
      <section className="p-6 rounded-3xl bg-gradient-to-l from-[#004331] to-[#0d5c46] text-white shadow-md relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={SUPERVISOR_INFO.avatarUrl}
              alt="المشرفة"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#85f8c4]/60 shadow-md"
            />
            <div className="text-right">
              <span className="text-xs text-[#85f8c4] font-bold">
                أهلاً وسهلاً بكِ في حلقة الفردوس
              </span>
              <h1 className="font-serif text-2xl font-bold mt-0.5">
                {SUPERVISOR_INFO.name}
              </h1>
              <p className="text-xs text-white/80 mt-1">
                {SUPERVISOR_INFO.hijriDate} • جلسة الفجر منتظمة والإنجاز الشهري{' '}
                {STATS_SUMMARY.monthlyPercentage}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToTracking}
              className="px-5 py-2.5 rounded-xl bg-[#85f8c4] hover:bg-[#aaf1d4] text-[#004331] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                playlist_add_check
              </span>
              فتح سجل الرصد الميداني
            </button>
            <button
              onClick={() => onShowToast('تم إرسال تذكير التسميع لجميع الحافظات بنجاح')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                notifications_active
              </span>
              إرسال تذكير للجلسة
            </button>
          </div>
        </div>
      </section>

      {/* Grid of 4 Key Operations */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f4944] font-medium">
              نسبة إنجاز النصاب الشهري
            </span>
            <span className="p-2 rounded-xl bg-[#eff4ff] text-[#004331]">
              <span className="material-symbols-outlined text-[20px]">
                verified
              </span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#004331]">
              {STATS_SUMMARY.monthlyPercentage}%
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              +٤% عن الأسبوع الماضي
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[#0d5c46] rounded-full"
              style={{ width: `${STATS_SUMMARY.monthlyPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f4944] font-medium">
              جلسات التسميع المعتمدة
            </span>
            <span className="p-2 rounded-xl bg-[#eff4ff] text-[#775a19]">
              <span className="material-symbols-outlined text-[20px]">
                task_alt
              </span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#0b1c30]">
              ١٨ / ٢٤
            </span>
            <span className="text-[11px] text-[#3f4944]">حافظة تم تدقيقها</span>
          </div>
          <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[#775a19] rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f4944] font-medium">
              مؤشر إتقان التجويد العام
            </span>
            <span className="p-2 rounded-xl bg-[#eff4ff] text-[#005d3f]">
              <span className="material-symbols-outlined text-[20px]">
                record_voice_over
              </span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#005d3f]">
              ٩٤.٢%
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              مرتبة الامتياز
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#eff4ff] rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[#005d3f] rounded-full"
              style={{ width: '94.2%' }}
            ></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3f4944] font-medium">
              موعد اختبار التثبيت
            </span>
            <span className="p-2 rounded-xl bg-[#eff4ff] text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">
                event_upcoming
              </span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold text-[#0b1c30]">
              الخميس القادم
            </span>
            <span className="text-[11px] text-[#775a19]">الحزب السابع</span>
          </div>
          <span className="text-[11px] text-[#6f7974] block mt-2">
            لجنة التقييم الثلاثية المعتمدة
          </span>
        </div>
      </section>

      {/* Main 2 Columns: Recitation Queue & Top Achievers */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recitation Queue & Action Center */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004331] text-[24px]">
                  record_voice_over
                </span>
                <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                  طابور التسميع المباشر لجلسة اليوم
                </h3>
              </div>
              <button
                onClick={onNavigateToTracking}
                className="text-xs text-[#004331] font-bold hover:underline"
              >
                عرض الجدول الكامل ←
              </button>
            </div>

            <div className="space-y-3">
              {students.slice(0, 4).map((student, idx) => (
                <div
                  key={student.studentId}
                  className="p-3.5 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#eff4ff] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#004331] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={student.avatarUrl}
                      alt={student.studentName}
                      className="w-10 h-10 rounded-full object-cover border border-[#bfc9c2]/40"
                    />
                    <div className="flex flex-col text-right">
                      <span className="font-serif text-sm font-bold text-[#0b1c30]">
                        {student.studentName}
                      </span>
                      <span className="text-xs text-[#3f4944]">
                        {student.newMemorization.surahRange} •{' '}
                        {student.newMemorization.pagesAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs font-bold text-[#004331] bg-white px-3 py-1 rounded-lg border border-[#bfc9c2]/30">
                      {student.newMemorization.score > 0
                        ? `${student.newMemorization.score}/١٠ (${student.newMemorization.ratingLabel})`
                        : 'جاهزة للتسميع'}
                    </span>
                    <button
                      onClick={() => onOpenDetailedModal(student)}
                      className="px-3 py-1.5 rounded-xl bg-[#0d5c46] hover:bg-[#004331] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        mic
                      </span>
                      بدء الرصد
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Attention Students */}
          <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">
                  warning
                </span>
                <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                  حالات تحتاج متابعة وتثبيت إضافي
                </h3>
              </div>
              <span className="text-xs text-[#6f7974]">
                {strugglingStudents.length} حافظات
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strugglingStudents.map((st) => (
                <div
                  key={st.studentId}
                  className="p-3.5 rounded-2xl bg-[#eff4ff]/60 border border-[#fed488] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={st.avatarUrl}
                      alt={st.studentName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-[#0b1c30]">
                        {st.studentName}
                      </span>
                      <span className="text-[11px] text-[#775a19]">
                        {st.tajweed.notes.substring(0, 35)}...
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenDetailedModal(st)}
                    className="p-1.5 rounded-lg bg-white text-[#004331] hover:bg-[#eff4ff] border border-[#bfc9c2]/30"
                    title="تعديل الخطة"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers & Ring Insights */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#775a19] text-[24px]">
                workspace_premium
              </span>
              <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                المتميزات في حلقة الفردوس
              </h3>
            </div>

            <div className="space-y-3">
              {topStudents.map((student, rank) => (
                <div
                  key={student.studentId}
                  className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        rank === 0
                          ? 'bg-[#fed488] text-[#785a1a]'
                          : rank === 1
                          ? 'bg-[#dce9ff] text-[#004331]'
                          : 'bg-[#eff4ff] text-[#775a19]'
                      }`}
                    >
                      {rank === 0 ? '👑' : rank + 1}
                    </span>
                    <img
                      src={student.avatarUrl}
                      alt={student.studentName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-[#0b1c30]">
                        {student.studentName}
                      </span>
                      <span className="text-[11px] text-[#3f4944]">
                        {student.track} • {student.level}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#004331] bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                    {student.newMemorization.score} / ١٠
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tools Box */}
          <div className="p-6 rounded-3xl bg-[#eff4ff] border border-[#dce9ff] space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#004331]">
              إجراءات سريعة للمشرفة
            </h4>
            <div className="space-y-2">
              <button
                onClick={() =>
                  onShowToast('تم تصدير ملف درجات الجلسة اليومية بصيغة Excel')
                }
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#dce9ff] text-right text-xs font-bold text-[#0b1c30] flex items-center justify-between border border-[#bfc9c2]/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#004331]">
                    download
                  </span>
                  تصدير تقرير الجلسة اليومية (Excel)
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#6f7974]">
                  arrow_back_ios
                </span>
              </button>

              <button
                onClick={() =>
                  onShowToast('تم إرسال بطاقات الشكر لجميع الطالبات المتميزات')
                }
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#dce9ff] text-right text-xs font-bold text-[#0b1c30] flex items-center justify-between border border-[#bfc9c2]/30 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#775a19]">
                    loyalty
                  </span>
                  إرسال بطاقات تحفيزية للأوائل
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#6f7974]">
                  arrow_back_ios
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
