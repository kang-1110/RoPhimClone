import { Select } from 'antd';

interface AddItemSelectProps {
  placeholder?: string;
  fieldNames?: { value: string; label: string };
  multiple?: 'multiple' | 'tags' | undefined;
  options: string[];
  value?: any;
  onChange?: (value: any) => void;
  style?: any;
  size?: 'small' | 'middle' | 'large';
}

export const AddItemSelect: React.FC<AddItemSelectProps> = ({
  placeholder = 'Search and Select',
  fieldNames,
  multiple = 'tags',
  options,
  value,
  onChange,
  style,
  size = 'middle',
}) => {
  return (
    <Select
      placeholder={placeholder}
      mode={multiple}
      fieldNames={fieldNames}
      size={size}
      style={style}
      value={value}
      onChange={onChange}
      dropdownRender={(menu) => <>{menu}</>}
      maxTagCount="responsive"
      options={options?.map((item) => ({ label: item, value: item }))}
    />
  );
};
