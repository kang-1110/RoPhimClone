import { UploadProps } from '../type/UploadType';
import axiosInstance from './axiosInstance';

export const uploadApi = {
  upload(data: UploadProps): Promise<any> {
    const formData = new FormData();
    if (data?.files) {
      data.files.map((item) => {
        formData.append('file', item);
      });
    }

    return axiosInstance.post(
      "/admin/v1/file-upload/upload",
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },
};
