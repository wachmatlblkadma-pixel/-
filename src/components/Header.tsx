import React, { useState } from 'react';
import { SUPERVISOR_INFO, HALAQAH_CIRCLES } from '../data/mockData';

interface HeaderProps {
  activeCircleId: string;
  onCircleChange: (circleId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleMobileMenu: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCircleId,
  onCircleChange,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  onOpenNotifications,
}) => {
  const [showCircleMenu, setShowCircleMenu] = useState(false);
  const activeCircle =
    HALAQAH_CIRCLES.find((c) => c.id === activeCircleId) || HALAQAH_CIRCLES[0];

  return (
    <header className="fixed top-0 right-0 lg:right-72 left-0 h-20 bg-white/95 backdrop-blur-xl border-b border-[#bfc9c2]/30 shadow-2xs z-40 flex items-center justify-between px-4 sm:px-6 md:px-8 gap-3 sm:gap-6">
      {/* Right Area: Mobile Toggle & Active Circle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#eff4ff] text-[#004331] hover:bg-[#dce9ff] transition-colors"
          aria-label="القائمة الجانبية"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Ring Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCircleMenu(!showCircleMenu)}
            className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] px-3.5 py-2 rounded-xl border border-[#dce9ff] transition-all text-right cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#004331] text-[22px]">
              groups
            </span>
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-[#3f4944] font-medium leading-none mb-1">
                الحلقة النشطة
              </span>
              <span className="text-xs sm:text-sm text-[#0b1c30] font-bold leading-tight truncate max-w-[130px] sm:max-w-[180px]">
                {activeCircle.name}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#6f7974] text-[18px]">
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {showCircleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#bfc9c2]/40 py-2 z-50">
              <div className="px-3 py-2 border-b border-[#bfc9c2]/20 text-xs font-bold text-[#6f7974]">
                اختر حلقة التحفيظ
              </div>
              {HALAQAH_CIRCLES.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => {
                    onCircleChange(circle.id);
                    setShowCircleMenu(false);
                  }}
                  className={`w-full px-4 py-2.5 text-right flex items-center justify-between hover:bg-[#eff4ff] transition-colors ${
                    circle.id === activeCircleId
                      ? 'bg-[#eff4ff] text-[#004331] font-bold'
                      : 'text-[#0b1c30]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm">{circle.name}</span>
                    <span className="text-[11px] text-[#6f7974]">
                      {circle.category} • {circle.studentsCount} طالبة
                    </span>
                  </div>
                  {circle.id === activeCircleId && (
                    <span className="material-symbols-outlined text-[#0d5c46] text-[18px]">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden sm:block">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#eff4ff] pl-3 pr-10 py-2 rounded-xl text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#6f7974] border border-[#dce9ff] focus:outline-none focus:bg-white focus:border-[#0d5c46] focus:ring-2 focus:ring-[#0d5c46]/10 transition-all"
            placeholder="بحث عن حافظة، سورة، أو حزب..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6f7974] hover:text-[#0b1c30]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Left Area: Hijri Date, Notifications & Supervisor Profile */}
      <div className="flex items-center gap-3 sm:gap-6">
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
        <div className="relative">
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
        </div>

        {/* Supervisor Profile */}
        <div className="flex items-center gap-2.5 pr-2 sm:pr-3 border-r border-[#bfc9c2]/40">
          <div className="relative">
            <img
              alt="صورة المشرفة"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
              src={SUPERVISOR_INFO.avatarUrl}
            />
            <span
              className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-[#005d3f] rounded-full ring-2 ring-white"
              title="متصلة الآن"
            ></span>
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs sm:text-sm text-[#0b1c30] font-bold leading-tight">
              {SUPERVISOR_INFO.name}
            </span>
            <span className="text-[11px] text-[#775a19] font-semibold">
              مشرفة الحلقة • نشطة الآن
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
