import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  UseMutationResult,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { Alert, Button, Card, Flex, Form, Modal, Table } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import _, { debounce } from 'lodash';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiSealWarningFill } from 'react-icons/pi';
import {
  LoadingUploadProps,
  useGlobalVariable,
} from '../../hooks/GlobalVariableProvider';
import {
  CreateVariables,
  DeleteVariables,
  UpdateVariables,
} from '../../hooks/useMutationHelper';
import {
  DataGetListType,
  ListResponseTypeObject,
} from '../../type/GeneralType';
import { TranslationKey } from '../../type/I18nKeyType';
import { FileUploadData } from '../../type/UploadType';
import { deepCompareObjects } from '../../utils/utils';
import DeleteIcon from '../icons/DeleteIcon';
import EditIcon from '../icons/EditIcon';

interface ActionTableEditProps<T> {
  type: 'edit';
  func: UseMutationResult<T, AxiosError, UpdateVariables<T, DataGetListType>>;
}

interface ActionTableDeleteProps<T> {
  type: 'delete';
  func: UseMutationResult<
    AxiosResponse,
    AxiosError,
    DeleteVariables<DataGetListType>
  >;
}
type ActionTableInfoProps<T> =
  | ActionTableEditProps<T>
  | ActionTableDeleteProps<T>;

export interface CreateDetailTableInfoProps<T> {
  isCreate?: boolean;
  funcDetail?: (id: string) => UseQueryResult<T, Error>;
  funcCreate?: UseMutationResult<
    T,
    AxiosError,
    CreateVariables<T, DataGetListType>
  >;
  modal?: React.ComponentType<any>;
  disabledBtnModal?: {
    variables: unknown;
    condition: string;
  };
  modalWidth?: number;
  isShowConfirmCreate?: boolean;
  onCloseModal?: () => void;
  formType?: 'normal' | 'tabbed' | 'stepped';
  totalSteps?: number;
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
}

interface TableInfo<T> {
  actions?: ActionTableInfoProps<T>[];
  createAndUpdate?: CreateDetailTableInfoProps<T>;
}

interface FilterTableProps<T = unknown> {
  title: string;
  columns: TableColumnsType<T>;
  useQueryHook: (
    params: DataGetListType,
  ) => UseQueryResult<ListResponseTypeObject<T>, Error>;
  filterRender?: ReactNode;
  tableInfo?: TableInfo<T>;
  paramsProps?: React.Dispatch<React.SetStateAction<DataGetListType>>;
  enableSelectRow?: boolean;
}

const initParams = { page: 1, limit: 10 };
const { confirm } = Modal;

const FilterTable = <T,>({
  title,
  columns,
  useQueryHook,
  tableInfo,
  paramsProps,
  filterRender,
  enableSelectRow = false,
}: FilterTableProps<T>) => {
  const dateKeys = ['date'] as (keyof T)[];
  const uploadKeys = ['thumbnailUrl'] as (keyof T)[];

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<DataGetListType>(initParams);
  const [isOpenModal, setIsOpenModal] = useState<{
    open: boolean;
    id: string;
    index: number;
  }>({ open: false, id: '', index: -1 });

  const { data, isLoading } = useQueryHook(params as DataGetListType);
  console.log(useQueryHook)

  const detailHook = tableInfo?.createAndUpdate?.funcDetail;
  const { data: detail, isLoading: isLoadingDetail } = detailHook
    ? detailHook(isOpenModal?.id)
    : { data: undefined, isLoading: false };

  const deleteMutation = tableInfo?.actions?.find(
    (item): item is ActionTableDeleteProps<T> => item?.type === 'delete',
  )?.func;

  const updateMutation = tableInfo?.actions?.find(
    (item): item is ActionTableEditProps<T> => item?.type === 'edit',
  )?.func;

  const createMutation = tableInfo?.createAndUpdate?.funcCreate;

  const { loadingUpload, setLoadingUpload } = useGlobalVariable();

  const ContentModal = tableInfo?.createAndUpdate?.modal;

  const customActionOnCloseModal = tableInfo?.createAndUpdate?.onCloseModal;

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    paramsProps && paramsProps(params);
  }, [params]);

  useEffect(() => {
    if (!detail) return;

    // Clone detail an toàn với Partial<T>
    const clone = _.cloneDeep(detail);

    // Xử lý các field kiểu ngày
    dateKeys.forEach((key) => {
      const value = detail[key];
      if (value) {
        clone[key] = dayjs(value as string) as any;
      }
    });

    // Xử lý các field kiểu upload
    uploadKeys.forEach((key) => {
      const value = detail[key];
      if (value) {
        queryClient.setQueryData([key], Array.isArray(value) ? value : [value]);
      }
    });

    // Set vào form
    formModal.setFieldsValue(clone);
  }, [detail, queryClient, formModal, dateKeys, uploadKeys]);

  useEffect(() => {
    if (
      isOpenModal?.open &&
      (createMutation?.isSuccess || updateMutation?.isSuccess)
    ) {
      createMutation?.reset();
      updateMutation?.reset();
      handleCancelModal();
    }
  }, [createMutation, updateMutation, isOpenModal]);

  const handleChangeFilterForm = useCallback(
    debounce(() => {
      const values = form.getFieldsValue();

      setParams({ ...params, ...values, page: 1 });
    }, 800),
    [],
  );

  const handleChangeTable = (pagination: TablePaginationConfig) => {
    setParams({
      ...params,
      page: pagination?.pageSize !== params.limit ? 1 : pagination?.current,
      limit: pagination?.pageSize,
    });
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: 'Are you sure delete this item?',
      icon: <ExclamationCircleFilled />,
      content:
        'Please double check the information before deleting this item. You will not be able to undo after deleting.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        if (id) {
          // Pass id, index, and params to the mutation
          deleteMutation && deleteMutation.mutate({ id, params });
        } else {
          console.log('Not id');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showCreateConfirm = (e: any) => {
    confirm({
      centered: true,
      title: null,
      icon: null,
      content: (
        <div className="flex flex-col items-center gap-6">
          <PiSealWarningFill size={40} />

          <div className="flex flex-col gap-4 items-center">
            <span className="text-center text-xl font-bold text-primary">
              Are you sure you want to publish this profile?
            </span>

            <p className="text-center text-sm text-secondary">
              This action is permanent. All related information will be lost.
            </p>
          </div>
        </div>
      ),
      okText: 'Publish',
      cancelText: 'Cancel',
      onOk() {
        console.log('ok');
        formModal.submit();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSubmitModal = () => {
    // 1) Reset form error state when validate successfully
    setFormError(null);
    const values = formModal.getFieldsValue(true);

    // console.log('handleSubmitModal', values);
    const initialBody = detail || {};

    const body = isOpenModal?.id
      ? deepCompareObjects(values, initialBody)
      : values;

    if (isOpenModal?.id) {
      updateMutation &&
        updateMutation.mutate({
          id: isOpenModal?.id,
          body,
          index: isOpenModal?.index,
          params,
        });
    } else {
      createMutation && createMutation.mutate({ body, params });
    }

    handleCancelModal();
  };

  const handleCancelModal = () => {
    customActionOnCloseModal && customActionOnCloseModal();

    // clear hết react query của các field upload
    uploadKeys.forEach((key) => {
      const dataUpload = queryClient.getQueryData<FileUploadData[]>([key]);
      if (dataUpload) {
        queryClient.removeQueries({ queryKey: [key], exact: true });
      }
    });

    // set lại loading của các field upload là false
    const allFalseLoading: Partial<LoadingUploadProps> = Object.fromEntries(
      Object.keys(loadingUpload as LoadingUploadProps).map((key) => [
        key,
        false,
      ]),
    );

    setLoadingUpload(allFalseLoading as LoadingUploadProps);
    setIsOpenModal({ open: false, id: '', index: -1 });
    formModal.resetFields();
  };

  const disableBtnModalFunc = () => {
    if (!tableInfo?.createAndUpdate?.disabledBtnModal) return;

    const { variables, condition } =
      tableInfo?.createAndUpdate?.disabledBtnModal;

    const context = { detail, ...(variables as object) };

    // thay thế các biến string trong condition thành biến thực được khai báo ở variables
    const parsedCondition = condition.replace(
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      (match) => {
        return match in context ? `context.${match}` : match;
      },
    );
    try {
      return new Function(
        'context',
        `with (context) { return ${parsedCondition}; }`,
      )(context);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  };

  const initColumns: TableColumnsType<any> = [
    {
      title: t(TranslationKey.No),
      dataIndex: '',
      key: 'id',
      align: 'center',
      width: 120,
      render: (_, __, index: number) => {
        const limit = params?.limit ?? 0;
        const currentPage = params?.page ?? 1;

        return <p>{index + 1 + limit * (currentPage - 1)}</p>;
      },
    },
    ...columns,
    tableInfo?.actions
      ? {
          title: 'Action',
          key: 'action',
          align: 'center',
          fixed: 'right',
          onCell: () => ({
            onClick: (e: React.MouseEvent) => {
              // Ngăn không cho cell trigger event (ví dụ row click)
              e.stopPropagation();
            },
            // Thiết lập cell không có pointer cursor và không nhận sự kiện
            style: { cursor: 'auto', pointerEvents: 'none' },
          }),
          width: tableInfo?.actions?.length >= 3 ? 200 : 100,
          render: (_, record, index: number) => {
            return (
              <Flex
                gap={16}
                className="content-center justify-center justify-items-center items-center"
              >
                {tableInfo?.actions?.map((item) => {
                  if (item?.type === 'edit') {
                    return (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();

                          setIsOpenModal({
                            open: true,
                            id: record?.id || record?.value,
                            index,
                          });
                        }}
                        className="cursor-pointer pointer-events-auto"
                        key={item?.type}
                      >
                        <EditIcon />
                      </div>
                    );
                  }

                  if (item?.type === 'delete') {
                    return (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          // Pass both id and index to showDeleteConfirm
                          showDeleteConfirm(record?.id || record?.value);
                        }}
                        className="cursor-pointer pointer-events-auto"
                        key={item?.type}
                      >
                        <DeleteIcon />
                      </div>
                    );
                  }
                })}
              </Flex>
            );
          },
        }
      : {},
  ];

  // Get form type props with defaults
  const formType = tableInfo?.createAndUpdate?.formType || 'normal';
  const currentStep = tableInfo?.createAndUpdate?.currentStep || 0;
  const totalSteps = tableInfo?.createAndUpdate?.totalSteps || 1;
  const setCurrentStep = tableInfo?.createAndUpdate?.setCurrentStep;

  // Handle next step for multi-step forms
  const handleNextStep = () => {
    if (setCurrentStep && currentStep < totalSteps - 1) {
      formModal
        .validateFields()
        .then(() => {
          setFormError(null); // Reset form error if validation passes
          setCurrentStep(currentStep + 1);
        })
        .catch((error) => {
          console.log('Validation failed:', error);
          setFormError('Please fill in all required fields for all languages.');
        });
    } else if (setCurrentStep && currentStep === totalSteps - 1) {
      // On the last step, submit the form
      formModal.submit();
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (setCurrentStep && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Custom footer for all form types
  const getModalFooter = () => {
    const isLoading =
      updateMutation?.isPending ||
      createMutation?.isPending ||
      (loadingUpload &&
        Object.values(loadingUpload).some((value) => value === true));

    const buttonStyle = {
      display: !disableBtnModalFunc() ? 'inline-flex' : 'none',
      gap: 3,
    };

    if (formType === 'stepped') {
      return (
        <div className="flex justify-end gap-2">
          {currentStep > 0 && (
            <Button onClick={handlePrevStep}>Previous</Button>
          )}
          {currentStep < totalSteps - 1 ? (
            <Button type="primary" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={
                tableInfo?.createAndUpdate?.isShowConfirmCreate
                  ? showCreateConfirm
                  : formModal.submit
              }
              loading={isLoading}
              disabled={disableBtnModalFunc()}
              style={buttonStyle}
            >
              {isOpenModal?.id ? 'Update' : 'Create'}
            </Button>
          )}
        </div>
      );
    }

    // For normal and tabbed forms, return standard footer buttons
    return (
      <Flex
        gap={4}
        justify={formError ? 'space-between' : 'flex-end'}
        align="center"
      >
        {formError && <Alert message={formError} type="error" showIcon />}

        <Flex gap={4} justify="flex-end" align="center">
          <Button
            onClick={handleCancelModal}
            loading={isLoading}
            style={buttonStyle}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={
              tableInfo?.createAndUpdate?.isShowConfirmCreate
                ? showCreateConfirm
                : formModal.submit
            }
            loading={isLoading}
            disabled={disableBtnModalFunc()}
            style={buttonStyle}
          >
            {isOpenModal?.id ? 'Update' : 'Create'}
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <Form form={form} onValuesChange={handleChangeFilterForm}>
        <Flex vertical gap={16} align='strech'>
          {filterRender}

          <Card>
            <Flex gap={8} justify="flex-end" className="mb-3">
              <Flex gap={8}>
                {tableInfo?.createAndUpdate?.isCreate && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsOpenModal({ open: true, id: '', index: -1 });
                    }}
                  >
                    Add new
                  </Button>
                )}
              </Flex>
            </Flex>

            <Table
              columns={initColumns}
              dataSource={data?.rows}
              loading={isLoading || isLoadingDetail}
              pagination={{
                total: data?.total,
                current: params?.page,
                pageSize: params?.limit,
                position: ['bottomRight', 'topRight'],
                showSizeChanger: true,
                showQuickJumper: false,
                showTotal: () => `Total ${data?.total} items`,
              }}
              onChange={handleChangeTable}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Flex>
      </Form>

      <Modal
        centered
        title={
          isOpenModal?.id ? 'Update ' + title || '' : 'Add New ' + title || ''
        }
        open={isOpenModal?.open}
        onCancel={handleCancelModal}
        width={tableInfo?.createAndUpdate?.modalWidth ?? 700}
        footer={getModalFooter()}
        closable={
          !(
            updateMutation?.isPending ||
            createMutation?.isPending ||
            (loadingUpload &&
              Object.values(loadingUpload).some((value) => value === true))
          )
        }
        loading={isLoadingDetail}
        destroyOnHidden
        maskClosable={false}
      >
        <Form
          form={formModal}
          layout="vertical"
          // disabled={!updateHook}
          onFinish={handleSubmitModal}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo);
            setFormError(
              'Please fill in all required fields for all languages.',
            );
          }}
          className="overflow-y-auto overflow-x-hidden max-h-[75vh] px-1"
          clearOnDestroy
          scrollToFirstError={{
            behavior: 'instant',
            focus: true,
            block: 'center',
          }}
        >
          {ContentModal && (
            <ContentModal
              detail={detail}
              formProps={tableInfo?.createAndUpdate}
            />
          )}
        </Form>
      </Modal>
    </>
  );
};

export default FilterTable;
