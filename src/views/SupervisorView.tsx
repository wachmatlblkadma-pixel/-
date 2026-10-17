import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tajService } from '../services/tajService';
import {
  TajGroup,
  TajProfile,
  TajMemorization,
  TajNearReview,
  TajFarReview,
  TajOldMemorization,
  TajAttendance,
  AttendanceType,
} from '../types/database';
import { QURAN_SURAHS } from '../data/quranData';

interface SupervisorViewProps {
  onShowToast: (msg: string) => void;
}

export const SupervisorView: React.FC<SupervisorViewProps> = ({ onShowToast }) => {
  const { user, profile } = useAuth();
  const [group, setGroup] = useState<TajGroup | null>(null);
  const [students, setStudents] = useState<TajProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<TajProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Student Section Tabs: 'newMem' | 'nearRev' | 'farRev' | 'oldMem' | 'attendanceCalendar'
  const [currentSection, setCurrentSection] = useState<
    'newMem' | 'nearRev' | 'farRev' | 'oldMem' | 'attendanceCalendar'
  >('newMem');

  // Student Records Data
  const [memorizationList, setMemorizationList] = useState<TajMemorization[]>([]);
  const [nearReviewList, setNearReviewList] = useState<TajNearReview[]>([]);
  const [farReviewList, setFarReviewList] = useState<TajFarReview[]>([]);
  const [oldMemList, setOldMemList] = useState<TajOldMemorization[]>([]);
  const [attendanceList, setAttendanceList] = useState<TajAttendance[]>([]);
  const [todayAttendanceMap, setTodayAttendanceMap] = useState<Record<string, TajAttendance>>({});

  // Modals for adding entries
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    'newMem' | 'nearRev' | 'farRev' | 'oldMem'
  >('newMem');

  // Form Fields
  const todayStr = new Date().toISOString().split('T')[0];
  const [entryDate, setEntryDate] = useState<string>(todayStr);
  const [entrySurah, setEntrySurah] = useState<string>(QURAN_SURAHS[3].name); // النساء
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(12);
  const [pagesCount, setPagesCount] = useState<number>(2.5);
  const [score, setScore] = useState<number>(10);
  const [verbalErrors, setVerbalErrors] = useState<number>(0);
  const [warnings, setWarnings] = useState<number>(0);
  const [rating, setRating] = useState<string>('ممتاز مرتفع');
  const [hasSanad, setHasSanad] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());

  const loadSupervisorData = async () => {
    if (!user) return;
    setLoading(true);

    // 1) Find the supervisor's group
    let myGroup: TajGroup | null = null;
    if (profile?.group_id) {
      const allGroups = await tajService.getGroups();
      myGroup = allGroups.find((g) => g.id === profile.group_id) || null;
    }
    if (!myGroup) {
      myGroup = await tajService.getSupervisorGroup(user.id);
    }
    if (!myGroup) {
      // If supervisor is not directly linked yet, get the first group
      const all = await tajService.getGroups();
      myGroup = all[0] || null;
    }

    setGroup(myGroup);

    if (myGroup) {
      const groupStudents = await tajService.getStudentsByGroup(myGroup.id);
      setStudents(groupStudents);
      if (groupStudents.length > 0 && !selectedStudent) {
        setSelectedStudent(groupStudents[0]);
      }

      // Fetch today's attendance for the group
      const sIds = groupStudents.map((s) => s.id);
      const todayMap = await tajService.getGroupAttendanceForDate(sIds, todayStr);
      setTodayAttendanceMap(todayMap);
    }

    setLoading(false);
  };

  const loadStudentRecords = async (studentId: string) => {
    const [mems, near, far, old, atts] = await Promise.all([
      tajService.getStudentMemorization(studentId),
      tajService.getStudentNearReviews(studentId),
      tajService.getStudentFarReviews(studentId),
      tajService.getStudentOldMemorization(studentId),
      tajService.getStudentAttendance(studentId),
    ]);

    setMemorizationList(mems);
    setNearReviewList(near);
    setFarReviewList(far);
    setOldMemList(old);
    setAttendanceList(atts);
  };

  useEffect(() => {
    loadSupervisorData();
  }, [user, profile]);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentRecords(selectedStudent.id);
    }
  }, [selectedStudent]);

  const handleSelectStudent = (st: TajProfile) => {
    setSelectedStudent(st);
  };

  const handleSetAttendance = async (
    studentId: string,
    status: AttendanceType,
    note?: string
  ) => {
    const { error } = await tajService.recordAttendance(
      studentId,
      todayStr,
      status,
      note
    );
    if (error) {
      onShowToast(`خطأ في تسجيل الحضور: ${error.message}`);
    } else {
      const label =
        status === 'present'
          ? 'حاضرة'
          : status === 'excused'
          ? 'غائبة بعذر'
          : 'غائبة بدون عذر';
      onShowToast(`تم تسجيل الحافظة: ${label}`);
      // Refresh today's attendance map & student's attendance list
      if (students.length) {
        const sIds = students.map((s) => s.id);
        const todayMap = await tajService.getGroupAttendanceForDate(
          sIds,
          todayStr
        );
        setTodayAttendanceMap(todayMap);
      }
      if (selectedStudent && selectedStudent.id === studentId) {
        const atts = await tajService.getStudentAttendance(studentId);
        setAttendanceList(atts);
      }
    }
  };

  const handleMarkAllPresent = async () => {
    if (!students.length) return;
    const sIds = students.map((s) => s.id);
    const { error } = await tajService.markAllPresent(sIds, todayStr);
    if (error) {
      onShowToast(`خطأ: ${error.message}`);
    } else {
      onShowToast('تم تحضير جميع حافظات الحلقة بنجاح اليوم');
      const todayMap = await tajService.getGroupAttendanceForDate(sIds, todayStr);
      setTodayAttendanceMap(todayMap);
      if (selectedStudent) {
        const atts = await tajService.getStudentAttendance(selectedStudent.id);
        setAttendanceList(atts);
      }
    }
  };

  const openModal = (type: 'newMem' | 'nearRev' | 'farRev' | 'oldMem') => {
    setModalType(type);
    setEntryDate(todayStr);
    setEntrySurah(QURAN_SURAHS[3].name);
    setFromAyah(1);
    setToAyah(12);
    setPagesCount(2.5);
    setScore(10);
    setVerbalErrors(0);
    setWarnings(0);
    setRating(
      type === 'newMem'
        ? 'ممتاز مرتفع'
        : type === 'nearRev'
        ? 'متقن جداً'
        : type === 'farRev'
        ? 'سرد متقن'
        : 'متقن كالفاتحة'
    );
    setHasSanad(false);
    setNotes('');
    setShowAddModal(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !user) return;

    if (modalType === 'newMem') {
      const { error } = await tajService.addMemorization({
        student_id: selectedStudent.id,
        date: entryDate,
        surah: entrySurah,
        from_ayah: fromAyah,
        to_ayah: toAyah,
        pages_count: pagesCount,
        score,
        verbal_errors: verbalErrors,
        warnings,
        rating,
        notes,
        created_by: user.id,
      });
      if (error) onShowToast(`خطأ: ${error.message}`);
      else {
        onShowToast('تم رصد الحفظ الجديد بنجاح');
        setShowAddModal(false);
        loadStudentRecords(selectedStudent.id);
      }
    } else if (modalType === 'nearRev') {
      const { error } = await tajService.addNearReview({
        student_id: selectedStudent.id,
        date: entryDate,
        surah: entrySurah,
        from_ayah: fromAyah,
        to_ayah: toAyah,
        score,
        rating,
        notes,
        created_by: user.id,
      });
      if (error) onShowToast(`خطأ: ${error.message}`);
      else {
        onShowToast('تم رصد المراجعة القريبة بنجاح');
        setShowAddModal(false);
        loadStudentRecords(selectedStudent.id);
      }
    } else if (modalType === 'farRev') {
      const { error } = await tajService.addFarReview({
        student_id: selectedStudent.id,
        date: entryDate,
        surah: entrySurah,
        from_ayah: fromAyah,
        to_ayah: toAyah,
        score,
        rating,
        has_sanad_badge: hasSanad,
        notes,
        created_by: user.id,
      });
      if (error) onShowToast(`خطأ: ${error.message}`);
      else {
        onShowToast('تم رصد المراجعة البعيدة بنجاح');
        setShowAddModal(false);
        loadStudentRecords(selectedStudent.id);
      }
    } else if (modalType === 'oldMem') {
      const { error } = await tajService.addOldMemorization({
        student_id: selectedStudent.id,
        date: entryDate,
        surah: entrySurah,
        from_ayah: fromAyah,
        to_ayah: toAyah,
        score,
        rating,
        notes,
        created_by: user.id,
      });
      if (error) onShowToast(`خطأ: ${error.message}`);
      else {
        onShowToast('تم رصد الحفظ القديم بنجاح');
        setShowAddModal(false);
        loadStudentRecords(selectedStudent.id);
      }
    }
  };

  const handleDeleteRecord = async (
    type: 'newMem' | 'nearRev' | 'farRev' | 'oldMem',
    id: string
  ) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا السجل؟')) return;
    let err: Error | null = null;
    if (type === 'newMem') err = (await tajService.deleteMemorization(id)).error;
    if (type === 'nearRev') err = (await tajService.deleteNearReview(id)).error;
    if (type === 'farRev') err = (await tajService.deleteFarReview(id)).error;
    if (type === 'oldMem') err = (await tajService.deleteOldMemorization(id)).error;

    if (err) onShowToast(`خطأ: ${err.message}`);
    else {
      onShowToast('تم حذف السجل بنجاح');
      if (selectedStudent) loadStudentRecords(selectedStudent.id);
    }
  };

  // Calendar Helpers
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
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

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Halaqah Top Bar & Mass Presence */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#004331] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px] text-[#85f8c4]">
              menu_book
            </span>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
                {group?.name || 'حلقة التحفيظ المعتمدة'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold">
                {group?.category || 'حلقة إتقان'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3f4944] mt-0.5">
              المشرفة المسؤولة: {profile?.name || 'المشرفة'} • {group?.session_time} • {students.length} حافظات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
              done_all
            </span>
            تحضير كل الحافظات اليوم
          </button>
        </div>
      </section>

      {/* Main Workspace Split: Students List (Right/Top) and Records Studio (Left/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Students List Column */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#bfc9c2]/30">
            <span className="font-serif text-sm font-bold text-[#0b1c30]">
              حافظات الحلقة ({students.length})
            </span>
            <span className="text-[11px] text-[#005d3f] font-semibold">
              انقري لاختيار الحافظة
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {students.map((st) => {
              const isSelected = selectedStudent?.id === st.id;
              const attToday = todayAttendanceMap[st.id]?.status;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStudent(st)}
                  className={`w-full p-3 rounded-2xl text-right flex items-center justify-between gap-2.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#eff4ff] border-[#004331] shadow-2xs'
                      : 'hover:bg-[#f8f9ff] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#004331] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {st.name.charAt(0)}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-xs text-[#0b1c30]">
                        {st.name}
                      </span>
                      <span className="text-[10px] text-[#6f7974]">
                        {st.level || 'متقنة'}
                      </span>
                    </div>
                  </div>

                  {/* Attendance badge for today */}
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      attToday === 'present'
                        ? 'bg-[#005d3f]'
                        : attToday === 'excused'
                        ? 'bg-[#fed488]'
                        : attToday === 'unexcused'
                        ? 'bg-[#ba1a1a]'
                        : 'bg-[#bfc9c2]'
                    }`}
                    title={
                      attToday === 'present'
                        ? 'حاضرة اليوم'
                        : attToday === 'excused'
                        ? 'غائبة بعذر'
                        : attToday === 'unexcused'
                        ? 'غائبة بدون عذر'
                        : 'لم يتم الرصد بعد'
                    }
                  ></span>
                </button>
              );
            })}

            {students.length === 0 && !loading && (
              <div className="text-center py-8 text-xs text-[#6f7974]">
                لا توجد حافظات مسجلات في هذه الحلقة حتى الآن.
              </div>
            )}
          </div>
        </div>

        {/* Selected Student Details & Evaluation Tabs Column */}
        <div className="lg:col-span-3 space-y-6">
          {selectedStudent ? (
            <>
              {/* Selected Student Banner & Attendance Switcher */}
              <div className="p-5 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#004331] flex items-center justify-center font-serif text-lg font-bold border border-[#dce9ff]">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <h2 className="font-serif text-lg font-bold text-[#0b1c30]">
                      {selectedStudent.name}
                    </h2>
                    <span className="text-xs text-[#775a19]">
                      المسار: {selectedStudent.track || 'ختمة الإجازة بالسند'} •{' '}
                      {selectedStudent.level || 'متقنة'}
                    </span>
                  </div>
                </div>

                {/* Today Attendance Controls */}
                <div className="flex items-center gap-1.5 p-1 bg-[#eff4ff] rounded-2xl border border-[#dce9ff]">
                  <span className="text-xs text-[#3f4944] px-2 font-bold">
                    حضور اليوم:
                  </span>
                  <button
                    onClick={() => handleSetAttendance(selectedStudent.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      todayAttendanceMap[selectedStudent.id]?.status === 'present'
                        ? 'bg-[#004331] text-white shadow-xs'
                        : 'text-[#3f4944] hover:bg-white'
                    }`}
                  >
                    حاضرة 🟢
                  </button>
                  <button
                    onClick={() => handleSetAttendance(selectedStudent.id, 'excused')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      todayAttendanceMap[selectedStudent.id]?.status === 'excused'
                        ? 'bg-[#775a19] text-white shadow-xs'
                        : 'text-[#3f4944] hover:bg-white'
                    }`}
                  >
                    بعذر 🟡
                  </button>
                  <button
                    onClick={() => handleSetAttendance(selectedStudent.id, 'unexcused')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      todayAttendanceMap[selectedStudent.id]?.status === 'unexcused'
                        ? 'bg-[#ba1a1a] text-white shadow-xs'
                        : 'text-[#3f4944] hover:bg-white'
                    }`}
                  >
                    بدون عذر 🔴
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: 4 Branches + Monthly Calendar */}
              <div className="flex bg-white p-1.5 rounded-2xl border border-[#bfc9c2]/30 shadow-2xs overflow-x-auto gap-1">
                {[
                  { id: 'newMem', label: 'الحفظ الجديد', icon: 'auto_stories' },
                  { id: 'nearRev', label: 'المراجعة القريبة', icon: 'history' },
                  { id: 'farRev', label: 'المراجعة البعيدة', icon: 'library_books' },
                  { id: 'oldMem', label: 'الحفظ القديم', icon: 'bookmark' },
                  { id: 'attendanceCalendar', label: 'جدول وخطة الشهر', icon: 'calendar_month' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentSection(tab.id as typeof currentSection)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      currentSection === tab.id
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

              {/* 1) NEW MEMORIZATION SECTION */}
              {currentSection === 'newMem' && (
                <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#004331] text-[22px]">
                        auto_stories
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                        سجل الحفظ الجديد (taj_memorization)
                      </h3>
                    </div>
                    <button
                      onClick={() => openModal('newMem')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">
                        add
                      </span>
                      إضافة تسميع جديد
                    </button>
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
                            <p className="text-xs text-[#6f7974] mt-1 italic">
                              "{item.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-[#004331] bg-white px-3 py-1 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                            {item.score} / ١٠
                          </span>
                          <button
                            onClick={() => handleDeleteRecord('newMem', item.id)}
                            className="p-1.5 rounded-lg bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#bfc9c2]/30"
                            title="حذف السجل"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {memorizationList.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#6f7974]">
                        لا توجد تسميعات مسجلة للحفظ الجديد بعد.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2) NEAR REVIEW SECTION */}
              {currentSection === 'nearRev' && (
                <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-[22px]">
                        history
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                        سجل المراجعة القريبة (الصغرى) (taj_near_review)
                      </h3>
                    </div>
                    <button
                      onClick={() => openModal('nearRev')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">
                        add
                      </span>
                      إضافة مراجعة قريبة
                    </button>
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

                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-[#775a19] bg-white px-3 py-1 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                            {item.score} / ١٠
                          </span>
                          <button
                            onClick={() => handleDeleteRecord('nearRev', item.id)}
                            className="p-1.5 rounded-lg bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#bfc9c2]/30"
                            title="حذف السجل"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {nearReviewList.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#6f7974]">
                        لا توجد سجلات للمراجعة القريبة بعد.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3) FAR REVIEW SECTION */}
              {currentSection === 'farRev' && (
                <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005d3f] text-[22px]">
                        library_books
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                        سجل المراجعة البعيدة (الكبرى) (taj_far_review)
                      </h3>
                    </div>
                    <button
                      onClick={() => openModal('farRev')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">
                        add
                      </span>
                      إضافة مراجعة كبرى
                    </button>
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
                              <span className="px-2 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-[10px] font-bold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                ختم تثبيت السرد
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#3f4944] block mt-1">
                            التاريخ: {item.date} {item.notes && `• "${item.notes}"`}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-[#005d3f] bg-white px-3 py-1 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                            {item.score} / ١٠
                          </span>
                          <button
                            onClick={() => handleDeleteRecord('farRev', item.id)}
                            className="p-1.5 rounded-lg bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#bfc9c2]/30"
                            title="حذف السجل"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {farReviewList.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#6f7974]">
                        لا توجد سجلات للمراجعة البعيدة بعد.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4) OLD MEMORIZATION SECTION */}
              {currentSection === 'oldMem' && (
                <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-[22px]">
                        bookmark
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                        سجل الحفظ القديم (taj_old_memorization)
                      </h3>
                    </div>
                    <button
                      onClick={() => openModal('oldMem')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#85f8c4]">
                        add
                      </span>
                      إضافة حفظ قديم
                    </button>
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

                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-[#775a19] bg-white px-3 py-1 rounded-xl border border-[#bfc9c2]/30 shadow-2xs">
                            {item.score} / ١٠
                          </span>
                          <button
                            onClick={() => handleDeleteRecord('oldMem', item.id)}
                            className="p-1.5 rounded-lg bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#bfc9c2]/30"
                            title="حذف السجل"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {oldMemList.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#6f7974]">
                        لا توجد سجلات للحفظ القديم بعد.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5) MONTHLY ATTENDANCE CALENDAR SECTION */}
              {currentSection === 'attendanceCalendar' && (
                <div className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
                  {/* Calendar Header with Month Navigation */}
                  <div className="flex items-center justify-between border-b border-[#bfc9c2]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#004331] text-[22px]">
                        calendar_month
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                        جدول الشهر وتقويم الحضور والغياب اليومي (taj_attendance)
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentCalendarDate(
                            new Date(year, month - 1, 1)
                          )
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
                          setCurrentCalendarDate(
                            new Date(year, month + 1, 1)
                          )
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
                      حاضرة (أخضر)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#fed488]"></span>
                      غائبة بعذر (عنبري)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
                      غائبة بدون عذر (أحمر)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#eff4ff] border border-[#bfc9c2]"></span>
                      لم ترصد بعد
                    </span>
                  </div>

                  {/* Calendar Grid (Days 1 to End of Month) */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                      const record = getAttendanceForDay(dayNum);
                      const status = record?.status;
                      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isToday = formattedDate === todayStr;

                      return (
                        <div
                          key={dayNum}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all border ${
                            isToday ? 'ring-2 ring-[#004331] font-bold' : ''
                          } ${
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
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#bfc9c2]/30 text-[#6f7974] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c2]">
                person_search
              </span>
              <p className="text-sm font-semibold">
                يرجى اختيار حافظة من القائمة لعرض سجلات الحفظ والمراجعات والغياب
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Memorization / Review Record */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004331]/60 backdrop-blur-xs"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#bfc9c2]/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#eff4ff] px-6 py-4 border-b border-[#bfc9c2]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004331] text-[22px]">
                  edit_note
                </span>
                <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                  {modalType === 'newMem'
                    ? 'رصد تسميع الحفظ الجديد'
                    : modalType === 'nearRev'
                    ? 'رصد المراجعة القريبة (الصغرى)'
                    : modalType === 'farRev'
                    ? 'رصد المراجعة البعيدة (الكبرى)'
                    : 'رصد الحفظ القديم'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">التاريخ:</label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">السورة:</label>
                  <select
                    value={entrySurah}
                    onChange={(e) => setEntrySurah(e.target.value)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] font-bold border border-[#bfc9c2]/40 focus:outline-none cursor-pointer"
                  >
                    {QURAN_SURAHS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.id}. سورة {s.name} ({s.ayahsCount} آية)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">من آية:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fromAyah}
                    onChange={(e) => setFromAyah(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">إلى آية:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={toAyah}
                    onChange={(e) => setToAyah(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                  />
                </div>
              </div>

              {modalType === 'newMem' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#0b1c30] block">المقدار (أوجه):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={pagesCount}
                      onChange={(e) => setPagesCount(parseFloat(e.target.value) || 1)}
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#0b1c30] block">أخطاء لفظية:</label>
                    <input
                      type="number"
                      min="0"
                      value={verbalErrors}
                      onChange={(e) => setVerbalErrors(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#0b1c30] block">تنبيهات:</label>
                    <input
                      type="number"
                      min="0"
                      value={warnings}
                      onChange={(e) => setWarnings(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">الدرجة من ١٠:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={score}
                    onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs font-bold text-[#004331] border border-[#bfc9c2]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#0b1c30] block">التقدير:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] font-bold border border-[#bfc9c2]/40 cursor-pointer"
                  >
                    <option value="ممتاز مرتفع">ممتاز مرتفع (متقن)</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="متقن جداً">متقن جداً</option>
                    <option value="سرد متقن كالفاتحة">سرد متقن كالفاتحة</option>
                    <option value="جيد جداً">جيد جداً</option>
                    <option value="يحتاج تثبيت">يحتاج تثبيت</option>
                  </select>
                </div>
              </div>

              {modalType === 'farRev' && (
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-[#eff4ff]">
                  <input
                    type="checkbox"
                    checked={hasSanad}
                    onChange={(e) => setHasSanad(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004331]"
                  />
                  <span className="text-xs font-bold text-[#785a1a]">
                    منح وسام "ختم تثبيت السرد المعتمد"
                  </span>
                </label>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">ملاحظات التجويد والتوجيه:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: ضبط أزمنة الغنن وتفخيم حروف الاستعلاء..."
                  rows={2}
                  className="w-full bg-[#f8f9ff] p-2.5 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#bfc9c2]/30 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#3f4944] text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold"
                >
                  حفظ واعتماد التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
