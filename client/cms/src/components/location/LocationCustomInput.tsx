import { EditOutlined } from '@ant-design/icons';
import { AutoComplete, Empty, Form, Input, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import {
  LocationDefaultProps,
  useGlobalVariable,
} from '../../hooks/GlobalVariableProvider';
import {
  useFetchListAutocomplete,
  useFetchListDistricts,
  useFetchListProvinces,
} from '../../hooks/useLocation';
import { formatAddressFunc } from '../../utils/utils';
import { SearchSelect } from '../select/SearchSelect';

interface LocationCustomInputProps {
  initValue: LocationDefaultProps;
  formKey: string;
  disabled?: boolean;
  autocomplete?: boolean;
  placeholder?: string;
}

export const LocationCustomInput: React.FC<LocationCustomInputProps> = ({
  initValue = undefined,
  formKey,
  disabled = false,
  autocomplete = false,
  placeholder = '',
}) => {
  const [formLocation] = Form.useForm();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formatLocation, setFormatLocation] = useState<string>('');
  const [paramsQueryDistrict, setParamsQueryDistrict] = useState<{
    provinceId: string;
  }>();
  const [params, setParams] = useState({ address: '' });
  const { setLocationValue, setLocationKey, locationValue } =
    useGlobalVariable();

  const { data: autoData, isLoading: autoIsLoading } =
    useFetchListAutocomplete(params);

  useEffect(() => {
    if (initValue && formKey) {
      formLocation.setFieldsValue(locationValue ?? initValue);
      setLocationValue(initValue);
      setLocationKey(formKey);
      initValue?.province?.value &&
        setParamsQueryDistrict({ provinceId: initValue?.province?.value });
    }
  }, [initValue, formKey]);

  useEffect(() => {
    console.log('locationValue', locationValue);
    const formatValue = formatAddressFunc(
      locationValue as LocationDefaultProps,
    );
    formLocation.setFieldsValue(locationValue);
    setFormatLocation(formatValue);
  }, [locationValue, formLocation]);

  const submitLocation = () => {
    const value = formLocation.getFieldsValue();
    console.log('value', value);
    if (!value.province) {
      value.province = { label: null, value: null };
    }
    if (!value.district) {
      value.district = { label: null, value: null };
    }
    setLocationValue(value);
    setLocationKey(formKey);
    setOpenModal(false);
  };

  const onSearchAutoComplete = (searchText: string) => {
    setParams({ address: searchText });
  };

  return (
    <>
      <Input
        addonAfter={
          <EditOutlined
            className="cursor-pointer"
            onClick={() => !disabled && setOpenModal(true)}
          />
        }
        value={formatLocation}
        readOnly
        placeholder={placeholder}
      />

      <Modal
        title="Location"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={submitLocation}
      >
        <Form
          form={formLocation}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="province"
            label="Province"
            getValueFromEvent={(newValue) => {
              // formLocation.setFieldValue(
              //   'province',
              //   newValue ?? { label: null, value: null },
              // );
              // formLocation.setFieldValue('district', {
              //   label: null,
              //   value: null,
              // });
              setParamsQueryDistrict({ provinceId: newValue?.value });
              return newValue; //?? { label: null, value: null };
            }}
          >
            <SearchSelect
              placeholder="Select Province"
              useQueryHook={useFetchListProvinces}
            />
          </Form.Item>

          <Form.Item name="district" label="District">
            <SearchSelect
              placeholder="Select District"
              useQueryHook={useFetchListDistricts}
              paramsQuery={paramsQueryDistrict}
            />
          </Form.Item>

          <Form.Item name="address" label="Address">
            {autocomplete ? (
              <AutoComplete
                options={autoData ?? []}
                onSearch={onSearchAutoComplete}
                placeholder="Address"
                notFoundContent={autoIsLoading ? <Spin /> : <Empty />}
              />
            ) : (
              <Input placeholder="Address" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
