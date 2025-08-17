import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { LanguageType } from '../constants/languages';
import { useTranslation } from 'react-i18next';

export interface LocationDefaultProps {
  province: { label: string | null; value: string | null };
  district: { label: string | null; value: string | null };
  address: string;
}

export interface LoadingUploadProps {
  avatar: boolean;
  attachment: boolean;
  panorama: boolean;
  image: boolean;
  thumbnail: boolean;
  preview: boolean;
  original: boolean;
}
interface GlobalVariableContextProps {
  locationValue?: LocationDefaultProps | undefined;
  locationKey?: string;
  loadingUpload?: LoadingUploadProps;
  setLocationValue: (locationValue: LocationDefaultProps) => void;
  setLocationKey: (locationKey: string) => void;
  setLoadingUpload: (loadingUpload: LoadingUploadProps) => void;
}

const GlobalVariableContext = createContext<
  GlobalVariableContextProps | undefined
>(undefined);

export const GlobalVariableProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [locationValue, setLocationValue] = useState<LocationDefaultProps>();
  const [locationKey, setLocationKey] = useState<string>('');
  const [loadingUpload, setLoadingUpload] = useState<LoadingUploadProps>({
    thumbnail: false,
    preview: false,
    original: false,
    panorama: false,
    image: false,
    attachment: false,
    avatar: false,
  });

  return (
    <GlobalVariableContext.Provider
      value={{
        locationValue,
        locationKey,
        loadingUpload,
        setLocationValue,
        setLocationKey,
        setLoadingUpload,
      }}
    >
      {children}
    </GlobalVariableContext.Provider>
  );
};

export const useGlobalVariable = () => {
  const context = React.useContext(GlobalVariableContext);
  if (!context) {
    throw new Error('useGlobalVariable must be used within a GlobalVariable');
  }
  return context;
};
