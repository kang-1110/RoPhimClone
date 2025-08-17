import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { FileUploadData, UploadProps } from '../type/UploadType';
import { useGlobalVariable } from './GlobalVariableProvider';
import { uploadApi } from '../api/uploadApi';
import { configErr, configSuccess } from '../constants/commonConst';

export const useUpload = () => {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const { loadingUpload, setLoadingUpload } = useGlobalVariable();

  return useMutation<
    void,
    Error,
    {
      params: UploadProps;
      key: string;
      type: 'add' | 'replace';
      index?: number;
    }
  >({
    mutationFn: ({ params }: { params: UploadProps }) =>
      uploadApi.upload(params),
    onMutate: async ({ key }: { key: string }) => {
      if (loadingUpload) {
        setLoadingUpload({ ...loadingUpload, [key]: true });
      }
    },
    onSuccess: (
      res: any,
      {
        key,
        type,
        index,
      }: { key: string; type: 'add' | 'replace'; index?: number },
    ) => {
      queryClient.setQueryData(
        [key],
        (oldData: FileUploadData[] | undefined) => {
          let currentData =
            (queryClient.getQueryData([key]) as FileUploadData[]) ?? [];
          let newValue: FileUploadData[] = [res?.data]; // res?.data? là object chứa url
          if (type === 'add') {
            currentData[index ?? 0] = newValue?.[0];
            return currentData;
          } else {
            return newValue;
          }
        },
      );
      if (loadingUpload) {
        setLoadingUpload({ ...loadingUpload, [key]: false });
      }
      notification.success(configSuccess);
    },
    onError: (_, { key }: { key: string }) => {
      if (loadingUpload) {
        setLoadingUpload({ ...loadingUpload, [key]: false });
      }
      return notification.error(configErr);
    },
  });
};
