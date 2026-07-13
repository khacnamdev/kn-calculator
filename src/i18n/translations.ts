/**
 * Translation strings for all user-visible text in the app.
 * Add new keys here and use `useTranslation()` hook to access them.
 */

export type Language = 'en' | 'vi';

export type TranslationKeys = {
  // ── Settings screen ────────────────────────────────────────
  settings: string;

  // Sections
  sectionAppearance: string;
  sectionFormatting: string;
  sectionHistory: string;
  sectionFeedback: string;
  sectionLanguage: string;

  // Appearance
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;

  // Language
  language: string;
  langEnglish: string;
  langVietnamese: string;

  // Formatting
  decimalSeparator: string;
  decimalDot: string;
  decimalComma: string;
  thousandsSeparator: string;
  thousandsComma: string;
  thousandsDot: string;
  thousandsSpace: string;
  thousandsNone: string;
  decimalPrecision: string;
  unitDigits: string;

  // History
  autoSave: string;
  historyLimit: string;
  unitItems: string;
  historyFontSize: string;
  resultFontSize: string;
  expressionFontSize: string;

  // Appearance
  elderMode: string;
  elderModeSub: string;

  // Feedback
  vibrate: string;
  sound: string;
  soundSub: string;

  // ── Calculator screen ───────────────────────────────────────
  historyEmpty: string;
  historyTitle: string;
  increaseFontSize: string;
  decreaseFontSize: string;
};

const en: TranslationKeys = {
  settings: 'Settings',

  sectionAppearance: 'Appearance',
  sectionFormatting: 'Separators & Formatting',
  sectionHistory: 'History',
  sectionFeedback: 'Keypad Feedback',
  sectionLanguage: 'Language',

  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',

  language: 'Language',
  langEnglish: 'English',
  langVietnamese: 'Tiếng Việt',

  decimalSeparator: 'Decimal',
  decimalDot: 'Dot (.)',
  decimalComma: 'Comma (,)',
  thousandsSeparator: 'Thousands',
  thousandsComma: 'Comma',
  thousandsDot: 'Dot',
  thousandsSpace: 'Space',
  thousandsNone: 'None',
  decimalPrecision: 'Decimal Precision',
  unitDigits: 'digits',

  autoSave: 'Auto-Save Calculations',
  historyLimit: 'History Limit',
  unitItems: 'items',
  historyFontSize: 'History Font Size',
  resultFontSize: 'Result Font Size',
  expressionFontSize: 'Expression Font Size',

  vibrate: 'Vibrate on Keypress',
  sound: 'Audible Key Clicks',
  soundSub: 'Uses default system click sound',

  historyEmpty: 'No history yet',
  historyTitle: 'History',
  increaseFontSize: 'Increase font size',
  decreaseFontSize: 'Decrease font size',
  elderMode: 'Elder Friendly Mode',
  elderModeSub: 'Larger text, bold buttons, and unscrolled history list',
};

const vi: TranslationKeys = {
  settings: 'Cài đặt',

  sectionAppearance: 'Giao diện',
  sectionFormatting: 'Định dạng số',
  sectionHistory: 'Lịch sử',
  sectionFeedback: 'Phản hồi bàn phím',
  sectionLanguage: 'Ngôn ngữ',

  theme: 'Chủ đề',
  themeLight: 'Sáng',
  themeDark: 'Tối',
  themeSystem: 'Hệ thống',

  language: 'Ngôn ngữ',
  langEnglish: 'English',
  langVietnamese: 'Tiếng Việt',

  decimalSeparator: 'Dấu thập phân',
  decimalDot: 'Chấm (.)',
  decimalComma: 'Phẩy (,)',
  thousandsSeparator: 'Dấu phân nghìn',
  thousandsComma: 'Phẩy',
  thousandsDot: 'Chấm',
  thousandsSpace: 'Khoảng trắng',
  thousandsNone: 'Không có',
  decimalPrecision: 'Độ chính xác',
  unitDigits: 'chữ số',

  autoSave: 'Tự động lưu phép tính',
  historyLimit: 'Giới hạn lịch sử',
  unitItems: 'mục',
  historyFontSize: 'Cỡ chữ lịch sử',
  resultFontSize: 'Cỡ chữ kết quả',
  expressionFontSize: 'Cỡ chữ phép tính',

  vibrate: 'Rung khi nhấn phím',
  sound: 'Âm thanh phím',
  soundSub: 'Dùng âm thanh nhấn mặc định của hệ thống',

  historyEmpty: 'Chưa có lịch sử',
  historyTitle: 'Lịch sử',
  increaseFontSize: 'Tăng cỡ chữ',
  decreaseFontSize: 'Giảm cỡ chữ',
  elderMode: 'Chế độ người cao tuổi',
  elderModeSub: 'Chữ lớn hơn, nút đậm và lịch sử không cuộn',
};

export const translations: Record<Language, TranslationKeys> = { en, vi };
