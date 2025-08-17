import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants/queryKey";
import { customerApi } from "../api/customerApi";
import { DataGetListType } from "../type/GeneralType";

export const customerHooks = {
    useGetListCustomers: (params: DataGetListType) => {
        return useQuery({
        queryKey: [QueryKey.customers.list, params],
        queryFn: () => customerApi.getListCustomers(params),
        });
    },
}