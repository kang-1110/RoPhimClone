import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import frFR from 'antd/es/locale/fr_FR'; // ví dụ nếu cần hỗ trợ thêm ngôn ngữ
import { getCookie } from '../../utils/utils';
import { STORAGES } from '../../constants/storage';
import { useTranslation } from 'react-i18next';


// Định nghĩa đối tượng ánh xạ giữa mã ngôn ngữ và đối tượng locale của antd
const localeMappings: { [key: string]: any } = {
  en: enUS,
  vi: viVN,
  fr: frFR,
};

interface LocaleProviderProps {
  children: ReactNode;
}

const LocaleProvider: FC<LocaleProviderProps> = ({ children }) => {
  // Nếu sử dụng global state, có thể lấy trực tiếp từ hook useLanguage
  const { i18n } = useTranslation()
  // const [localeObject, setLocaleObject] = useState<any>(enUS)
 
  const locale = localeMappings[i18n.language] || enUS;
  // // Chọn locale dựa trên language hiện tại (có thể là từ context hoặc cookie)
  // useEffect(() => {
  //     setLocaleObject(locale)
  // }, [i18n, i18n.language])

  return (
    <ConfigProvider locale={locale}>
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
