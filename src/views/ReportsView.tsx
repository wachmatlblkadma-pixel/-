import React, { useState } from 'react';
import { StudentEvaluation } from '../types';

interface ReportsViewProps {
  students: StudentEvaluation[];
  onShowToast: (msg: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  onShowToast,
}) => {
  const [filterTrack, setFilterTrack] = useState('الكل');

  const filtered =
    filterTrack === 'الكل'
      ? students
      : students.filter((s) => s.track === filterTrack);

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Header */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
            التقارير والإحصائيات التحليلية للحلقة
          </h1>
          <p className="text-xs sm:text-sm text-[#3f4944] mt-1">
            مؤشرات الإتقان، نسب الحضور والغياب، وتوزيع التقديرات المهارية لشهر
            شعبان ١٤٤٦ هـ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast('تم تصدير التقرير التحليلي بصيغة Excel')}
            className="px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] font-bold text-xs flex items-center gap-1.5 border border-[#dce9ff] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              table_view
            </span>
            تصدير كملف Excel
          </button>
          <button
            onClick={() => onShowToast('تم إنشاء ملخص PDF لطباعة تقرير الإدارة')}
            className="px-4 py-2 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              picture_as_pdf
            </span>
            تقرير الإدارة (PDF)
          </button>
        </div>
      </section>

      {/* Analytics KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs text-right">
          <span className="text-xs text-[#3f4944] font-medium">
            متوسط درجات التسميع
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#004331]">
              ٩.٦ / ١٠
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              +٠.٣ عن الشهر السابق
            </span>
          </div>
          <span className="text-[11px] text-[#6f7974] block mt-1">
            بناءً على ١٢٤ جلسة تسميع
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs text-right">
          <span className="text-xs text-[#3f4944] font-medium">
            معدل الانضباط والمواظبة
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#775a19]">
              ٩٥.٨%
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              ممتاز
            </span>
          </div>
          <span className="text-[11px] text-[#6f7974] block mt-1">
            إجمالي الغياب بعذر: ٤.٢%
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs text-right">
          <span className="text-xs text-[#3f4944] font-medium">
            معدل إتقان المخارج والصفات
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#005d3f]">
              ٩٢%
            </span>
            <span className="text-[11px] text-[#775a19] font-semibold">
              متقن جداً
            </span>
          </div>
          <span className="text-[11px] text-[#6f7974] block mt-1">
            تثبيت صفير الصاد والضاد
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs text-right">
          <span className="text-xs text-[#3f4944] font-medium">
            المؤهلات لاختبار الإجازة
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#0b1c30]">
              ٨ حافظات
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              جاهزات
            </span>
          </div>
          <span className="text-[11px] text-[#6f7974] block mt-1">
            سرد متصل للقرآن الكريم
          </span>
        </div>
      </section>

      {/* Visual Charts / Bars Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0b1c30]">
            توزيع التقديرات العامة في الحفظ والمراجعة
          </h3>
          <div className="space-y-3">
            {[
              {
                label: 'ممتاز مرتفع (٩.٨ - ١٠)',
                count: '١٤ طالبة',
                pct: 60,
                color: 'bg-[#004331]',
              },
              {
                label: 'ممتاز (٩.٠ - ٩.٧)',
                count: '٦ طالبات',
                pct: 25,
                color: 'bg-[#0d5c46]',
              },
              {
                label: 'جيد جداً (٨.٠ - ٨.٩)',
                count: '٣ طالبات',
                pct: 12,
                color: 'bg-[#fed488]',
              },
              {
                label: 'يحتاج تثبيت ومتابعة (أقل من ٨)',
                count: 'طالبة واحدة',
                pct: 3,
                color: 'bg-[#ba1a1a]',
              },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-[#3f4944]">
                  <span>{bar.label}</span>
                  <span className="font-bold text-[#0b1c30]">{bar.count} ({bar.pct}%)</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color}`}
                    style={{ width: `${bar.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tajweed Criteria Performance */}
        <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0b1c30]">
            نسب ضبط مهارات وأحكام التلاوة والتجويد
          </h3>
          <div className="space-y-3">
            {[
              { label: 'مخارج الحروف والصفات الأصلية', score: '٩٦%', pct: 96 },
              { label: 'أحكام النون الساكنة والتنوين والميم', score: '٩٨%', pct: 98 },
              { label: 'أزمنة الغنن ومراتبها', score: '٨٩%', pct: 89 },
              { label: 'المدود وأزمنة توسط المنفصل', score: '٩٢%', pct: 92 },
              { label: 'الوقف والابتداء وحسن الترتيل', score: '٩٤%', pct: 94 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-[#3f4944]">
                  <span>{item.label}</span>
                  <span className="font-bold text-[#004331]">{item.score}</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#005d3f] rounded-full"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roster Table */}
      <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-serif text-base font-bold text-[#0b1c30]">
            جدول المقارنة الفردية للحافظات
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#3f4944]">تصفية بالمسار:</span>
            {['الكل', 'ختمة الإجازة', 'تحفيظ منتظم', 'الختمة الذهبية'].map(
              (track) => (
                <button
                  key={track}
                  onClick={() => setFilterTrack(track)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    filterTrack === track
                      ? 'bg-[#004331] text-white'
                      : 'bg-[#eff4ff] text-[#3f4944]'
                  }`}
                >
                  {track}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#eff4ff] text-[#3f4944] font-bold border-b border-[#bfc9c2]/30">
                <th className="p-3">الحافظة</th>
                <th className="p-3">المسار</th>
                <th className="p-3">الحفظ الجديد</th>
                <th className="p-3">المراجعة الصغرى</th>
                <th className="p-3">المراجعة الكبرى</th>
                <th className="p-3">المعدل العام</th>
                <th className="p-3">المرتبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c2]/20">
              {filtered.map((st) => (
                <tr key={st.studentId} className="hover:bg-[#f8f9ff]">
                  <td className="p-3 font-bold text-[#0b1c30]">
                    {st.studentName}
                  </td>
                  <td className="p-3 text-[#775a19]">{st.track}</td>
                  <td className="p-3">{st.newMemorization.score} / ١٠</td>
                  <td className="p-3">{st.nearRevision.score} / ١٠</td>
                  <td className="p-3">{st.farRevision.score} / ١٠</td>
                  <td className="p-3 font-bold text-[#004331]">
                    {(
                      st.newMemorization.score * 0.5 +
                      st.nearRevision.score * 0.25 +
                      st.farRevision.score * 0.25
                    ).toFixed(1)}{' '}
                    / ١٠
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#85f8c4]/40 text-[#005137] font-semibold">
                      {st.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
