import React from 'react';
import { SUPERVISOR_INFO } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { role, profile, signOut } = useAuth();

  // Navigation tailored by role
  let navItems: { id: string; label: string; icon: string }[] = [];

  if (role === 'admin') {
    navItems = [
      {
        id: 'admin-dashboard',
        label: 'لوحة تحكم المديرة والمجموعات',
        icon: 'admin_panel_settings',
      },
      {
        id: 'supervisor-workspace',
        label: 'مساحة متابعة الحلقات',
        icon: 'menu_book',
      },
      {
        id: 'reports',
        label: 'التقارير والإحصائيات',
        icon: 'analytics',
      },
      {
        id: 'settings',
        label: 'إعدادات النظام والتنبيهات',
        icon: 'settings',
      },
    ];
  } else if (role === 'supervisor') {
    navItems = [
      {
        id: 'supervisor-workspace',
        label: 'سجل رصد الحلقة والحافظات',
        icon: 'menu_book',
      },
      {
        id: 'monthly-schedule',
        label: 'جدول وخطة الشهر',
        icon: 'calendar_month',
      },
      {
        id: 'reports',
        label: 'إحصائيات الحلقة',
        icon: 'analytics',
      },
      {
        id: 'settings',
        label: 'إعدادات الحلقة',
        icon: 'settings',
      },
    ];
  } else {
    // student
    navItems = [
      {
        id: 'student-portal',
        label: 'مساري وسجل حفظي (عرض فقط)',
        icon: 'school',
      },
      {
        id: 'monthly-schedule',
        label: 'خطة الشهر ومقرر الحفظ',
        icon: 'calendar_month',
      },
    ];
  }

  const roleLabel =
    role === 'admin'
      ? 'مديرة النظام'
      : role === 'supervisor'
      ? 'مشرفة حلقة'
      : 'حافظة';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#004331]/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-l border-[#bfc9c2]/30 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 bg-[#eff4ff] border-b border-[#bfc9c2]/30">
          <div className="flex items-center gap-3">
            <img
              alt="شعار تاج الوقار"
              className="h-10 w-10 object-contain rounded-xl shadow-xs"
              src={SUPERVISOR_INFO.institutionLogo}
            />
            <div className="flex flex-col text-right">
              <span className="font-serif text-lg text-[#004331] font-bold tracking-tight">
                تاج الوقار
              </span>
              <span className="text-xs text-[#3f4944] font-medium">
                منصة حلقات الحافظات
              </span>
            </div>
          </div>
          {/* Close for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#3f4944] hover:bg-white"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Accreditation Seal Badge */}
        <div className="px-4 py-3">
          <div className="bg-[#e5eeff] px-3.5 py-2 rounded-xl flex items-center justify-between text-[#775a19] text-xs font-semibold shadow-2xs border border-[#fed488]/40">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#775a19]">
                verified
              </span>
              نظام التحفيظ المعتمد
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 text-right ${
                  isActive
                    ? 'bg-[#0d5c46] text-white font-bold shadow-sm'
                    : 'text-[#3f4944] hover:bg-[#eff4ff] hover:text-[#0b1c30] font-medium'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'text-[#85f8c4]' : 'text-[#6f7974]'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-xs sm:text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile Card & Logout at Bottom */}
        <div className="p-3 m-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#004331] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {profile?.name ? profile.name.charAt(0) : 'م'}
            </div>
            <div className="flex flex-col text-right overflow-hidden">
              <span className="font-bold text-xs text-[#0b1c30] truncate">
                {profile?.name || 'مستخدمة مسجلة'}
              </span>
              <span className="text-[10px] text-[#775a19] font-semibold truncate">
                {profile?.group_name ? `حلقة ${profile.group_name}` : roleLabel}
              </span>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full py-2 rounded-xl bg-white hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#bfc9c2]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
};
