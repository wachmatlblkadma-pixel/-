import React from 'react';
import { StudentEvaluation } from '../types';

interface WhatsAppPreviewModalProps {
  student: StudentEvaluation;
  onClose: () => void;
  onConfirmSend: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  student,
  onClose,
  onConfirmSend,
}) => {
  const messageText = `✨ *تقرير التقييم اليومي لحافظات كتاب الله* ✨
منصة *تاج الوقار* • حلقة ${student.circleName}
━━━━━━━━━━━━━━━━━━
السلام عليكم ورحمة الله وبركاته،
ولي أمر الحافظة الفاضلة: *${student.studentName}* حفظها الله ورعاها.

يسرنا إحاطتكم بملخص إنجاز ابنتكم في حلقة اليوم (الثلاثاء ١٤ شعبان):

📖 *الحفظ الجديد:*
• المقرر: ${student.newMemorization.surahRange}
• الدرجة: ${student.newMemorization.score} / ١٠ (${student.newMemorization.ratingLabel})
• الأخطاء اللفظية: ${student.newMemorization.verbalErrors} | التنبيهات: ${student.newMemorization.warningCount}

🔁 *المراجعة الصغرى (القريبة):*
• المقرر: ${student.nearRevision.surahRange}
• التقدير: ${student.nearRevision.score} / ١٠ (${student.nearRevision.ratingLabel})

📚 *المراجعة الكبرى (البعيدة):*
• المقرر: ${student.farRevision.surahRange}
• التقدير: ${student.farRevision.score} / ١٠ (${student.farRevision.levelLabel})

🎯 *ملاحظات التجويد والتوجيه:*
"${student.tajweed.notes}"

📌 *تكليف ومقرر الجلسة القادمة:*
${student.nextAssignment}

بارك الله في مسعاها وجعلها من أهل القرآن وخاصته.
مشرفة الحلقة: أ. فاطمة الزهراء`;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-[#efeae2] rounded-3xl shadow-2xl border border-[#bfc9c2]/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* WhatsApp Header Bar */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-[#25d366]">
              chat
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-sm">
                معاينة إشعار واتساب لولي الأمر
              </span>
              <span className="text-[11px] text-[#8cd2b6]">
                إلى: {student.studentName} ({student.parentPhone || 'هاتف مسجل'})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Message Bubble Body */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="bg-white rounded-2xl rounded-tr-xs p-4 shadow-sm border border-[#e2e8f0] text-xs leading-relaxed text-[#111b21] whitespace-pre-line font-sans">
            {messageText}
            <div className="flex justify-end items-center gap-1 mt-2 text-[10px] text-[#667781]">
              <span>٠٦:٤٥ ص</span>
              <span className="material-symbols-outlined text-[14px] text-[#53bdeb]">
                done_all
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f0f2f5] border-t border-[#bfc9c2]/30 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#e5eeff] text-[#3f4944] text-xs font-semibold transition-colors shadow-2xs"
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              onConfirmSend();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>إرسال الإشعار لولي الأمر الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
