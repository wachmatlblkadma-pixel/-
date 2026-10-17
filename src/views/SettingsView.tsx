import React, { useState } from 'react';

interface SettingsViewProps {
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [hifdhWeight, setHifdhWeight] = useState(50);
  const [nearRevWeight, setNearRevWeight] = useState(25);
  const [farRevWeight, setFarRevWeight] = useState(25);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState('05:30');
  const [sessionEndTime, setSessionEndTime] = useState('07:00');
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    `السلام عليكم ورحمة الله وبركاته،\nولي أمر الحافظة الكريمة، نحيطكم علماً بتقرير تسميع اليوم لمنصة تاج الوقار...`
  );

  const handleSave = () => {
    onShowToast('تم حفظ وتحديث إعدادات الحلقة وسياسة التقييم بنجاح');
  };

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Header */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
            إعدادات الحلقة ونظام التنبيهات المعتمد
          </h1>
          <p className="text-xs sm:text-sm text-[#3f4944] mt-1">
            ضبط أوزان التقييم الخمسة، قوالب رسائل الواتساب، وأوقات جلسات التسميع.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">
            save
          </span>
          حفظ كافة الإعدادات
        </button>
      </section>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grading Weights Box */}
        <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bfc9c2]/30 pb-3">
            <span className="material-symbols-outlined text-[#004331] text-[22px]">
              tune
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              أوزان فروع التقييم اليومي (المجموع: ١٠٠%)
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#0b1c30]">
                <span>١. الحفظ الجديد (اليومي):</span>
                <span className="text-[#004331]">{hifdhWeight}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                value={hifdhWeight}
                onChange={(e) => setHifdhWeight(Number(e.target.value))}
                className="w-full accent-[#004331] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#0b1c30]">
                <span>٢. المراجعة الصغرى (القريبة):</span>
                <span className="text-[#775a19]">{nearRevWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={nearRevWeight}
                onChange={(e) => setNearRevWeight(Number(e.target.value))}
                className="w-full accent-[#775a19] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#0b1c30]">
                <span>٣. المراجعة الكبرى (البعيدة التراكمية):</span>
                <span className="text-[#005d3f]">{farRevWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={farRevWeight}
                onChange={(e) => setFarRevWeight(Number(e.target.value))}
                className="w-full accent-[#005d3f] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] text-xs text-[#3f4944] border border-[#dce9ff]">
              <strong>ملاحظة الاعتماد:</strong> تُحسب ملاحظات التجويد كمعيار تدقيق
              مهاري إلزامي يُثبت في خانة الملاحظات الرسمية ولا يخصم إلا عند تكرار
              اللحن الجلي.
            </div>
          </div>
        </section>

        {/* WhatsApp & Portal Alerts */}
        <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bfc9c2]/30 pb-3">
            <span className="material-symbols-outlined text-[#25d366] text-[22px]">
              chat
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              إعدادات الربط مع واتساب وبوابة أولياء الأمور
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSendWhatsApp}
                onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                className="w-4 h-4 rounded text-[#004331] focus:ring-[#004331]"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                إرسال تقرير التسميع آلياً لولي الأمر فور اعتماد الدرجة
              </span>
            </label>

            <div className="space-y-1">
              <label className="text-xs text-[#3f4944] font-medium block">
                مقدمة رسالة الواتساب:
              </label>
              <textarea
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#eff4ff] text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#bfc9c2]/20 flex items-center justify-between text-xs">
              <span>حالة مزود خدمة الرسائل الفورية:</span>
              <span className="text-[#005d3f] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#005d3f]"></span>
                متصل ونشط
              </span>
            </div>
          </div>
        </section>

        {/* Session Timings */}
        <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bfc9c2]/30 pb-3">
            <span className="material-symbols-outlined text-[#775a19] text-[22px]">
              alarm
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              توقيت حلقة الفردوس (فترة الفجر)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <label className="text-xs text-[#3f4944] block mb-1">
                وقت بدء الجلسة:
              </label>
              <input
                type="time"
                value={sessionStartTime}
                onChange={(e) => setSessionStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] font-bold text-[#0b1c30] text-center"
              />
            </div>
            <div>
              <label className="text-xs text-[#3f4944] block mb-1">
                وقت ختام الجلسة:
              </label>
              <input
                type="time"
                value={sessionEndTime}
                onChange={(e) => setSessionEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] font-bold text-[#0b1c30] text-center"
              />
            </div>
          </div>
        </section>

        {/* Supervisor Permissions */}
        <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bfc9c2]/30 pb-3">
            <span className="material-symbols-outlined text-[#004331] text-[22px]">
              security
            </span>
            <h3 className="font-serif text-base font-bold text-[#0b1c30]">
              صلاحيات المشرفة والاعتماد
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl">
              <span>تعديل السجل بعد الاعتماد:</span>
              <span className="font-bold text-[#004331]">متاح خلال ٢٤ ساعة</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl">
              <span>اعتماد الشهادات بالسند:</span>
              <span className="font-bold text-[#775a19]">مشرفة الحلقة المعتمدة</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl">
              <span>تصدير تقارير الإدارة:</span>
              <span className="font-bold text-[#005d3f]">مفعل بالكامل</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
