import enUS from 'antd/es/locale/en_US';
import frFR from 'antd/es/locale/fr_FR'; // Ví dụ cho tiếng Pháp, nếu cần
import viVN from 'antd/es/locale/vi_VN';
import { DefaultOptionType } from 'antd/es/select';

export const languageOptions: DefaultOptionType[] = [
  {
    label: (
      <div className="flex items-center gap-2">
        <span className="flex-1">English</span>
        <img
          src="/public/images/flag-english.png"
          alt="English"
          className="aspect-square w-5 object-cover"
        />
      </div>
    ),
    flagLabel: (
      <div className='flex items-center justify-center'>
          <img
            src="/public/images/flag-english.png"
            alt="English"
            className="aspect-square w-5 object-cover"
          />
      </div>
    ),
    value: 'en',
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <span className="flex-1">Vietnamese</span>
        <img
          src="/public/images/flag-vietnam.png"
          alt="Vietnam"
          className="aspect-square w-5 object-cover"
        />
      </div>
    ),
    flagLabel: (
      <div className='flex justify-center items-center'>
        <img
          src="/public/images/flag-vietnam.png"
          alt="Vietnam"
          className="aspect-square w-5 object-cover"
        />
      </div>
    ),
    value: 'vi',
  },
];

export type LanguageType = 'en' | 'vi';

export const localeMappings: { [key: string]: any } = {
  en: enUS,
  vi: viVN,
  fr: frFR,
};

export const languagesSupport = [
  { key: "en", label: "English" },
  { key: "ko", label: "Korean" }
]

export type LanguageCode = "en" | "vi"

export const multipleLanguageKey = "translations"