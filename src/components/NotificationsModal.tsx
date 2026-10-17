import React from 'react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      title: 'تم رصد وتثبيت حفظ مريم أحمد الناصر',
      detail: 'حصلت على درجة ١٠/١٠ في سورة النساء (الآيات ١ - ١٢).',
      time: 'منذ ١٢ دقيقة',
      type: 'success',
      icon: 'verified',
    },
    {
      id: 2,
      title: 'إشعار عذر مرضي - آية طارق التميمي',
      detail: 'قدم ولي الأمر تقرير عذر صحي، تم جدولة التعويض يوم الخميس.',
      time: 'منذ ساعة',
      type: 'warning',
      icon: 'event_busy',
    },
    {
      id: 3,
      title: 'تنبيه موعد اختبار التثبيت الدوري',
      detail: 'اختبار الحزب السابع لحلقة الفردوس مقرر يوم الخميس بعد صلاة الفجر.',
      time: 'منذ ساعتين',
      type: 'info',
      icon: 'notifications_active',
    },
    {
      id: 4,
      title: 'استفسار من والدة سارة الكندري',
      detail: 'تسأل عن جدول المراجعة المكثفة لشهر شعبان واستقبال رمضان.',
      time: 'أمس',
      type: 'info',
      icon: 'chat',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#bfc9c2]/40 overflow-hidden mt-16 sm:mr-72 animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#eff4ff] px-5 py-4 border-b border-[#bfc9c2]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004331] text-[22px]">
              notifications
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              تنبيهات وإشعارات الحلقة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white hover:bg-[#dce9ff] flex items-center justify-center text-[#3f4944]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="divide-y divide-[#bfc9c2]/20 max-h-[70vh] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-[#eff4ff]/60 transition-colors flex items-start gap-3 text-right"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'success'
                    ? 'bg-[#85f8c4]/40 text-[#005137]'
                    : item.type === 'warning'
                    ? 'bg-[#fed488]/40 text-[#785a1a]'
                    : 'bg-[#eff4ff] text-[#004331]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0b1c30]">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#6f7974]">{item.time}</span>
                </div>
                <p className="text-[11px] text-[#3f4944] mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#eff4ff] border-t border-[#bfc9c2]/20 text-center">
          <button
            onClick={onClose}
            className="text-xs text-[#004331] font-bold hover:underline"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </div>
    </div>
  );
};
