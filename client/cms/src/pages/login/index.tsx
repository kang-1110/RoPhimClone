import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSelect from '../../components/general/LanguageSelect';
import { PASSWORD_PATTERN } from '../../constants/regex';
import { ROUTES } from '../../constants/routers';
import { STORAGES } from '../../constants/storage';
import { useLogin } from '../../hooks/useAuth';
import { TranslationKey } from '../../type/I18nKeyType';
import { DataLoginType } from '../../type/UserLoginType';
import { setCookie } from '../../utils/utils';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const loginMutation = useLogin();

  // useEffect(() => {
  //   if (token) {
  //     navigate(ROUTES.LOGIN);
  //   }
  // }, [navigate, token]);

  const onFinishForm = (values: DataLoginType) => {
    // loginMutation.mutate(values);
    setCookie(STORAGES.ACCESS_TOKEN, "fake token")
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <Col sm={24} md={24} lg={8} className="p-5 w-full">
        <LanguageSelect className="w-[180px]" />
        <Flex vertical className="items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="logo"
            className="object-cover rounded-xl"
            preview={false}
            wrapperClassName='w-[100px]'
          />
          <Typography.Title level={3} className="!my-5">
            Init Source
          </Typography.Title>
          <Typography.Title level={4} className="!my-10">
            {t(TranslationKey.Signin)}
          </Typography.Title>
          <Form
            disabled={loginMutation.isPending}
            onFinish={onFinishForm}
            className="w-full"
            layout="vertical"
            requiredMark
            form={form}
          >
            <Form.Item
              label={t(TranslationKey.Email)}
              name="email"
              required
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t(TranslationKey.EmailRequired),
                },
                { type: 'email', message: t(TranslationKey.EmailInvalid) },
              ]}
            >
              <Input
                placeholder={t(TranslationKey.EnterEmail)}
                size="large"
                type="email"
              />
            </Form.Item>
            <Form.Item
              label={t(TranslationKey.Password)}
              name="password"
              required
              tooltip={{
                title: t('password-tooltip'),
                icon: <InfoCircleOutlined />,
              }}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t(TranslationKey.PasswordRequired),
                },
                {
                  pattern: PASSWORD_PATTERN,
                  message: t(TranslationKey.PasswordInvalid),
                },
              ]}
            >
              <Input.Password
                placeholder={t(TranslationKey.EnterPassword)}
                size="large"
              />
            </Form.Item>

            <Button
              size="large"
              htmlType="submit"
              className="w-full"
              type="primary"
              loading={loginMutation.isPending}
            >
              {t(TranslationKey.Login)}
            </Button>
          </Form>
        </Flex>
        <Row justify={'center'}>
          <p className="text-tertiary mt-2">
            By continuing, you agree to{' '}
            <span className="underline underline-offset-4">Terms of Use</span>{' '}
            and{' '}
            <span className="underline underline-offset-4">Privacy Policy</span>
          </p>
        </Row>
      </Col>
  );
};

export default Login;
