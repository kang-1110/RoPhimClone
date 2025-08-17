import { GlobalOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';
import { STORAGES } from '../../constants/storage';
import { getCookie, setCookie } from '../../utils/utils';
import { languageOptions, LanguageType } from '../../constants/languages';
import { useTranslation } from 'react-i18next';

interface LanguageSelectProps {
  className?: string;
  size?: SizeType;
  mini?: boolean
}

const LanguageSelect = ({ 
  className, 
  size, 
  mini = false 
} : LanguageSelectProps) => {
  const storedLang = getCookie(STORAGES.LANGUAGE) ?? "en"
  const [language, setLanguage] = useState<LanguageType>(storedLang);
  const { i18n } = useTranslation()
  const isSupportedLanguage = import.meta.env.VITE_SUPPORT_LANGUAGE;

  const handleChange = (language: LanguageType) => {
    setLanguage(language)
    i18n.changeLanguage(language)
    setCookie(STORAGES.LANGUAGE, language)
  }

  if (isSupportedLanguage === "true") {

    // Nếu mini = true, tạo mảng options chỉ có flag
    const options = mini
      ? languageOptions.map(option => ({
          ...option,
          label: option.flagLabel, // thay thế label bằng flagLabel
        }))
      : languageOptions;

    return (
      <Select
        size={size ?? "large"}
        options={options}
        onChange={handleChange}
        defaultValue={language}
        className={className}
        value={language}
        suffixIcon={<GlobalOutlined />}
        optionLabelProp={mini ? "flagLabel" : "label"}
      />
    );
  } else {
    return null;
  }
};

export default LanguageSelect;
