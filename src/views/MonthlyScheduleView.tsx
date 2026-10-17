import React, { useState } from 'react';
import { MONTHLY_PLAN_DAYS } from '../data/mockData';
import { CalendarDayPlan } from '../types';

interface MonthlyScheduleViewProps {
  onShowToast: (msg: string) => void;
}

export const MonthlyScheduleView: React.FC<MonthlyScheduleViewProps> = ({
  onShowToast,
}) => {
  const [selectedDay, setSelectedDay] = useState<CalendarDayPlan>(
    MONTHLY_PLAN_DAYS[2] // Tuesday today
  );
  const [selectedWeek, setSelectedWeek] = useState('الكل');

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Top Banner */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0d5c46] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px] text-[#85f8c4]">
              calendar_month
            </span>
          </div>
          <div className="flex flex-col text-right">
            <h1 className="font-serif text-xl font-bold text-[#0b1c30]">
              جدول وخطة الشهر لحلقة الفردوس
            </h1>
            <p className="text-xs sm:text-sm text-[#3f4944] mt-0.5">
              خطة الإتقان الشاملة لشهر شعبان واستقبال رمضان ١٤٤٦ هـ • توزيع الحفظ
              والمراجعات والاختبارات الدورية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onShowToast('تم بدء تحميل جدول الشهر بصيغة PDF للطباعة')}
            className="px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#dce9ff] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            طباعة الخطة (PDF)
          </button>
          <button
            onClick={() => onShowToast('تم إرسال الخطة الشهرية إلى مجموعات أولياء الأمور')}
            className="px-4 py-2 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              share
            </span>
            مشاركة الخطة
          </button>
        </div>
      </section>

      {/* Week Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          'الكل',
          'الأسبوع الأول (سورة البقرة)',
          'الأسبوع الثاني (آل عمران)',
          'الأسبوع الثالث (النساء)',
          'الأسبوع الرابع (المائدة)',
        ].map((wk) => (
          <button
            key={wk}
            onClick={() => setSelectedWeek(wk)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedWeek === wk
                ? 'bg-[#004331] text-white shadow-2xs'
                : 'bg-white hover:bg-[#eff4ff] text-[#3f4944] border border-[#bfc9c2]/30'
            }`}
          >
            {wk}
          </button>
        ))}
      </div>

      {/* Content Split: Days List & Selected Day Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Days List Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs overflow-hidden">
          <div className="p-4 bg-[#eff4ff] border-b border-[#bfc9c2]/30 flex items-center justify-between">
            <span className="font-serif text-sm font-bold text-[#0b1c30]">
              المسار اليومي المعتمد للأيام الجارية
            </span>
            <span className="text-xs text-[#775a19] font-semibold">
              اليوم: الثلاثاء ١٤ شعبان (نشط)
            </span>
          </div>

          <div className="divide-y divide-[#bfc9c2]/20">
            {MONTHLY_PLAN_DAYS.map((day) => {
              const isSelected = selectedDay.date === day.date;
              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right ${
                    isSelected
                      ? 'bg-[#eff4ff] border-r-4 border-[#004331]'
                      : 'hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 ${
                        day.isExamDay
                          ? 'bg-[#fed488] text-[#785a1a]'
                          : day.isHoliday
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#004331] text-white'
                      }`}
                    >
                      <span>{day.dayName}</span>
                      <span className="text-[10px] opacity-80">
                        {day.date.split('-')[2]}
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-[#0b1c30]">
                          {day.hijriDate}
                        </span>
                        {day.isExamDay && (
                          <span className="px-2 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-[10px] font-bold">
                            يوم اختبار معتمد ⭐
                          </span>
                        )}
                        {day.isHoliday && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                            عطلة رسمية
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#004331] font-semibold mt-0.5">
                        الحفظ الجديد: {day.newMemTarget}
                      </span>
                      <span className="text-[11px] text-[#3f4944]">
                        المراجعة: {day.nearRevTarget}
                      </span>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-[#6f7974] text-[20px] self-end sm:self-center">
                    arrow_back_ios
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#bfc9c2]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004331] text-[22px]">
                  event_note
                </span>
                <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                  تفاصيل مقرر: {selectedDay.dayName}
                </h3>
              </div>
              <span className="text-xs text-[#775a19] font-bold">
                {selectedDay.hijriDate}
              </span>
            </div>

            {/* Target 1: Hifdh */}
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
              <span className="text-[11px] text-[#004331] font-bold block flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  auto_stories
                </span>
                مقرر الحفظ الجديد المطلوب:
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                {selectedDay.newMemTarget}
              </p>
            </div>

            {/* Target 2: Near Rev */}
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
              <span className="text-[11px] text-[#775a19] font-bold block flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  history
                </span>
                المراجعة الصغرى (القريبة):
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                {selectedDay.nearRevTarget}
              </p>
            </div>

            {/* Target 3: Far Rev */}
            <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] space-y-1">
              <span className="text-[11px] text-[#005d3f] font-bold block flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  library_books
                </span>
                المراجعة الكبرى التراكمية:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                {selectedDay.farRevTarget}
              </p>
            </div>

            {/* Notes */}
            {selectedDay.notes && (
              <div className="p-3 rounded-xl bg-[#f8f9ff] text-xs text-[#3f4944] border border-[#bfc9c2]/20">
                <strong className="text-[#0b1c30] block mb-0.5">
                  توجيهات المشرفة لهذا اليوم:
                </strong>
                {selectedDay.notes}
              </div>
            )}

            <button
              onClick={() => onShowToast('تم تحديث التكليفات اليومية لهذا التاريخ')}
              className="w-full py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              اعتماد المقرر وتعميمه للحافظات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
