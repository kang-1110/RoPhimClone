import { UploadType } from 'antd/es/upload/interface';
import { LocationDefaultProps } from '../hooks/GlobalVariableProvider';

export interface DetailUserProps {
  id: string;
  fullname: string;
  grade: string;
  phone: string;
  email: string;
  registration_date: string;
  subscription_start_date: string;
  business_name: string;
  business_mail: string;
  business_address: LocationDefaultProps;
  contact_person_name: string;
  remarks: string;
  avatar: UploadType;
  total_subscription_period: number;
  usage_status: string;
  username: string;
  business_number: string;
  contact_person_phone: string;
  manager_number: string;
  contact_person_mail: string;
  index: string;
}
