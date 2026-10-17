import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tajService } from '../services/tajService';
import {
  TajMemorization,
  TajNearReview,
  TajFarReview,
  TajOldMemorization,
  TajAttendance,
} from '../types/database';

interface StudentViewProps {
  onShowToast?: (msg: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'newMem' | 'nearRev' | 'farRev' | 'oldMem' | 'calendar'
  >('newMem');

  const [memorizationList, setMemorizationList] = useState<TajMemorization[]>([]);
  const [nearReviewList, setNearReviewList] = useState<TajNearReview[]>([]);
  const [farReviewList, setFarReviewList] = useState<TajFarReview[]>([]);
  const [oldMemList, setOldMemList] = useState<TajOldMemorization[]>([]);
  const [attendanceList, setAttendanceList] = useState<TajAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Calendar
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    Promise.all([
      tajService.getStudentMemorization(user.id),
      tajService.getStudentNearReviews(user.id),
      tajService.getStudentFarReviews(user.id),
      tajService.getStudentOldMemorization(user.id),
      tajService.getStudentAttendance(user.id),
    ]).then(([mems, near, far, old, atts]) => {
      setMemorizationList(mems);
      setNearReviewList(near);
      setFarReviewList(far);
      setOldMemList(old);
      setAttendanceList(atts);
      setLoading(false);
    });
  }, [user]);

  // Calendar metrics
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'يناير / رجب',
    'فبراير / شعبان',
    'مارس / رمضان',
    'أبريل / شوال',
    'مايو / ذو القعدة',
    'يونيو / ذو الحجة',
    'يوليو / محرم',
    'أغسطس / صفر',
    'سبتمبر / ربيع الأول',
    'أكتوبر / ربيع الآخر',
    'نوفمبر / جمادى الأولى',
    'ديسمبر / جمادى الآخرة',
  ];

  const getAttendanceForDay = (dayNum: number): TajAttendance | undefined => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      dayNum
    ).padStart(2, '0')}`;
    return attendanceList.find((a) => a.date === dayStr);
  };

  const presentDays = attendanceList.filter((a) => a.status === 'present').length;
  const excusedDays = attendanceList.filter((a) => a.status === 'excused').length;
  const unexcusedDays = attendanceList.filter((a) => a.status === 'unexcused').length;
  const totalDays = attendanceList.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Student Profile Card */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#004331] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {profile?.name ? profile.name.charAt(0) : 'ح'}
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
                {profile?.name || 'الحافظة الكريمة'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
                {profile?.track || 'ختمة الإجازة بالسند'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3f4944] mt-1">
              الحلقة: <strong className="text-[#004331]">{profile?.group_name || 'غير محددة'}</strong> • المرتبة:{' '}
              <strong className="text-[#775a19]">{profile?.level || 'متقنة'}</strong>
            </p>
          </div>
        </div>

        {/* Read-Only Badge */}
        <div className="px-4 py-2 rounded-xl bg-[#eff4ff] text-[#004331] border border-[#dce9ff] flex items-center gap-2 text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px] text-[#775a19]">
            visibility
          </span>
          بوابة العرض فقط (Read-Only) • معتمدة من مشرفة الحلقة
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">نسبة المواظبة:</span>
          <span className="font-serif text-2xl font-bold text-[#004331] mt-1 block">
            {attendanceRate}%
          </span>
          <span className="text-[11px] text-[#005d3f]">
            {presentDays} يوم حضور
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">تسميعات الحفظ الجديد:</span>
          <span className="font-serif text-2xl font-bold text-[#004331] mt-1 block">
            {memorizationList.length}
          </span>
          <span className="text-[11px] text-[#3f4944]">جلسة تسميع موثقة</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">المراجعة الصغرى والكبرى:</span>
          <span className="font-serif text-2xl font-bold text-[#775a19] mt-1 block">
            {nearReviewList.length + farReviewList.length}
          </span>
          <span className="text-[11px] text-[#785a1a]">جلسة تثبيت وسرد</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">أوسمة ختم التثبيت:</span>
          <span className="font-serif text-2xl font-bold text-[#005d3f] mt-1 block">
            {farReviewList.filter((f) => f.has_sanad_badge).length}
          </span>
          <span className="text-[11px] text-[#005137]">أوسمة إتقان بالسند</span>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#bfc9c2]/30 shadow-2xs overflow-x-auto gap-1">
        {[
          { id: 'newMem', label: 'الحفظ الجديد', icon: 'auto_stories' },
          { id: 'nearRev', label: 'المراجعة القريبة', icon: 'history' },
          { id: 'farRev', label: 'المراجعة البعيدة', icon: 'library_books' },
          { id: 'oldMem', label: 'الحفظ القديم', icon: 'bookmark' },
          { id: 'calendar', label: 'جدول وخطة الشهر', icon: 'calendar_month' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#004331] text-white shadow-xs'
                : 'text-[#3f4944] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1) NEW MEMORIZATION */}
      {activeTab === 'newMem' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3">
            <h2 className="font-serif text-base font-bold text-[#0b1c30]">
              سجل تسميع الحفظ الجديد (عرض فقط)
            </h2>
          </div>

          <div className="space-y-3">
            {memorizationList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#004331]">
                      سورة {item.surah} (الآيات {item.from_ayah} - {item.to_ayah})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#85f8c4]/40 text-[#005137] text-[10px] font-bold">
                      {item.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#3f4944] mt-1">
                    <span>التاريخ: {item.date}</span>
                    <span>•</span>
                    <span>المقدار: {item.pages_count} وجه</span>
                    <span>•</span>
                    <span>الأخطاء: {item.verbal_errors}</span>
                    <span>•</span>
                    <span>التنبيهات: {item.warnings}</span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-[#6f7974] mt-1.5 italic bg-white p-2 rounded-xl border border-[#bfc9c2]/20">
                      توجيه المشرفة: "{item.notes}"
                    </p>
                  )}
                </div>

                <span className="text-base font-bold text-[#004331] bg-white px-3.5 py-1.5 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                  {item.score} / ١٠
                </span>
              </div>
            ))}

            {memorizationList.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-[#6f7974]">
                لا توجد سجلات للحفظ الجديد حتى الآن.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2) NEAR REVIEW */}
      {activeTab === 'nearRev' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3">
            <h2 className="font-serif text-base font-bold text-[#0b1c30]">
              سجل المراجعة الصغرى (القريبة)
            </h2>
          </div>

          <div className="space-y-3">
            {nearReviewList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#0b1c30]">
                      سورة {item.surah} (الآيات {item.from_ayah} - {item.to_ayah})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#fed488] text-[#785a1a] text-[10px] font-bold">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-xs text-[#3f4944] block mt-1">
                    التاريخ: {item.date} {item.notes && `• "${item.notes}"`}
                  </span>
                </div>

                <span className="text-base font-bold text-[#775a19] bg-white px-3.5 py-1.5 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                  {item.score} / ١٠
                </span>
              </div>
            ))}

            {nearReviewList.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-[#6f7974]">
                لا توجد سجلات للمراجعة القريبة بعد.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3) FAR REVIEW */}
      {activeTab === 'farRev' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3">
            <h2 className="font-serif text-base font-bold text-[#0b1c30]">
              سجل المراجعة الكبرى (البعيدة التراكمية)
            </h2>
          </div>

          <div className="space-y-3">
            {farReviewList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#0b1c30]">
                      سورة {item.surah} (الآيات {item.from_ayah} - {item.to_ayah})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#85f8c4]/40 text-[#005137] text-[10px] font-bold">
                      {item.rating}
                    </span>
                    {item.has_sanad_badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        وسام تثبيت السرد
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#3f4944] block mt-1">
                    التاريخ: {item.date} {item.notes && `• "${item.notes}"`}
                  </span>
                </div>

                <span className="text-base font-bold text-[#005d3f] bg-white px-3.5 py-1.5 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                  {item.score} / ١٠
                </span>
              </div>
            ))}

            {farReviewList.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-[#6f7974]">
                لا توجد سجلات للمراجعة البعيدة بعد.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4) OLD MEMORIZATION */}
      {activeTab === 'oldMem' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3">
            <h2 className="font-serif text-base font-bold text-[#0b1c30]">
              سجل الحفظ القديم
            </h2>
          </div>

          <div className="space-y-3">
            {oldMemList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#0b1c30]">
                      سورة {item.surah} (الآيات {item.from_ayah} - {item.to_ayah})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#fed488] text-[#785a1a] text-[10px] font-bold">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-xs text-[#3f4944] block mt-1">
                    التاريخ: {item.date} {item.notes && `• "${item.notes}"`}
                  </span>
                </div>

                <span className="text-base font-bold text-[#775a19] bg-white px-3.5 py-1.5 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                  {item.score} / ١٠
                </span>
              </div>
            ))}

            {oldMemList.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-[#6f7974]">
                لا توجد سجلات للحفظ القديم بعد.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5) MONTHLY ATTENDANCE CALENDAR */}
      {activeTab === 'calendar' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004331] text-[22px]">
                calendar_month
              </span>
              <h2 className="font-serif text-base font-bold text-[#0b1c30]">
                جدول الشهر وتقويم الحضور والغياب (عرض فقط)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCalendarDate(new Date(year, month - 1, 1))
                }
                className="p-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] transition-colors"
                title="الشهر السابق"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
              <span className="font-serif text-xs sm:text-sm font-bold text-[#004331] px-2">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={() =>
                  setCalendarDate(new Date(year, month + 1, 1))
                }
                className="p-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] transition-colors"
                title="الشهر التالي"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs p-3 rounded-2xl bg-[#eff4ff] text-[#3f4944]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#005d3f]"></span>
              حاضرة ({presentDays} يوم)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#fed488]"></span>
              غائبة بعذر ({excusedDays} يوم)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
              غائبة بدون عذر ({unexcusedDays} يوم)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#eff4ff] border border-[#bfc9c2]"></span>
              إجازة / لم تُعقد جلسة
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
              const record = getAttendanceForDay(dayNum);
              const status = record?.status;

              return (
                <div
                  key={dayNum}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all border ${
                    status === 'present'
                      ? 'bg-[#004331] text-white border-[#004331]'
                      : status === 'excused'
                      ? 'bg-[#fed488] text-[#785a1a] border-[#fed488]'
                      : status === 'unexcused'
                      ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                      : 'bg-[#f8f9ff] text-[#3f4944] border-[#bfc9c2]/30'
                  }`}
                >
                  <span className="text-[11px] opacity-80">يوم</span>
                  <span className="font-serif font-bold text-base my-0.5">
                    {dayNum}
                  </span>
                  <span className="text-[9px] truncate max-w-full">
                    {status === 'present'
                      ? 'حاضرة ✓'
                      : status === 'excused'
                      ? 'معذورة'
                      : status === 'unexcused'
                      ? 'غائبة'
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
