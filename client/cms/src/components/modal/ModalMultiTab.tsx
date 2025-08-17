import { Button, Col, Form, Row, Select, Tabs } from 'antd';
import { Rule } from 'antd/es/form';
import React, { ReactNode } from 'react';
import {
  languagesSupport,
  multipleLanguageKey,
} from '../../constants/languages';
import CustomInput from '../input/CustomInput';
import TextEditor from '../input/TextEditor';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ValidatorRule } from 'rc-field-form/lib/interface';
import { validateSpaces } from '../../utils/utils';
import type { SelectProps } from 'antd';
import type { TextEditorProps } from '../input/TextEditor';

export enum FormItemType {
  Input = 'input',
  Textarea = 'textarea',
  Select = 'select',
  Tags = 'tags',
  TextEditor = 'textEditor',
  FormList = 'formList',
}

// Simplified interface for Form.List item configuration
export interface FormListConfig {
  initialValue?: any[];
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  // Simplified - now just render the content of a single item
  renderItemContent: (
    fieldName: number,
    restField: object,
    getFieldValue?: (name: string) => any,
  ) => ReactNode;
  listRules?: ValidatorRule[];
  helperText?: string; // Optional helper text for the Form.List
}

// Base item properties that are common to all item types
interface BaseItem {
  label: string;
  name: string;
  span?: number;
  rules?: Rule[];
  placeholder?: string;
  dependencies?: string[];
  trim?: boolean;
  required?: boolean;
}

// Specialized item types for each component
interface InputItem extends BaseItem {
  component: FormItemType.Input;
  customProps?: Omit<React.ComponentProps<typeof CustomInput> & {isTextArea?: false}, 'placeholder'>;
}

interface TextareaItem extends BaseItem {
  component: FormItemType.Textarea;
  customProps?: Omit<React.ComponentProps<typeof CustomInput> & {isTextArea: true}, 'placeholder'>;
}

interface SelectItem extends BaseItem {
  component: FormItemType.Select;
  customProps?: Omit<SelectProps, 'placeholder'>;
}

interface TagsItem extends BaseItem {
  component: FormItemType.Tags;
  customProps?: Omit<SelectProps, 'placeholder'>;
}

interface TextEditorItem extends BaseItem {
  component: FormItemType.TextEditor;
  customProps?: Omit<TextEditorProps, 'placeholder'>;
}

interface FormListItem extends BaseItem {
  component: FormItemType.FormList;
  formListConfig?: FormListConfig;
}

interface CustomComponentItem extends BaseItem {
  component: ReactNode;
}

// Union type of all possible item types
export type Item = 
  | InputItem 
  | TextareaItem 
  | SelectItem 
  | TagsItem 
  | TextEditorItem 
  | FormListItem 
  | CustomComponentItem;

interface ModalMultiTabProps {
  items: Item[];
}

const ModalMultiTab: React.FC<ModalMultiTabProps> = ({ items }) => {
  return (
    <>
      <Tabs
        defaultActiveKey={languagesSupport[0].key}
        destroyOnHidden={false}
        items={languagesSupport.map((lang) => ({
          key: lang.key,
          label: lang.label,
          forceRender: true,
          children: (
            <Row gutter={[16, 0]}>
              {items?.map((item) => {
                const component = item.component;
                const span = item.span || 24; // Default span to 24 if not provided

                if (component === FormItemType.FormList) {
                  return (
                    <Col span={span} key={item.name}>
                      <Form.Item
                        dependencies={item.dependencies}
                        help={(item as FormListItem).formListConfig?.helperText}
                        // noStyle
                      >
                        {({ getFieldValue }) => {
                          const isRender = getFieldValue(item.dependencies);
                          if (!isRender) return null; // Skip rendering if dependency is not met
                          return renderFormList(item as FormListItem, lang.key);
                        }}
                      </Form.Item>
                    </Col>
                  );
                }

                return (
                  <Col span={span} key={item.name}>
                    <Form.Item
                      key={item.name}
                      label={item.label}
                      name={[multipleLanguageKey, lang.key, item.name]}
                      rules={getFormItemRules(item)}
                      valuePropName={
                        component === FormItemType.TextEditor ? 'data' : 'value'
                      }
                    >
                      {renderItem(component, item)}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          ),
        }))}
      />
    </>
  );
};

export default ModalMultiTab;

// New function to render Form.List
const renderFormList = (item: FormListItem, langKey: string) => {
  const config = item.formListConfig;

  if (!config) return null;

  return (
    <Form.List
      name={[multipleLanguageKey, langKey, item.name]}
      initialValue={config.initialValue || [{}]}
      rules={config.listRules}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => (
            <Row key={key} gutter={[16, 16]} align="top">
              {/* Call the renderItemContent function to render the item content */}
              {config.renderItemContent(name, restField)}

              {/* Show remove button for all items except first two */}
              {index >= 2 && (
                <Col span={2}>
                  <Form.Item>
                    <MinusCircleOutlined
                      size={30}
                      className="text-red-500"
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          ))}

          {/* Show add button if not exceeding maxItems */}
          {(!config.maxItems || fields.length < config.maxItems) && (
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                {config.addButtonText || 'Add Item'}
              </Button>
            </Form.Item>
          )}
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  );
};

// Modified renderItem function to get all props from customProps
const renderItem = (component: FormItemType | ReactNode, item: Item) => {
  // If component is a string (enum value), use the switch case
  if (typeof component === 'string') {
    switch (component as FormItemType) {
      case FormItemType.Input:
        return (
          <CustomInput
            placeholder={item.placeholder}
            isTextArea={false}
            {...(item as InputItem).customProps}
          />
        );
      case FormItemType.Textarea:
        return (
          <CustomInput
            placeholder={item.placeholder}
            isTextArea={true}
            {...(item as TextareaItem).customProps}
          />
        );
      case FormItemType.Select:
        return (
          <Select 
            placeholder={item.placeholder}
            {...(item as SelectItem).customProps} 
          />
        );
      case FormItemType.Tags:
        return (
          <Select
            placeholder={item.placeholder}
            popupRender={(menu) => <>{menu}</>}
            maxTagCount="responsive"
            {...(item as TagsItem).customProps}
          />
        );
      case FormItemType.TextEditor:
        return (
          <TextEditor 
            placeholder={item?.placeholder ?? "Enter Value Here"}
            {...(item as TextEditorItem).customProps}
          />
        );
      default:
        return null;
    }
  }

  // If component is a ReactNode, return it directly
  return component;
};

// Function to get enhanced rules for form items
const getFormItemRules = (
  item: Item,
  messRequired: string = 'This field is required',
): Rule[] => {
  // Start with the original rules or empty array
  let rules = item.rules ? [...item.rules] : [];

  // Add required rule if the item is required
  if (item.required) {
    rules.push({
      required: true,
      message: messRequired,
    });
  }

  // If trim is enabled, add validateSpaces
  if (item.trim) {
    rules.push({ validator: validateSpaces });
  }

  return rules;
};
