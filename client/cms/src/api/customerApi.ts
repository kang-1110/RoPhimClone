import { DataGetListType } from "../type/GeneralType";
import axiosInstance from "./axiosInstance";

export const customerApi = {
    getListCustomers: async (params: DataGetListType) => {
        const response = await axiosInstance.get('/admin/v1/customers', {
            params,
        });
        return response.data?.results?.objects;
    }
}