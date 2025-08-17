import { Switch } from 'antd';

interface StatusSwitchProps {
  checked: boolean;
  checkedValue: string;
  uncheckedValue: string;
  useQueryHook: any;
  params: any;
  id: string;
  index: number;
  currentValue: string;
  disabled?: boolean;
  fieldKey?: string;
}

interface StatusProps {
  status: string;
}

export const StatusSwitch: React.FC<StatusSwitchProps> = ({
  checked,
  checkedValue,
  uncheckedValue,
  useQueryHook,
  params,
  id,
  index,
  currentValue,
  disabled = false,
  fieldKey = 'status',
}) => {
  const updateStatusMutation = useQueryHook();

  const handleChangeStatus = () => {
    const body: Partial<StatusProps> = {
      [fieldKey]: currentValue === checkedValue ? uncheckedValue : checkedValue,
    };

    updateStatusMutation.mutate({
      id,
      body,
      index,
      params,
    });
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChangeStatus}
      disabled={disabled}
      checkedChildren={checkedValue}
      unCheckedChildren={uncheckedValue}
      loading={updateStatusMutation?.isLoading}
    />
  );
};
