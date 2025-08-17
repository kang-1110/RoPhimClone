// components/CKEditorFormItem.tsx
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { notification } from 'antd';
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  CloudServices,
  Code,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PluginConstructor,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableColumnResize,
  TableToolbar,
  Underline
} from 'ckeditor5';
import React from 'react';

import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import 'ckeditor5/ckeditor5.css';
import { configErr } from '../../constants/commonConst';
import { getCookie } from '../../utils/utils';
import { STORAGES } from '../../constants/storage';

export interface TextEditorProps {
  data?: string; // Add data prop to receive form value
  onChange?: (data: string) => void; // Add onChange handler to send changes back to form
  placeholder: string; // Optional placeholder prop
}


function MyPlainUploadAdapterPlugin( editor: ClassicEditor ) {

  const fileRepository = editor.plugins.get( 'FileRepository' );

  const ckNotification = editor.plugins.get( 'Notification' );

  // 2. Ghi đè 2 method để tắt alert mặc định
  ckNotification.showWarning = ( /* message, options */ ) => {
    // no-op
  };
  ckNotification.showInfo = ( /* message, options */ ) => {
    // no-op
  };

  const token = getCookie(STORAGES.ACCESS_TOKEN)

  fileRepository.createUploadAdapter = loader => {
    return {
      upload() {
        return loader.file
          .then( file => {
            const formData = new FormData();
            formData.append('file', file as Blob);

            return fetch( 'https://cms-api.hurumhorology.com/api/admin/v1/file-upload/upload', {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`
              }
            } )
            .then(res => {
              if (!res.ok) {
                // ném error để vào catch bên dưới
                throw new Error(`Upload failed with status ${res.status}`);
              }
              return res.json();
            })
            .then(json => {
              // upload thành công, trả về URL cho CKEditor
              console.log('Upload successful:', json);
              return { default: json.cloudFrontUrl };
              // trả về object với key là 'default' chứa URL cho ảnh đã upload cho CKEditor
            })
            .catch(err => {
              notification.error({
                message: configErr.message,
              });
              return Promise.reject({ default: 'Upload failed' });
            })
          } );
      },

      abort() {
        // Nếu bạn giữ reference tới promise hoặc xhr, có thể
        // hủy nó ở đây. Nếu không, để trống cũng được.
      }
    };
  };
}

const TextEditor: React.FC<TextEditorProps> = ({ data = '', onChange, placeholder = 'Enter content here' }) => {

  return (
    <CKEditor
      editor={ClassicEditor}
      config={ {
              licenseKey: 'GPL', // Or 'GPL'.
              plugins: [
                Essentials,
                Autoformat,
                Paragraph,
                Heading,
                Bold,
                Italic,
                Underline,
                Strikethrough,
                Subscript,
                Superscript,
                Code,
                BlockQuote,
                PasteFromOffice,
                List,
                Indent,
                IndentBlock,
                Alignment,
                Link,
                Table,
                TableToolbar,
                TableColumnResize,
                Image,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageResize,
                ImageUpload,
                MediaEmbed,
                CloudServices
              ],
              // extraPlugins: [SimpleUploadAdapter],
              extraPlugins: [MyPlainUploadAdapterPlugin as PluginConstructor],
              toolbar: [
                'undo', 'redo', '|',
                'heading', '|',
                'subscript', 'superscript', '|',
                'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
                'alignment', '|',
                'numberedList', 'bulletedList', '|',
                'outdent', 'indent', '|',
                'link', 'blockQuote', 'insertTable', 'uploadImage', 'mediaEmbed', "|",
                'CKBox', 'CKFinder', '|',
              ],
              placeholder: placeholder,
            }}
      data={data}
      onChange={(event, editor) => {
        const newData = editor.getData();
        // Call the onChange prop to notify the parent form of the change
        if (onChange) {
          onChange(newData);
        }
      }}
    />
  );
};

export default TextEditor;
