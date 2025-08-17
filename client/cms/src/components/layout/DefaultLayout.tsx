import { useState, Suspense } from 'react';
import { App, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs';
import DefaultNavigate from '../general/DefaultNavigate';
import DefaultHeader from '../general/DefaultHeader';
import Loading from '../general/Loading';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
      <Layout className="h-full">
        <Header className="bg-white px-6 content-center sticky top-0 z-50 shadow-md">
          <DefaultHeader />
        </Header>
        <Layout>
          <Sider
            trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            width={258}
            collapsed={collapsed}
            theme="light"
            onCollapse={toggle}
          >
            <DefaultNavigate collapsed={collapsed} />
          </Sider>
          <Content className="min-h-[calc(100vh-64px)] h-[calc(100vh-64px)] overflow-auto bg-slate-100 p-6 ">
            <Suspense fallback={<Loading />}>
              <App>
                <Outlet />
              </App>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </StyleProvider>
  );
};

export default AppLayout;
