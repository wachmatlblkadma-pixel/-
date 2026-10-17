export type AttendanceStatus = 'present' | 'excused' | 'late' | 'absent';

export interface StudentEvaluation {
  studentId: string;
  studentName: string;
  avatarUrl: string;
  track: string; // e.g. ختمة الإجازة, تحفيظ منتظم, الختمة الذهبية, تأهيل إتقان, ضبط المتشابهات
  level: string; // متقنة, جيد جداً, متقدم, ممتاز مرتفع
  circleId: string;
  circleName: string;
  attendance: AttendanceStatus;
  attendanceTime?: string;
  
  // 1. New Memorization (الحفظ الجديد)
  newMemorization: {
    surahRange: string;
    score: number; // out of 10
    pagesAmount: string; // e.g. ٢.٥ وجه (نصاب كامل)
    isComplete: boolean;
    verbalErrors: number; // أخطاء لفظية
    warningCount: number; // تنبيهات حركات
    warningDetail?: string; // e.g. توسط منفصل
    ratingLabel: string; // e.g. ممتاز مرتفع (متقن)
  };

  // 2. Near Revision (المراجعة الصغرى)
  nearRevision: {
    surahRange: string;
    score: number; // out of 10
    ratingLabel: string; // متقن جداً, يحتاج تثبيت, سرد متقن
  };

  // 3. Far Revision (المراجعة الكبرى)
  farRevision: {
    surahRange: string;
    score: number; // out of 10
    levelLabel: string; // ممتاز, متذبذب, متقن كالفاتحة
    hasSanadBadge?: boolean;
  };

  // 4. Tajweed & Vocal Performance (التجويد والمخارج)
  tajweed: {
    makhaarij: 'ممتاز' | 'متقن' | 'متميز' | 'جيد جداً' | 'جيد' | 'يحتاج مراجعة';
    ahkam: 'ممتاز' | 'متقن' | 'متميز' | 'جيد جداً' | 'جيد' | 'يحتاج مراجعة';
    waqf: 'ممتاز' | 'متقن' | 'متميز' | 'جيد جداً' | 'جيد' | 'يحتاج مراجعة';
    notes: string;
    audioRecitationUrl?: string;
  };

  // 5. Follow-up
  nextAssignment: string;
  sendWhatsAppNotice: boolean;
  parentPhone?: string;
  lastUpdated: string;
  isEvaluatedToday: boolean;
}

export interface HalaqahCircle {
  id: string;
  name: string;
  category: string;
  supervisorName: string;
  studentsCount: number;
  completedRatio: number;
  sessionTime: string;
  location: string;
}

export interface CalendarDayPlan {
  date: string;
  hijriDate: string;
  dayName: string;
  newMemTarget: string;
  nearRevTarget: string;
  farRevTarget: string;
  isExamDay?: boolean;
  isHoliday?: boolean;
  notes?: string;
}
