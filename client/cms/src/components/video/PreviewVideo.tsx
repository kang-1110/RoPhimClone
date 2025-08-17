import { PlayCircleFilled } from '@ant-design/icons';
import { Image, Modal } from 'antd';
import { useState } from 'react';
import LogoImg from '/images/logo.png';

const VideoPreview = ({
  srcVideo,
  srcThumbnails,
}: {
  srcVideo: string | undefined;
  srcThumbnails: string | undefined;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (event: any) => {
    event.stopPropagation();
    setIsModalVisible(true);
  };

  const handleCancel = (event: any) => {
    event.stopPropagation();
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="w-full relative " onClick={showModal}>
        {/* Hình ảnh đại diện cho video */}
        <Image
          src={srcThumbnails || LogoImg}
          alt="Video Thumbnail"
          preview={false} // Vô hiệu hóa preview mặc định của hình ảnh
          className="cursor-pointer "
          style={{ maxWidth: 160, height: 90, objectFit: 'contain' }}
        />

        <div className="absolute top-2/4 left-2/4 text-2xl transform translate-x-[-50%] translate-y-[-50%] cursor-pointer">
          <PlayCircleFilled />
        </div>
      </div>

      {/* Modal chứa video */}
      <Modal
        title="Video Preview"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        destroyOnClose
      >
        <video controls className="w-full" src={srcVideo}>
          Your browser does not support the video tag.
        </video>
      </Modal>
    </>
  );
};

export default VideoPreview;
