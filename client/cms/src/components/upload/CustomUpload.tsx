import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { LuImagePlus } from "react-icons/lu";
import { App, Flex, Image, Progress, Spin, Tooltip, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
// import { useUpload } from '../../hooks/useUpload';
import {
  messFileMaxCount,
  messFileSize,
  messImage,
  messOrientation,
  messPdf,
  messVideo,
} from '../../constants/commonConst';
import logoImg from '/images/logo-dashboard.png';
import { FileUploadData, UploadProps, UploadType } from '../../type/UploadType';
import { useUpload } from '../../hooks/useUpload';

interface UploadImageProps {
  paramsMutation: {
    type: UploadType;
    key: string;
  };
  type: 'pdf' | 'image' | 'video';
  maxCount?: number;
  maxSizeMB?: number; // Tùy chọn: Kích thước file tối đa (MB)
  description?: string; // Tùy chọn: Chú thích ở dưới
  accept?: string; // Các định dạng file cho phép
  showUploadList?: boolean;
  multiple?: boolean;
  onChange?: any;
  crop?: boolean;
  aspect?: number;
  disabled?: boolean;
  isVertical?: boolean;
  isDetail?: boolean;
}

const CustomUpload: React.FC<UploadImageProps> = ({
  onChange,
  paramsMutation,
  accept = '*',
  maxSizeMB = 5,
  type = 'image',
  maxCount = 1,
  showUploadList = false,
  multiple = false,
  crop = false,
  aspect = 16 / 9,
  disabled = false,
  isVertical = false,
  isDetail = false,
  description = ' Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.',
}) => {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const uploadMutation = useUpload();
  // prettier-ignore
  const defaultData = queryClient.getQueryData<FileUploadData[]>([paramsMutation?.key]);
  const [filesList, setFilesList] = useState<FileUploadData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  
  useEffect(() => {
    if (defaultData) {
      setFilesList(defaultData);
    }
  }, [defaultData]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     // start upload -> setProgress
  //     if (uploadMutation.isPending) {
  //       // count +10s first (for short video), then count 1s (for long video)
  //       // only count to 99% -> upload done uploadMutation.isSuccess = true -> hide progress bar
  //       setProgress((prev) =>
  //         progress < 60 ? prev + 1 : progress < 99 ? prev + 1 : prev,
  //       );
  //     }
  //   }, 2000);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [uploadMutation]);

  const renderMessErr = () => {
    if (type === 'pdf') {
      return messPdf;
    }

    if (type === 'image') {
      return messImage;
    }

    if (type === 'video') {
      return messVideo;
    }

    return 'Failed. Please try again!';
  };

  const renderVerticalErr = (file: File): Promise<File | boolean> => {
    return new Promise((resolve, reject) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        reject(false);
        notification.error({ message: messOrientation });
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > height) {
          notification.error({ message: messOrientation });
          reject(false);
          return;
        }

        resolve(file); // Cho phép upload nếu hợp lệ
      };

      video.onerror = () => {
        console.log('Lỗi load video');
        reject(false);
        notification.error({ message: messOrientation });
        return;
      };
    });
  };

  const beforeUpload = (file: File) => {
    if (maxCount > 1 && filesList?.length > maxCount) {
      notification.error({ message: messFileMaxCount + maxCount + ' files' });
      return false;
    }

    if (!file?.type.includes(type)) {
      notification.error({ message: renderMessErr() });
      return false;
    }

    if (file?.size > 1024 * 1024 * maxSizeMB) {
      const value =
        maxSizeMB < 1024
          ? maxSizeMB + 'MB'
          : Math.round(maxSizeMB / 1024) + 'GB';
      notification.error({ message: messFileSize + value });
      return false;
    }

    if (isVertical && type === 'video') {
      return renderVerticalErr(file);
    }

    // before upload, reset progress (for case upload array)
    setProgress(0);

    return true;
  };

  const customRequest = async (file: any, index: number) => {
    const params: UploadProps = {
      type: paramsMutation?.type,
      files: multiple ? [file?.file, ...filesList] : [file?.file],
    };
    uploadMutation.mutate({
      params,
      key: paramsMutation?.key,
      type: maxCount === 1 ? 'replace' : 'add',
      index,
    });

    if (onChange) {
      onChange([file?.file]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const clone = _.cloneDeep(filesList);
    delete clone[index];

    queryClient.setQueryData([paramsMutation?.key], clone);
    setFilesList(clone as FileUploadData[]);

    if (onChange) {
      onChange(clone);
    }
  };

  const renderNewFile = (item: FileUploadData, index: number) => {
    return (
      <div
        className="w-full overflow-y-hidden relative flex justify-center align-middle rounded-[4px]"
        style={{
          border: isDetail ? 'none' : '1px solid grey',
        }}
      >
        {type === 'image' && (
          <Image
            key={item?.cloudFrontUrl}
            src={item?.cloudFrontUrl ?? logoImg}
            alt="image"
            preview={isDetail}
            style={{
              width: '100%',
              height: 164,
              objectFit: 'contain',
              zIndex: 99,
              margin: 'auto',
            }}
          />
        )}

        {type === 'video' && (
          <video
            src={item?.cloudFrontUrl}
            className={
              isDetail
                ? 'w-full h-[166px] object-contain rounded-[4px]'
                : 'w-full h-[166px] object-contain border border-gray-500 rounded-[4px]'
            }
          />
        )}

        {type === 'pdf' && (
          <span
            key={item?.cloudFrontUrl}
            className="w-full h-[166px] object-contain border border-gray-500 rounded-[4px] z-[99] pr-[30px]"
          >
            {item?.cloudFrontUrl}
          </span>
        )}

        {!isDetail && (
          <Tooltip title="Remove Item">
            <CloseCircleOutlined
              className="absolute right-[5px] text-lg text-red-500 z-999"
              style={type === 'pdf' ? { top: '2px' } : { top: '5px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(index);
              }}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const renderDefault = () => {
    return (
      <Flex vertical>
        <LuImagePlus size={40} className='mx-auto mb-2' />
        <p className="ant-upload-text">
          Click to upload or drag and drop image here.
        </p>
        <p className="ant-upload-hint">{description}</p>
      </Flex>
    );
  };

  const renderUploadDraggerItem = (index: number) => {
    return (
      <Upload.Dragger
        key={paramsMutation?.key}
        customRequest={(files) => customRequest(files, index)}
        maxCount={maxCount}
        accept={accept}
        beforeUpload={beforeUpload}
        showUploadList={showUploadList}
        multiple={multiple}
        disabled={disabled}
      >
        <Flex className="w-full h-[166px] justify-center items-center overflow-y-hidden">
          {filesList?.[index]
            ? renderNewFile(filesList?.[index], index)
            : renderDefault()}
        </Flex>
      </Upload.Dragger>
    );
  };

  const renderUploadItem = (index: number) => {
    return (
      <Tooltip title="Click or drag file to this area to upload">
        {crop ? (
          <ImgCrop rotationSlider aspect={aspect}>
            {renderUploadDraggerItem(index)}
          </ImgCrop>
        ) : (
          renderUploadDraggerItem(index)
        )}
      </Tooltip>
    );
  };

  const renderUpload = () => {
    const formattedArray = Array(maxCount).fill(undefined);
    return (
      <Flex className="w-full h-[200px] flex flex-col justify-center items-center overflow-y-hidden">
        {uploadMutation.isPending ? (
          <Flex className="w-full h-[200px] flex justify-center items-center overflow-y-hidden rounded-md border border-dashed">
            <Spin />
          </Flex>
        ) : (
          <Flex className="w-full">
            {formattedArray.map((_, index) => {
              return (
                <div
                  style={{
                    width: `calc(100% / ${maxCount})`,
                  }}
                >
                  {renderUploadItem(index)}
                </div>
              );
            })}
          </Flex>
        )}

        {uploadMutation.isPending && type === 'video' && (
          <Progress
            percent={progress}
            status={progress === 100 ? 'success' : 'active'}
            size="small"
          />
        )}
      </Flex>
    );
  };

  return renderUpload();
};

export default CustomUpload;
