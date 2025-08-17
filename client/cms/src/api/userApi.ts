import { DataGetListType, ListResponseType } from '../type/GeneralType';
import { DetailUserProps } from '../type/UserType';
import axiosInstance from './axiosInstance';

export const userApi = {
  fetchListUser: async (params: DataGetListType): Promise<ListResponseType<DetailUserProps>> => {
    const response = await axiosInstance.get('/admin/v1/users', {
      params,
    });
    return response.data?.results?.objects;
  },

  fetchDetailUser: async (id: string): Promise<DetailUserProps> => {
    const response = await axiosInstance.get(`/admin/v1/users/${id}`);
    return response.data?.results?.object;
  },

  deleteUser: async (id: string) => {
    await axiosInstance.delete(`/admin/v1/users/${id}`);
  },

  patchUser: async (id: string, body: DetailUserProps) => {
    const response = await axiosInstance.patch(`/admin/v1/users/${id}`, body);
    return response.data?.results?.object;
  },
};
