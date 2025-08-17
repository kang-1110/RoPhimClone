import { UseQueryResult } from '@tanstack/react-query';
import { Empty, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';

interface SearchSelectProps {
  placeholder?: string;
  fieldNames?: { value: string; label: string };
  multiple?: 'multiple' | 'tags' | undefined;
  useQueryHook: (paramsQuery: any) => UseQueryResult<any, Error>;
  paramsQuery?: any;
  value?: any;
  onChange?: (value: any) => void;
  style?: any;
  size?: 'small' | 'middle' | 'large';
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  placeholder = 'Search and Select',
  fieldNames,
  multiple = undefined,
  useQueryHook,
  paramsQuery,
  value,
  onChange,
  style,
  size = 'middle',
}) => {
  const [params, setParams] = useState<any>(paramsQuery);
  const { data, isLoading, refetch } = useQueryHook(params);
  const [options, setOptions] = useState<any[]>(data);

  useEffect(() => {
    setParams(paramsQuery);
  }, [paramsQuery]);

  useEffect(() => {
    setOptions(data?.rows);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [params]);

  const loadOptions = (value: string) => {
    setOptions([]);
    if (value) {
      setParams({ ...paramsQuery, name: value });
    } else {
      setParams({ ...paramsQuery, name: undefined });
    }
  };

  const debounceFetcher = useMemo(() => {
    return debounce(loadOptions, 800);
  }, []);

  return (
    <Select
      placeholder={placeholder}
      fieldNames={fieldNames}
      options={options}
      mode={multiple}
      loading={isLoading}
      style={style ? style : { width: '100%' }}
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch
      notFoundContent={isLoading ? <Spin size="small" /> : <Empty />}
      allowClear
      onClear={() => loadOptions('')}
      value={value}
      onChange={(selectedValue) => {
        onChange?.(selectedValue);
      }}
      size={size}
    />
  );
};
