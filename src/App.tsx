import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DetailedEvaluationModal } from './components/DetailedEvaluationModal';
import { QuickEvaluationDrawer } from './components/QuickEvaluationDrawer';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Toast } from './components/Toast';

import { DailyTrackingView } from './views/DailyTrackingView';
import { SupervisorDashboardView } from './views/SupervisorDashboardView';
import { MonthlyScheduleView } from './views/MonthlyScheduleView';
import { StudentPortalView } from './views/StudentPortalView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { INITIAL_STUDENTS } from './data/mockData';
import { StudentEvaluation } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(
    'daily-tracking-and-evaluation'
  );
  const [students, setStudents] = useState<StudentEvaluation[]>(INITIAL_STUDENTS);
  const [activeCircleId, setActiveCircleId] = useState<string>('alfirdous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modals & Drawers state
  const [detailedModalStudent, setDetailedModalStudent] =
    useState<StudentEvaluation | null>(null);
  const [drawerStudent, setDrawerStudent] = useState<StudentEvaluation | null>(
    null
  );
  const [whatsappStudent, setWhatsappStudent] =
    useState<StudentEvaluation | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleUpdateStudent = (updatedStudent: StudentEvaluation) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === updatedStudent.studentId ? updatedStudent : s
      )
    );
  };

  const handleSaveFromModal = (
    updatedStudent: StudentEvaluation,
    isDraft: boolean
  ) => {
    handleUpdateStudent(updatedStudent);
    setDetailedModalStudent(null);
    if (isDraft) {
      showToast(`تم حفظ مسودة تقييم الحافظة: ${updatedStudent.studentName}`);
    } else {
      showToast(
        `تم اعتماد ورصد التقييم النهائي للحافظة: ${updatedStudent.studentName} بنجاح`
      );
      if (updatedStudent.sendWhatsAppNotice) {
        setTimeout(() => {
          showToast(`تم إرسال إشعار التقييم لولي الأمر عبر واتساب`);
        }, 1200);
      }
    }
  };

  const handleSaveFromDrawer = (updatedStudent: StudentEvaluation) => {
    handleUpdateStudent(updatedStudent);
    setDrawerStudent(null);
    showToast(`تم تحديث وحفظ سجل الحافظة: ${updatedStudent.studentName}`);
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attendance: 'present',
        attendanceTime: '٠٥:٣٠ ص',
      }))
    );
    showToast('تم رصد الحضور لجميع الحافظات في الجلسة الميدانية');
  };

  const handleSaveEntireSession = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        isEvaluatedToday: true,
        lastUpdated: 'تم الاعتماد',
      }))
    );
    showToast('تم اعتماد وحفظ جميع درجات وتقييمات حلقة الفردوس بنجاح');
  };

  return (
    <div
      className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#aaf1d4] selection:text-[#004331]"
      dir="rtl"
    >
      {/* Right Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (padded 72 on desktop for fixed right sidebar) */}
      <div className="lg:pr-72 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <Header
          activeCircleId={activeCircleId}
          onCircleChange={setActiveCircleId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNotifications={() => setShowNotifications(true)}
        />

        {/* Viewport Content */}
        <main className="relative pt-24 px-4 sm:px-6 md:px-8 w-full flex-1 max-w-[1550px] mx-auto">
          {currentTab === 'daily-tracking-and-evaluation' && (
            <DailyTrackingView
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onOpenDetailedModal={(s) => setDetailedModalStudent(s)}
              onOpenQuickDrawer={(s) => setDrawerStudent(s)}
              onShowToast={showToast}
              onMarkAllPresent={handleMarkAllPresent}
              onSaveEntireSession={handleSaveEntireSession}
            />
          )}

          {currentTab === 'supervisor-dashboard' && (
            <SupervisorDashboardView
              students={students}
              onOpenDetailedModal={(s) => setDetailedModalStudent(s)}
              onNavigateToTracking={() =>
                setCurrentTab('daily-tracking-and-evaluation')
              }
              onShowToast={showToast}
            />
          )}

          {currentTab === 'monthly-schedule' && (
            <MonthlyScheduleView onShowToast={showToast} />
          )}

          {currentTab === 'student-view-only-portal' && (
            <StudentPortalView students={students} onShowToast={showToast} />
          )}

          {currentTab === 'reports' && (
            <ReportsView students={students} onShowToast={showToast} />
          )}

          {currentTab === 'settings' && (
            <SettingsView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      {detailedModalStudent && (
        <DetailedEvaluationModal
          student={detailedModalStudent}
          onClose={() => setDetailedModalStudent(null)}
          onSave={handleSaveFromModal}
          onOpenWhatsAppPreview={(s) => setWhatsappStudent(s)}
        />
      )}

      {drawerStudent && (
        <QuickEvaluationDrawer
          student={drawerStudent}
          onClose={() => setDrawerStudent(null)}
          onSave={handleSaveFromDrawer}
        />
      )}

      {whatsappStudent && (
        <WhatsAppPreviewModal
          student={whatsappStudent}
          onClose={() => setWhatsappStudent(null)}
          onConfirmSend={() =>
            showToast(
              `تم إرسال إشعار التقييم بنجاح إلى ولي أمر: ${whatsappStudent.studentName}`
            )
          }
        />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
