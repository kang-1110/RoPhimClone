import axios from 'axios';
import { STORAGES } from '../constants/storage';
import { clearCookie, getCookie, setCookie } from '../utils/utils';
import { loginApi } from './loginApi';
import { ROUTES } from '../constants/routers';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie(STORAGES.ACCESS_TOKEN);
    const publicUrl = config?.url?.includes('/public/v1');
    if (token && !publicUrl) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (error?.response?.data?.path === '/api/public/v1/auth/refresh-token') {
        handleLogoutFunction();
      }
      return handleRefreshToken(error);
    }
    return Promise.reject(error);
  },
);

export const handleLogoutFunction = () => {
  const USER_LOGIN = getCookie(STORAGES.USER_LOGIN);

  if (!USER_LOGIN?.is_save) {
    clearCookie(STORAGES.USER_LOGIN);
  }
  clearCookie(STORAGES.ACCESS_TOKEN);
  clearCookie(STORAGES.REFRESH_TOKEN);
  window.location.href = ROUTES.LOGIN;
  return;
};

let isRefreshing = false;
let refreshSubscribers: ((accessToken: string) => void)[] = [];

const addSubscriber = (callback: (accessToken: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const handleRefreshToken = async (error: unknown) => {
  const originalConfig = (error as any).config; // `error` thường không có kiểu cụ thể nên cần ép kiểu
  const refreshToken = getCookie(STORAGES.REFRESH_TOKEN);
  const addSubs = (resolve: (value: unknown) => void) => {
    addSubscriber((accessToken: string) => {
      originalConfig.headers.Authorization = 'Bearer ' + accessToken;
      resolve(axiosInstance(originalConfig));
    });
  };

  if (!refreshToken) {
    isRefreshing = false;
    handleLogoutFunction();
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise(addSubs);
  }

  const retryOriginalRequest = new Promise(addSubs);

  isRefreshing = true;

  try {
    const { data } = await loginApi.refreshToken({
      refreshToken: refreshToken,
    });

    setCookie(STORAGES.ACCESS_TOKEN, data?.results?.object?.accessToken);
    setCookie(STORAGES.REFRESH_TOKEN, data?.results?.object?.refreshToken);

    isRefreshing = false;
    onRefreshed(data?.results?.object?.accessToken);
    return retryOriginalRequest;
  } catch (err) {
    handleLogoutFunction();
    isRefreshing = false;
  }
};

export default axiosInstance;
