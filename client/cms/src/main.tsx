import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalVariableProvider } from './hooks/GlobalVariableProvider';
import { ConfigProvider, App as AntdApp } from 'antd';
import "./translation/i18-config"
import enUS from 'antd/es/calendar/locale/en_US';
import { getCookie } from './utils/utils';
import { STORAGES } from './constants/storage';
import { localeMappings } from './constants/languages';
import LocaleProvider from './components/provider/LocaleProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // Giữ cache trong 60 phút
      // staleTime: 1000 * 60 * 60, // Không refetch trong 60 phút
    },
  },
});

// const languageStored = getCookie(STORAGES.LANGUAGE) ?? "en"
// console.log(languageStored)
// const locale = localeMappings[languageStored] ?? enUS

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <QueryClientProvider client={queryClient}>
    <GlobalVariableProvider>
      {/* <ConfigProvider> */}
      <LocaleProvider>
        <AntdApp>
          <App />
        </AntdApp>
      </LocaleProvider>
      {/* </ConfigProvider> */}
    </GlobalVariableProvider>
  </QueryClientProvider>,
);
