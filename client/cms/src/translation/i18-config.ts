// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Nếu dùng detector ngôn ngữ, import như sau:
// import LanguageDetector from 'i18next-browser-languagedetector';
import { STORAGES } from '../constants/storage';
import { getCookie } from '../utils/utils';
import enTranslations from "./languages/en";
import viTranslations from "./languages/vi";

const language = getCookie(STORAGES.LANGUAGE)

const resources = {
  en: {
    translation: enTranslations
  },
  vi: {
    translation: viTranslations
  }
};

// Nếu dùng LanguageDetector, bạn có thể thêm như sau:
// i18n.use(LanguageDetector)

i18n
  .use(initReactI18next) // truyền i18n instance xuống react-i18next
  .init({
    resources,
    lng: language, // ngôn ngữ mặc định
    fallbackLng: 'en', // ngôn ngữ dự phòng nếu key không có trong ngôn ngữ hiện tại
    interpolation: {
      escapeValue: false, // React đã có bảo mật nên không cần escape
    }
  })

export default i18n;
