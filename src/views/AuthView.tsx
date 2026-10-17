import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUPERVISOR_INFO } from '../data/mockData';
import { UserRole } from '../types/database';

interface AuthViewProps {
  onShowToast: (msg: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onShowToast }) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (isSignUpMode && !name.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل');
      return;
    }

    setLoading(true);

    if (isSignUpMode) {
      const { error } = await signUp(email, password, name, role);
      setLoading(false);
      if (error) {
        setErrorMessage(error.message);
      } else {
        onShowToast('تم إنشاء الحساب بنجاح! يتم الآن تسجيل دخولك...');
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setErrorMessage('فشل تسجيل الدخول. يرجى التأكد من صحة البريد وكلمة المرور.');
      } else {
        onShowToast('أهلاً بكِ في منصة تاج الوقار');
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4 sm:p-6"
      dir="rtl"
    >
      {/* Brand Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#bfc9c2]/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-l from-[#004331] to-[#0d5c46] p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/5 rounded-full pointer-events-none"></div>
          <img
            src={SUPERVISOR_INFO.institutionLogo}
            alt="تاج الوقار"
            className="w-16 h-16 mx-auto mb-3 object-contain rounded-2xl bg-white/10 p-2 shadow-sm"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            تاج الوقار
          </h1>
          <p className="text-xs sm:text-sm text-[#85f8c4] mt-1 font-medium">
            منصة حلقات الحافظات وإدارة مسارات القرآن الكريم
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] text-[#ffdea5]">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            نظام التحفيظ المعتمد
          </div>
        </div>

        {/* Warning if Supabase Anon Key is not set in .env */}
        {!isConfigured && (
          <div className="p-4 bg-[#fed488]/30 border-b border-[#fed488] text-xs text-[#785a1a] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#775a19] text-[20px] shrink-0 mt-0.5">
              info
            </span>
            <div>
              <strong className="block font-bold">تنبيه إعداد الاتصال:</strong>
              يرجى إضافة المفتاح العام <code className="bg-white/80 px-1 py-0.5 rounded text-[10px]">VITE_SUPABASE_ANON_KEY</code> في ملف <code className="bg-white/80 px-1 py-0.5 rounded text-[10px]">.env</code> للاتصال بمشروعك في Supabase.
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Toggle Login / SignUp */}
          <div className="flex bg-[#eff4ff] p-1 rounded-2xl border border-[#dce9ff]">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                !isSignUpMode
                  ? 'bg-[#004331] text-white shadow-xs'
                  : 'text-[#3f4944] hover:text-[#0b1c30]'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSignUpMode
                  ? 'bg-[#004331] text-white shadow-xs'
                  : 'text-[#3f4944] hover:text-[#0b1c30]'
              }`}
            >
              تسجيل مستخدمة جديدة
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUpMode && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0b1c30] block">
                    الاسم الكامل:
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[20px]">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: مريم أحمد الناصر"
                      className="w-full bg-[#f8f9ff] pl-3 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none focus:border-[#004331] focus:ring-2 focus:ring-[#004331]/10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0b1c30] block">
                    الدور المبدئي:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#f8f9ff] px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] font-bold border border-[#bfc9c2]/40 focus:outline-none focus:border-[#004331] cursor-pointer"
                  >
                    <option value="student">طالبة / حافظة (عرض فقط)</option>
                    <option value="supervisor">مشرفة حلقة (رصد وتعديل)</option>
                    <option value="admin">مديرة النظام (إشراف كامل)</option>
                  </select>
                  <span className="text-[11px] text-[#6f7974] block">
                    ملاحظة: تستطيع المديرة تعديل دور أي مستخدمة وتعيين مجموعتها في أي وقت.
                  </span>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0b1c30] block">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#f8f9ff] pl-3 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none focus:border-[#004331] focus:ring-2 focus:ring-[#004331]/10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0b1c30] block">
                كلمة المرور:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8f9ff] pl-3 pr-10 py-2.5 rounded-xl text-xs sm:text-sm text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none focus:border-[#004331] focus:ring-2 focus:ring-[#004331]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ المعالجة...</span>
                </>
              ) : isSignUpMode ? (
                <>
                  <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
                    person_add
                  </span>
                  <span>إنشاء الحساب والدخول</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
                    login
                  </span>
                  <span>تسجيل الدخول للنظام</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#eff4ff] border-t border-[#bfc9c2]/30 text-center text-xs text-[#3f4944]">
          <span>منصة تاج الوقار • نظام مشفر ومحمي بـ RLS على مستوى الصفوف</span>
        </div>
      </div>
    </div>
  );
};
