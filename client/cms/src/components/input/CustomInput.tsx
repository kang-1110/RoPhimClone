import React from 'react';
import { Input } from 'antd';

/** Lấy props của <Input /> */
type AntdInputProps = React.ComponentProps<typeof Input>;

/** Lấy props của <Input.TextArea /> */
type AntdTextAreaProps = React.ComponentProps<typeof Input.TextArea>;

/**
 * Trường hợp dùng <Input /> (không có TextArea):
 *   isTextArea = false (hoặc không truyền),
 *   và props còn lại phải hợp lệ với AntdInputProps
 */
type InputModeProps = {
  isTextArea?: false;
} & AntdInputProps;

/**
 * Trường hợp dùng <Input.TextArea />:
 *   isTextArea = true,
 *   và props còn lại phải hợp lệ với AntdTextAreaProps
 */
type TextAreaModeProps = {
  isTextArea: true;
} & AntdTextAreaProps;

/** Kết hợp hai trường hợp trên thành one-of (discriminated union) */
type CustomInputProps = InputModeProps | TextAreaModeProps;

const CustomInput: React.FC<CustomInputProps> = (props) => {
  // Nếu isTextArea = true, TS tự hiểu props là TextAreaModeProps
  if (props.isTextArea) {
    const {
      placeholder,
      maxLength = 1500,
      showCount = true,
      rows = 7,
      // Các props còn lại đều thuộc AntdTextAreaProps
      ...restTextAreaProps
    } = props;

    return (
      <Input.TextArea
        {...restTextAreaProps} // đúng type AntdTextAreaProps
        placeholder={placeholder}
        maxLength={maxLength}
        showCount={showCount}
        rows={rows}
      />
    );
  }

  // Nếu isTextArea không truyền hoặc false, TS hiểu props là InputModeProps
  const {
    placeholder,
    maxLength = 200,
    showCount = true,
    type = 'text',
    // Các props còn lại thuộc AntdInputProps
    ...restInputProps
  } = props as InputModeProps;

  return (
    <Input
      {...restInputProps} // đúng type AntdInputProps
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      showCount={showCount}
    />
  );
};

export default CustomInput;
