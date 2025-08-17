// src/hooks/useMutationHelper.ts
import {
  useQueryClient,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import { notification } from 'antd';
import { configErr, configSuccess } from '../constants/commonConst';
import { DataGetListType } from '../type/GeneralType';

/**
 * Các actionType hỗ trợ:
 *  - 'delete'  → invalidateQueries(fullQueryKey)
 *  - 'create'  → setQueryData(fullQueryKey, unshift new + pop last)
 *  - 'update'  → setQueryData(fullQueryKey, replace tại index)
 */
export enum MutationActionType {
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATE_SINGLE = 'update_single',
}

/**
 * Kiểu biến truyền vào mutate(...)
 * - Delete:   { id: string; params: ParamsType }
 * - Create:   { body: BodyType; params: ParamsType }
 * - Update:   { id: string; body: BodyType; index: number; params: ParamsType }
 * - Update Single: { body: BodyType; params: ParamsType; queryKey?: string | string[] }
 */
export type DeleteVariables<ParamsType> = {
  id: string;
  params: ParamsType;
};
export type CreateVariables<BodyType, ParamsType> = {
  body: BodyType;
  params: ParamsType;
};
export type UpdateVariables<BodyType, ParamsType> = {
  id: string;
  body: BodyType;
  index: number;
  params: ParamsType;
};
export type UpdateSingleVariables<BodyType, ParamsType> = {
  body: BodyType;
  params: ParamsType;
};

/**
 * Tham số đầu vào cho useMutationWithCache:
 *  - mutationFn: (variables: TVariables) => Promise<TData>
 *  - actionType: DELETE | CREATE | UPDATE | UPDATE_SINGLE
 *  - queryKeyPrefix: string | string[] (ví dụ: "glossary_list")
 *  - onError?: callback nếu muốn override logic khi lỗi
 */
export interface UseMutationWithCacheOptions<
  TData,
  TError,
  TVariables extends { params: DataGetListType },
  BodyType,
  ParamsType,
> {
  /** Hàm gọi API, trả về Promise<TData> */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Chọn actionType để helper biết cần invalidate hay update cache */
  actionType: MutationActionType | "default";
  /** Phần cố định của queryKey, biến động params sẽ tự ghép thêm */
  queryKeyPrefix: string;
  /** (Tuỳ chọn) callback nếu muốn override error */
  onError?: (error: TError, variables: TVariables) => void;
}

/**
 * Hook chung cho các mutation cần xử lý cache (delete / create / update).
 *
 * - Với DELETE:  invalidateQueries([prefix, params])
 * - Với CREATE:  setQueryData([prefix, params], prev => thêm data mới vào đầu mảng và loại bỏ phần tử cuối để giữ độ dài mảng)
 * - Với UPDATE:  setQueryData([prefix, params], prev => replace tại index)
 *
 * @typeParam TData       = kiểu dữ liệu mà mutationFn promise trả về
 * @typeParam TError      = kiểu lỗi (thường AxiosError hoặc unknown)
 * @typeParam TVariables  = biến truyền vào mutate(), chứa ít nhất field `params`
 * @typeParam BodyType    = kiểu của object (ví dụ: GlossaryType) dùng để update cache của react query
 * @typeParam ParamsType  = kiểu của params (DataGetListType)
 */
export function useMutationWithCache<
  TData,
  TError,
  TVariables extends { params: DataGetListType },
  BodyType,
  ParamsType,
>(
  options: UseMutationWithCacheOptions<
    TData,
    TError,
    TVariables,
    BodyType,
    ParamsType
  >,
): UseMutationResult<TData, TError, TVariables> {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, BodyType>({
    mutationFn: options.mutationFn,
    onSuccess: (data, variables) => {
      // 1. Hiển thị notification thành công
      notification.success(configSuccess);

      // 2. Xây dựng fullQueryKey = [prefix, variables.params]
      const prefix = options.queryKeyPrefix;
      const params = variables.params as DataGetListType;
      const fullQueryKey = [prefix, params];

      switch (options.actionType) {
        case MutationActionType.DELETE:
          // Chỉ invalidate query
          queryClient.invalidateQueries({
            queryKey: fullQueryKey,
          });
          break;

        case MutationActionType.CREATE:
          {
            // Giờ data chính là một BodyType (object vừa tạo)
            const newObject = data;
            queryClient.setQueryData(fullQueryKey, (oldData: any) => {
              // Nếu không có oldData, trả về undefined để không làm gì cả
              if (!oldData) return undefined;
              const length = params.limit || 10 // Giá trị init value của params.limit
              // oldData.rows là mảng cũ
              const prevRows: BodyType[] = oldData.rows || [];
              const newRows = [newObject, ...prevRows];
              // Giữ độ dài cũ bằng cách pop phần cuối nếu mảng đã có đủ độ dài
              if (newRows.length > length) newRows.pop();
              return {
                ...oldData,
                rows: newRows,
              };
            });
          }
          break;

        case MutationActionType.UPDATE:
          {
            // data là BodyType (object đã cập nhật)
            const updatedObject = data;
            const index = (variables as any).index as number;
            queryClient.setQueryData(fullQueryKey, (oldData: any) => {
              if (!oldData) return undefined;
              const prevRows: BodyType[] = oldData.rows || [];
              const newRows = [...prevRows];
              newRows[index] = {
                ...newRows[index],
                ...updatedObject,
              };
              return {
                ...oldData,
                rows: newRows,
              };
            });
          }
          break;

        case MutationActionType.UPDATE_SINGLE:
          {
            // Lấy response từ API - chính là dữ liệu đã cập nhật
            const updatedObject = data;
            // Nếu có queryKey cụ thể từ variables, sẽ ưu tiên dùng
            const targetQueryKey = fullQueryKey;
            
            // Cập nhật trực tiếp vào cache với dữ liệu mới
            queryClient.setQueryData(targetQueryKey, (oldData: any) => {
              if (!oldData) return updatedObject;
              
              // Nếu là object, merge với dữ liệu cũ
              if (typeof oldData === 'object' && !Array.isArray(oldData)) {
                return {
                  ...oldData,
                  ...updatedObject,
                };
              }
              
              // Nếu không phải object, thay thế hoàn toàn
              return updatedObject;
            });
          }
          break;

        default:
          // Fallback nếu có actionType khác
          queryClient.invalidateQueries({
            queryKey: fullQueryKey,
          });
          break;
      }
    },
    onError: (error, variables) => {
      // 1. Hiển thị notification lỗi
      notification.error(configErr);
      // 2. Nếu caller có onError tùy chỉnh, gọi tiếp
      if (options.onError) {
        options.onError(error as TError, variables as TVariables);
      }
    },
  });
}
