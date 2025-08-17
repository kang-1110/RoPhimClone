import { DataLoginType } from '../type/UserLoginType';
import axiosInstance from './axiosInstance';

export const loginApi = {
  signIn: async (body: DataLoginType) => {
    return await axiosInstance.post('/public/v1/auth/login', body);
  },

  signOut: async () => {
    return await axiosInstance.post('/private/v1/auth/logout');
  },

  refreshToken(data: { refreshToken: string }) {
    return axiosInstance.post('/public/v1/auth/refresh', data);
  },

  requestOTP: async (body: { user_id: string }) => {
    return await axiosInstance.post('/admin/v1/auths/request-otp', body);
  },

  
};
