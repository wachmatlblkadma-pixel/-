import React from 'react';
import { SUPERVISOR_INFO, STATS_SUMMARY } from '../data/mockData';

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
  const navItems = [
    {
      id: 'supervisor-dashboard',
      label: 'لوحة تحكم المشرفة',
      icon: 'grid_view',
    },
    {
      id: 'daily-tracking-and-evaluation',
      label: 'سجل التقييم والتقدم اليومي',
      icon: 'menu_book',
    },
    {
      id: 'monthly-schedule',
      label: 'جدول وخطة الشهر',
      icon: 'calendar_month',
    },
    {
      id: 'student-view-only-portal',
      label: 'بوابة استعراض الحافظة',
      icon: 'school',
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      icon: 'analytics',
    },
    {
      id: 'settings',
      label: 'إعدادات الحلقة والتنبيهات',
      icon: 'settings',
    },
  ];

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
            <div className="flex flex-col">
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
            <span className="w-2 h-2 rounded-full bg-[#775a19]"></span>
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
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Monthly Completion Progress Card */}
        <div className="p-4 m-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#3f4944] font-medium">
              إنجاز الختمات الشهري
            </span>
            <span className="text-xs text-[#004331] font-bold">
              {STATS_SUMMARY.monthlyPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d5c46] rounded-full transition-all duration-500"
              style={{ width: `${STATS_SUMMARY.monthlyPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-[#3f4944]">
            <span>تم إنجاز {STATS_SUMMARY.monthlyAchievedPages} وجه</span>
            <span>المستهدف: {STATS_SUMMARY.monthlyHifdhTargetPages}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
