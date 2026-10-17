import React from 'react';
import { SUPERVISOR_INFO } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenNotifications,
}) => {
  const { user, profile, role, signOut } = useAuth();

  const roleTitle =
    role === 'admin'
      ? 'مديرة النظام المعتمدة'
      : role === 'supervisor'
      ? 'مشرفة الحلقة'
      : 'حافظة القرآن الكريم';

  const roleBadge =
    role === 'admin'
      ? 'bg-[#85f8c4]/40 text-[#005137]'
      : role === 'supervisor'
      ? 'bg-[#fed488]/40 text-[#785a1a]'
      : 'bg-[#eff4ff] text-[#004331]';

  return (
    <header className="fixed top-0 right-0 lg:right-72 left-0 h-20 bg-white/95 backdrop-blur-xl border-b border-[#bfc9c2]/30 shadow-2xs z-40 flex items-center justify-between px-4 sm:px-6 md:px-8 gap-3 sm:gap-6">
      {/* Right Area: Mobile Toggle & Title */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#eff4ff] text-[#004331] hover:bg-[#dce9ff] transition-colors"
          aria-label="القائمة الجانبية"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004331] text-[24px] hidden sm:inline">
            auto_stories
          </span>
          <div className="flex flex-col text-right">
            <span className="font-serif text-sm sm:text-base font-bold text-[#004331] leading-tight">
              تاج الوقار
            </span>
            <span className="text-[11px] text-[#3f4944] font-medium">
              {profile?.group_name ? `حلقة: ${profile.group_name}` : 'منصة حلقات الحافظات'}
            </span>
          </div>
        </div>
      </div>

      {/* Left Area: Hijri Date, Notifications, Profile & Logout */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Hijri Date Display */}
        <div className="hidden xl:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#0b1c30]">
            {SUPERVISOR_INFO.hijriDate}
          </span>
          <span className="text-[11px] text-[#3f4944]">
            {SUPERVISOR_INFO.gregorianDate}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center text-[#3f4944] transition-colors relative cursor-pointer"
          title="التنبيهات والإشعارات"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pr-2 sm:pr-3 border-r border-[#bfc9c2]/40">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#004331] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs border-2 border-white">
              {profile?.name ? profile.name.charAt(0) : user?.email?.charAt(0)?.toUpperCase() || 'م'}
            </div>
            <span
              className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-[#005d3f] rounded-full ring-2 ring-white"
              title="متصلة الآن"
            ></span>
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs sm:text-sm text-[#0b1c30] font-bold leading-tight">
              {profile?.name || user?.email?.split('@')[0] || 'المستخدمة'}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${roleBadge} inline-block w-fit mt-0.5`}>
              {roleTitle}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={signOut}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border border-[#ba1a1a]/20"
          title="تسجيل الخروج"
        >
          <span className="material-symbols-outlined text-[18px]">
            logout
          </span>
          <span className="hidden md:inline">خروج</span>
        </button>
      </div>
    </header>
  );
};
