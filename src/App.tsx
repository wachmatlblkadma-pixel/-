import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { NotificationsModal } from './components/NotificationsModal';

import { AuthView } from './views/AuthView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SupervisorView } from './views/SupervisorView';
import { StudentView } from './views/StudentView';
import { MonthlyScheduleView } from './views/MonthlyScheduleView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { INITIAL_STUDENTS } from './data/mockData';

function AppContent() {
  const { user, role, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('supervisor-workspace');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Route user according to role when role loads or changes
  useEffect(() => {
    if (role === 'admin') {
      setCurrentTab('admin-dashboard');
    } else if (role === 'supervisor') {
      setCurrentTab('supervisor-workspace');
    } else if (role === 'student') {
      setCurrentTab('student-portal');
    }
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="w-12 h-12 border-4 border-[#004331] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="font-serif text-lg font-bold text-[#004331]">
          تاج الوقار • جاري تحميل النظام والتحقق من الصلاحيات...
        </span>
      </div>
    );
  }

  // Not logged in -> Show Authentication View
  if (!user) {
    return (
      <>
        <AuthView onShowToast={showToast} />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

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

      {/* Main Content Area */}
      <div className="lg:pr-72 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNotifications={() => setShowNotifications(true)}
        />

        {/* Viewport Content */}
        <main className="relative pt-24 px-4 sm:px-6 md:px-8 w-full flex-1 max-w-[1550px] mx-auto">
          {/* Admin Dashboard */}
          {currentTab === 'admin-dashboard' && (
            <AdminDashboardView onShowToast={showToast} />
          )}

          {/* Supervisor Workspace */}
          {currentTab === 'supervisor-workspace' && (
            <SupervisorView onShowToast={showToast} />
          )}

          {/* Student View Only Portal */}
          {currentTab === 'student-portal' && (
            <StudentView onShowToast={showToast} />
          )}

          {/* Monthly Schedule Plan */}
          {currentTab === 'monthly-schedule' && (
            <MonthlyScheduleView onShowToast={showToast} />
          )}

          {/* Reports & Analytics */}
          {currentTab === 'reports' && (
            <ReportsView students={INITIAL_STUDENTS} onShowToast={showToast} />
          )}

          {/* Settings */}
          {currentTab === 'settings' && (
            <SettingsView onShowToast={showToast} />
          )}
        </main>
      </div>

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
