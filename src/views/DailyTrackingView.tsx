import React, { useState } from 'react';
import { StudentEvaluation, AttendanceStatus } from '../types';

interface DailyTrackingViewProps {
  students: StudentEvaluation[];
  onUpdateStudent: (student: StudentEvaluation) => void;
  onOpenDetailedModal: (student: StudentEvaluation) => void;
  onOpenQuickDrawer: (student: StudentEvaluation) => void;
  onShowToast: (message: string) => void;
  onMarkAllPresent: () => void;
  onSaveEntireSession: () => void;
}

export const DailyTrackingView: React.FC<DailyTrackingViewProps> = ({
  students,
  onUpdateStudent,
  onOpenDetailedModal,
  onOpenQuickDrawer,
  onShowToast,
  onMarkAllPresent,
  onSaveEntireSession,
}) => {
  const [selectedCircle, setSelectedCircle] = useState('حلقة الفردوس (مكثف إتقان)');
  const [sessionDate, setSessionDate] = useState('2025-02-11');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter students based on search
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.newMemorization.surahRange.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.nearRevision.surahRange.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.farRevision.surahRange.toLowerCase().includes(tableSearch.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Quick attendance toggle
  const handleSetAttendance = (
    student: StudentEvaluation,
    status: AttendanceStatus
  ) => {
    const updated: StudentEvaluation = {
      ...student,
      attendance: status,
      attendanceTime: status === 'present' ? '٠٥:٣٠ ص' : status === 'late' ? '٠٦:١٥ ص' : 'معتمد',
    };
    onUpdateStudent(updated);
    const statusArabic =
      status === 'present'
        ? 'حاضرة'
        : status === 'excused'
        ? 'معذورة'
        : status === 'late'
        ? 'متأخرة'
        : 'غائبة';
    onShowToast(`تم تسجيل الحافظة ${student.studentName}: ${statusArabic}`);
  };

  // Quick approve row
  const handleQuickApprove = (student: StudentEvaluation) => {
    const updated: StudentEvaluation = {
      ...student,
      isEvaluatedToday: true,
      lastUpdated: 'الآن',
    };
    onUpdateStudent(updated);
    onShowToast(`تم اعتماد وتوثيق درجات الحافظة: ${student.studentName} بنجاح`);
  };

  // KPIs
  const totalCount = students.length;
  const evaluatedCount = students.filter((s) => s.isEvaluatedToday).length;
  const absentOrExcused = students.filter(
    (s) => s.attendance === 'absent' || s.attendance === 'excused'
  ).length;
  const evaluatedScores = students.filter((s) => s.newMemorization.score > 0);
  const averageScore = evaluatedScores.length
    ? (
        evaluatedScores.reduce((acc, curr) => acc + curr.newMemorization.score, 0) /
        evaluatedScores.length
      ).toFixed(1)
    : '٩.٦';

  return (
    <div className="flex flex-col w-full pb-16 font-sans">
      {/* Top Operational Banner & Security Badge */}
      <section className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white shadow-2xs border border-[#bfc9c2]/30 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#004331]/5 pointer-events-none"></div>
        <div className="flex items-start md:items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#0d5c46] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px] text-[#85f8c4]">
              edit_calendar
            </span>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-serif text-lg sm:text-xl text-[#0b1c30] font-bold">
                سجل الرصد والتقييم اليومي الميداني
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold flex items-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>
                لوحة المشرفة المعتمدة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3f4944]">
              تسجيل مباشر ومطابقة لمسارات الحفظ الجديد، المراجعة الصغرى والكبرى، مع رصد الأحكام والغياب التفاعلي.
            </p>
          </div>
        </div>

        {/* Supervisor Role Callout Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#eff4ff] text-[#004331] border border-[#dce9ff] relative z-10">
          <span className="material-symbols-outlined text-[22px] text-[#775a19]">
            admin_panel_settings
          </span>
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-[#3f4944] font-medium">
              مستوى الأمان والتحكم:
            </span>
            <span className="text-xs font-bold text-[#0b1c30]">
              صلاحية إدخال وتعديل حصرية للمشرفة • الحافظة ترى تقرير القراءة فقط
            </span>
          </div>
        </div>
      </section>

      {/* Filter & Quick Action Strip */}
      <section className="mb-6 bg-white p-4 rounded-2xl shadow-2xs border border-[#bfc9c2]/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Ring Selector */}
          <div className="flex items-center gap-2 bg-[#f8f9ff] px-4 py-2 rounded-xl border border-[#bfc9c2]/30">
            <span className="material-symbols-outlined text-[#004331] text-[20px]">
              menu_book
            </span>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#3f4944]">الحلقة المستهدفة</span>
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-[#0b1c30] font-bold focus:outline-none cursor-pointer"
              >
                <option>حلقة الفردوس (مكثف إتقان)</option>
                <option>حلقة النور والضياء (تأسيسي)</option>
                <option>حلقة أمهات المؤمنين (متقدم)</option>
              </select>
            </div>
          </div>

          {/* Date / Session Picker */}
          <div className="flex items-center gap-2 bg-[#f8f9ff] px-4 py-2 rounded-xl border border-[#bfc9c2]/30">
            <span className="material-symbols-outlined text-[#775a19] text-[20px]">
              event_available
            </span>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#3f4944]">جلسة التسميع اليومية</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-[#0b1c30] font-semibold focus:outline-none cursor-pointer"
                />
                <span className="text-xs text-[#775a19] font-medium hidden sm:inline">
                  جلسة بعد الفجر
                </span>
              </div>
            </div>
          </div>

          {/* Live Search in Table */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[18px]">
              person_search
            </span>
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="البحث بالاسم أو السورة الحالية..."
              className="w-full bg-[#f8f9ff] pl-3 pr-9 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#6f7974] border border-[#bfc9c2]/30 focus:outline-none focus:bg-white focus:border-[#004331] transition-all"
            />
          </div>
        </div>

        {/* Quick Mass Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMarkAllPresent}
            className="px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              done_all
            </span>
            تحضير الكل (حاضرة)
          </button>
          <button
            onClick={onSaveEntireSession}
            className="px-4 py-2 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              save
            </span>
            حفظ واعتماد الجلسة
          </button>
        </div>
      </section>

      {/* Summary KPI Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-[#bfc9c2]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#004331] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-[#3f4944]">إجمالي الحافظات المسجلات</span>
            <span className="font-serif text-lg sm:text-xl text-[#0b1c30] font-bold">
              {totalCount} حافظة
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-[#bfc9c2]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#005d3f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-[#3f4944]">تم التقييم اليوم حتى الآن</span>
            <span className="font-serif text-lg sm:text-xl text-[#005d3f] font-bold">
              {evaluatedCount} / {totalCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-[#bfc9c2]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#775a19] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">star</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-[#3f4944]">متوسط درجة الحلقة اليوم</span>
            <span className="font-serif text-lg sm:text-xl text-[#775a19] font-bold">
              {averageScore} / ١٠
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-2xs border border-[#bfc9c2]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#ba1a1a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">event_busy</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-[#3f4944]">الغياب والاعتذارات اليوم</span>
            <span className="font-serif text-lg sm:text-xl text-[#ba1a1a] font-bold">
              {absentOrExcused} (معذورة)
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Daily Evaluation Table */}
      <section className="bg-white rounded-2xl shadow-2xs border border-[#bfc9c2]/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-[#eff4ff] text-[#3f4944] text-xs font-bold border-b border-[#bfc9c2]/30 select-none">
                <th className="py-3.5 px-4">الحافظة</th>
                <th className="py-3.5 px-4">حالة الحضور اليومي</th>
                <th className="py-3.5 px-4">الحفظ الجديد (المقرر والدرجة)</th>
                <th className="py-3.5 px-4">المراجعة الصغرى (القريبة)</th>
                <th className="py-3.5 px-4">المراجعة الكبرى (البعيدة)</th>
                <th className="py-3.5 px-4">ملاحظات التجويد والمخارج</th>
                <th className="py-3.5 px-4 text-center">الإجراء الميداني</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc9c2]/20 text-xs sm:text-sm text-[#0b1c30]">
              {paginatedStudents.map((student) => {
                const isExcused = student.attendance === 'excused';
                const isAbsent = student.attendance === 'absent';
                const isLate = student.attendance === 'late';
                const isPresent = student.attendance === 'present';

                return (
                  <tr
                    key={student.studentId}
                    className="hover:bg-[#eff4ff]/40 transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.studentName}
                          className="w-11 h-11 rounded-full object-cover shadow-xs border border-[#bfc9c2]/40"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <button
                            onClick={() => onOpenDetailedModal(student)}
                            className="font-serif text-sm font-bold text-[#0b1c30] hover:text-[#004331] text-right cursor-pointer"
                          >
                            {student.studentName}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-[#775a19] font-semibold">
                              المسار: {student.track}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#bfc9c2]"></span>
                            <span className="text-[11px] text-[#3f4944]">
                              المرتبة: {student.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Switcher */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-wrap gap-1 p-1 bg-[#eff4ff] rounded-xl max-w-[155px] border border-[#dce9ff]">
                        <button
                          onClick={() => handleSetAttendance(student, 'present')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            isPresent
                              ? 'bg-[#0d5c46] text-white shadow-xs'
                              : 'text-[#3f4944] hover:bg-white'
                          }`}
                        >
                          حاضرة
                        </button>
                        <button
                          onClick={() => handleSetAttendance(student, 'excused')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            isExcused
                              ? 'bg-[#775a19] text-white shadow-xs'
                              : 'text-[#3f4944] hover:bg-white'
                          }`}
                        >
                          معذورة
                        </button>
                        <button
                          onClick={() => handleSetAttendance(student, 'late')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            isLate
                              ? 'bg-[#fed488] text-[#785a1a] shadow-xs'
                              : 'text-[#3f4944] hover:bg-white'
                          }`}
                        >
                          متأخرة
                        </button>
                        <button
                          onClick={() => handleSetAttendance(student, 'absent')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            isAbsent
                              ? 'bg-[#ba1a1a] text-white shadow-xs'
                              : 'text-[#3f4944] hover:bg-white'
                          }`}
                        >
                          غائبة
                        </button>
                      </div>
                    </td>

                    {/* New Memorization */}
                    <td className="py-4 px-4 align-top">
                      <div className="p-2.5 rounded-xl bg-[#eff4ff] max-w-[210px] space-y-1.5 border border-[#dce9ff]">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded bg-[#004331]/10 text-[#004331] text-[11px] font-bold truncate max-w-[130px]">
                            {student.newMemorization.surahRange}
                          </span>
                          <span className="font-bold text-[#004331] text-xs sm:text-sm">
                            {student.newMemorization.score > 0
                              ? `${student.newMemorization.score} / ١٠`
                              : isExcused
                              ? 'تأجيل'
                              : '٠ / ١٠'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#3f4944]">
                          <span>
                            الأخطاء:{' '}
                            <strong className="text-[#0b1c30]">
                              {student.newMemorization.verbalErrors}
                            </strong>
                          </span>
                          <span>
                            التنبيهات:{' '}
                            <strong className="text-[#775a19] font-bold">
                              {student.newMemorization.warningCount > 0
                                ? `${student.newMemorization.warningCount} (${student.newMemorization.warningDetail || 'أحكام'})`
                                : 'لا يوجد'}
                            </strong>
                          </span>
                        </div>
                        <div className="w-full bg-[#dce9ff] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.newMemorization.score >= 9.5
                                ? 'bg-[#004331]'
                                : student.newMemorization.score >= 8.5
                                ? 'bg-[#775a19]'
                                : 'bg-[#ba1a1a]'
                            }`}
                            style={{
                              width: `${(student.newMemorization.score / 10) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Near Revision */}
                    <td className="py-4 px-4 align-top">
                      <div className="p-2.5 rounded-xl bg-[#eff4ff] max-w-[190px] space-y-1 border border-[#dce9ff]">
                        <span className="text-xs font-semibold text-[#0b1c30] block truncate">
                          {student.nearRevision.surahRange}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded bg-[#85f8c4]/40 text-[#005137] text-[10px] font-bold">
                            {student.nearRevision.ratingLabel}
                          </span>
                          <span className="text-xs font-bold text-[#0b1c30]">
                            {student.nearRevision.score > 0
                              ? `${student.nearRevision.score} / ١٠`
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Far Revision */}
                    <td className="py-4 px-4 align-top">
                      <div className="p-2.5 rounded-xl bg-[#eff4ff] max-w-[180px] space-y-1 border border-[#dce9ff]">
                        <span className="text-xs font-semibold text-[#0b1c30] block truncate">
                          {student.farRevision.surahRange}
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-[#3f4944]">
                          <span>{student.farRevision.levelLabel}</span>
                          {student.farRevision.hasSanadBadge && (
                            <span
                              className="material-symbols-outlined text-[#775a19] text-[16px]"
                              title="ختم تثبيت السرد المعتمد"
                            >
                              verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tajweed Notes */}
                    <td className="py-4 px-4 align-top">
                      <div className="text-xs text-[#3f4944] bg-[#f8f9ff] p-2.5 rounded-xl max-w-[230px] border border-[#bfc9c2]/20 leading-relaxed line-clamp-3">
                        {student.tajweed.notes}
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenDetailedModal(student)}
                          className="p-2 rounded-xl bg-[#0d5c46] text-white hover:bg-[#004331] transition-all shadow-2xs cursor-pointer"
                          title="فتح نموذج الرصد والتوثيق المعتمد"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit_note
                          </span>
                        </button>
                        <button
                          onClick={() => onOpenQuickDrawer(student)}
                          className="p-2 rounded-xl bg-[#eff4ff] text-[#775a19] hover:bg-[#fed488]/40 transition-all cursor-pointer"
                          title="معاينة جانبية سريعة"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            dock_to_left
                          </span>
                        </button>
                        <button
                          onClick={() => handleQuickApprove(student)}
                          className="p-2 rounded-xl bg-[#eff4ff] text-[#004331] hover:bg-[#004331] hover:text-white transition-all shadow-2xs cursor-pointer"
                          title="اعتماد فوري للدرجة"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            check
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Pagination Bar */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc9c2]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[#3f4944] font-medium">
            عرض {paginatedStudents.length} من أصل {filteredStudents.length} حافظة مسجلة في {selectedCircle}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#e5eeff] text-[#0b1c30] font-semibold border border-[#bfc9c2]/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              الصفحة السابقة
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? 'bg-[#004331] text-white shadow-xs'
                    : 'bg-white hover:bg-[#e5eeff] text-[#0b1c30] border border-[#bfc9c2]/30'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#e5eeff] text-[#0b1c30] font-semibold border border-[#bfc9c2]/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              الصفحة التالية
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
