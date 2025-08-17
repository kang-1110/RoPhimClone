import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/loginApi';
import { STORAGES } from '../constants/storage';
import { DataLoginType, UserLoginType } from '../type/UserLoginType';
import { clearCookie, getCookie, setCookie } from '../utils/utils';
import { configErr, errorCode } from '../constants/commonConst';
import { ROUTES } from '../constants/routers';
import { App } from 'antd';

export const useLogin = () => {
  const { notification } = App.useApp();

  const navigate = useNavigate();
  return useMutation<AxiosResponse<any>, Error, DataLoginType>({
    mutationFn: async ({ email, password }: DataLoginType) => {
      const payload = { email, password };
      return await loginApi.signIn(payload);
    },
    onSuccess: ({ data }) => {
      const newData: UserLoginType = data?.results?.object;
      const userClone = { ...newData?.user };
      console.log(newData.accessToken)
      setCookie(STORAGES.USER_LOGIN, userClone);
      setCookie(STORAGES.ACCESS_TOKEN, newData?.accessToken);
      setCookie(STORAGES.REFRESH_TOKEN, newData?.refreshToken);
      // sessionStorage.setItem('visible_tab', 'visible');

      navigate(ROUTES.DASHBOARD);
    },
    onError: (err: any) => {
      const errorId = err?.response?.data?.errorId as keyof typeof errorCode;
      const errorIdConfig = {
        message: errorId ? errorCode[errorId] : configErr?.message,
      };
      return notification.error(errorIdConfig);
    },
  });
};

export const useLogout = () => {
  const { notification } = App.useApp();
  const user = getCookie(STORAGES.USER_LOGIN);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      return await loginApi.signOut();
    },
    onSuccess: () => {
      if (user?.is_save) {
        setCookie(STORAGES.USER_LOGIN, {
          username: user?.username,
          is_save: user?.is_save,
        });
      } else {
        clearCookie(STORAGES.USER_LOGIN);
      }

      clearCookie(STORAGES.ACCESS_TOKEN);
      clearCookie(STORAGES.REFRESH_TOKEN);
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      return notification.error(configErr);
    },
  });
};

export const usePostUserToken = () => {
  const { notification } = App.useApp();

  return useMutation<
    AxiosResponse<any>,
    Error,
    { body: { user_id: string }; url: string }
  >({
    mutationFn: async ({ body }: { body: { user_id: string } }) => {
      return loginApi.requestOTP(body);
    },
    onSuccess: (res: any, { url }: { url: string }) => {
      const otp = res?.data;
      if (otp) {
        const isQuestionMark = url.indexOf('?');
        window.open(
          `${url}${isQuestionMark !== -1 ? '&' : '?'}otp=${otp}`,
          '_blank',
        );
      } else {
        console.error('OTP is missing in the response');
      }
    },
    onError: () => {
      return notification.error(configErr);
    },
  });
};
