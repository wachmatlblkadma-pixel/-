import React, { useState } from 'react';
import { StudentEvaluation } from '../types';

interface StudentPortalViewProps {
  students: StudentEvaluation[];
  onShowToast: (msg: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  onShowToast,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.studentId || 'st-01'
  );
  const [showCertificate, setShowCertificate] = useState(false);

  const student =
    students.find((s) => s.studentId === selectedStudentId) || students[0];

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* View-Only Security Notice Banner */}
      <section className="p-4 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#775a19] text-[24px]">
            visibility
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#0b1c30]">
              بوابة استعراض الحافظة وولي الأمر (وضع القراءة والاطلاع فقط)
            </span>
            <span className="text-[11px] text-[#3f4944]">
              يتم استعراض السجل والدرجات فور اعتمادها رسمياً من مشرفة الحلقة.
            </span>
          </div>
        </div>

        {/* Student Switcher for Demo */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#3f4944] font-medium">
            استعراض ملف:
          </span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-white text-xs font-bold text-[#004331] px-3 py-1.5 rounded-xl border border-[#bfc9c2]/40 shadow-2xs cursor-pointer focus:outline-none"
          >
            {students.map((st) => (
              <option key={st.studentId} value={st.studentId}>
                {st.studentName} ({st.level})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Student Profile & Progress Overview */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.studentName}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-[#85f8c4]/40 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
                  {student.studentName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  {student.track}
                </span>
              </div>
              <span className="text-xs text-[#3f4944] mt-1">
                {student.circleName} • المرتبة المعتمدة:{' '}
                <strong className="text-[#004331]">{student.level}</strong>
              </span>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="bg-[#85f8c4]/40 text-[#005137] px-2 py-0.5 rounded-md font-bold">
                  حالة اليوم: حاضر في الموعد ✓
                </span>
                <span className="text-[#6f7974]">هاتف المتابعة: {student.parentPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
                military_tech
              </span>
              شهادة الإتقان والتقدم
            </button>
          </div>
        </div>
      </section>

      {/* 30-Juz Visual Completion Grid */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bfc9c2]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004331] text-[22px]">
              auto_stories
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              خريطة إنجاز وتثبيت أجزاء المصحف الشريف (٣٠ جزءاً)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#004331]"></span>
              متقن ومجاز بالسند
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#fed488]"></span>
              قيد المراجعة والتثبيت
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#eff4ff] border border-[#bfc9c2]"></span>
              مجدول لاحقاً
            </span>
          </div>
        </div>

        {/* 30 Juz interactive blocks */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const isCompleted = juz <= (student.studentId === 'st-01' ? 18 : juz <= 10 ? 10 : 4);
            const isCurrent = juz === (student.studentId === 'st-01' ? 19 : 11);

            return (
              <div
                key={juz}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isCompleted
                    ? 'bg-[#004331] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#fed488] text-[#785a1a] font-bold ring-2 ring-[#775a19]'
                    : 'bg-[#eff4ff] text-[#3f4944]'
                }`}
              >
                <span className="text-[10px] opacity-80">جزء</span>
                <span className="font-serif font-bold text-sm">{juz}</span>
                <span className="text-[9px] mt-0.5">
                  {isCompleted ? '✓ متقن' : isCurrent ? 'الآن' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Today's Evaluation Transcript */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              بطاقة تقييم جلسة اليوم (الثلاثاء ١٤ شعبان)
            </h3>
            <span className="px-3 py-1 rounded-full bg-[#85f8c4]/40 text-[#005137] text-xs font-bold">
              معتمد من المشرفة ✓
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] flex justify-between items-center">
              <div>
                <span className="text-[11px] text-[#3f4944] block">الحفظ الجديد:</span>
                <span className="font-bold text-xs sm:text-sm text-[#0b1c30]">
                  {student.newMemorization.surahRange}
                </span>
              </div>
              <span className="font-bold text-[#004331] text-base">
                {student.newMemorization.score} / ١٠
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#eff4ff] flex justify-between items-center">
              <div>
                <span className="text-[11px] text-[#3f4944] block">المراجعة الصغرى:</span>
                <span className="font-bold text-xs sm:text-sm text-[#0b1c30]">
                  {student.nearRevision.surahRange}
                </span>
              </div>
              <span className="font-bold text-[#775a19] text-base">
                {student.nearRevision.score} / ١٠
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#eff4ff] flex justify-between items-center">
              <div>
                <span className="text-[11px] text-[#3f4944] block">المراجعة الكبرى:</span>
                <span className="font-bold text-xs sm:text-sm text-[#0b1c30]">
                  {student.farRevision.surahRange}
                </span>
              </div>
              <span className="font-bold text-[#005d3f] text-base">
                {student.farRevision.score} / ١٠
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004331] text-[20px]">
              record_voice_over
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              توجيهات مشرفة الحلقة والتكليف القادم
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] space-y-2">
            <span className="text-[11px] text-[#775a19] font-bold block">
              رسالة المشرفة أ. فاطمة الزهراء:
            </span>
            <p className="text-xs sm:text-sm text-[#0b1c30] leading-relaxed italic">
              "{student.tajweed.notes}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#bfc9c2]/30 space-y-1">
            <span className="text-[11px] text-[#004331] font-bold block">
              مقرر الجلسة القادمة (الواجب البيتي):
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
              {student.nextAssignment}
            </p>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {showCertificate && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          dir="rtl"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border-4 border-[#c5a059] shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]"
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-2xl bg-[#004331] text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-3xl text-[#85f8c4]">
                military_tech
              </span>
            </div>
            <span className="text-xs text-[#775a19] font-bold block tracking-widest">
              المملكة العربية السعودية • منصة تاج الوقار لحلقات القرآن
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#004331]">
              شهادة إتقان وتفوق قرآني
            </h2>
            <p className="text-xs sm:text-sm text-[#3f4944] leading-relaxed max-w-lg mx-auto">
              تشهد إدارة منصة تاج الوقار بأن الحافظة المباركة:{' '}
              <strong className="text-[#0b1c30] text-base">
                {student.studentName}
              </strong>{' '}
              قد أتمت حفظ وتثبيت المقرر المحدد بمرتبة{' '}
              <strong className="text-[#004331] font-bold">
                ({student.level})
              </strong>{' '}
              مع استيفاء أحكام التجويد ومخارج الحروف على الوجه الأكمل.
            </p>

            <div className="flex justify-between items-center pt-6 border-t border-[#c5a059]/40 text-xs text-[#3f4944]">
              <div>
                <span className="block text-[11px]">مشرفة الحلقة:</span>
                <strong className="text-[#004331]">أ. فاطمة الزهراء</strong>
              </div>
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#c5a059] flex items-center justify-center text-[10px] text-[#775a19] font-bold">
                ختم الاعتماد
              </div>
              <div>
                <span className="block text-[11px]">التاريخ:</span>
                <strong className="text-[#0b1c30]">١٤ شعبان ١٤٤٦ هـ</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCertificate(false);
                onShowToast('تم إرسال نسخة الشهادة إلى هاتف ولي الأمر');
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#004331] text-white font-bold text-xs"
            >
              تحميل الشهادة بصيغة عالية الدقة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
