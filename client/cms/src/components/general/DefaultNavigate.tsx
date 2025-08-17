import { Avatar, Button, Menu, MenuProps, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineSpaceDashboard, MdLogout } from 'react-icons/md';
import { LuNotebookText } from 'react-icons/lu';
import { TiFolder } from 'react-icons/ti';
import { GoBook, GoQuestion } from 'react-icons/go';
import { IoVolumeHighOutline } from 'react-icons/io5';
import { CiUser, CiSearch, CiShoppingCart, CiSettings } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLogoutFunction } from '../../api/axiosInstance';
import { ROUTES } from '../../constants/routers';
import { STORAGES } from '../../constants/storage';
import { TranslationKey } from '../../type/I18nKeyType';
import { getCookie } from '../../utils/utils';

const DefaultNavigate = ({ collapsed }: { collapsed: boolean }) => {
  const user = getCookie(STORAGES.USER_LOGIN);
  const [selectItem, setSelectItem] = useState<string>('');
  const [animate, setAnimate] = useState<boolean>(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const { t } = useTranslation();

  const getRandomUIAvatar = () => {
    const name = user?.username ?? 'test';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=random&color=ffffff&rounded=true`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false); // Xóa class animation
      setTimeout(() => setAnimate(true), 50); // Thêm lại animation sau 50ms
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    setSelectItem(pathname?.pathname?.slice(1));
  }, [pathname]);

  const handleLogout = () => {
    Modal.confirm({
      centered: true,
      title: t(TranslationKey.Logout),
      content: t(TranslationKey.ConfirmLogout),
      onOk() {
        handleLogoutFunction();
      },
    });
  };

  // Cấu hình ánh xạ route với icon và label
  const menuConfig = [
    {
      key: ROUTES.DASHBOARD.replace('/', ''),
      label: t(TranslationKey.Dashboard),
      icon: <MdOutlineSpaceDashboard size={16} />,
      route: ROUTES.DASHBOARD,
    },
    {
      key: ROUTES.CUSTOMERS.replace('/', ''),
      label: "Customers",
      icon: <CiUser size={16} />,
      route: ROUTES.CUSTOMERS,
    },
    {
      key: ROUTES.POINTANDCOUPONS.replace('/', ''),
      label: "Point and Coupons",
      icon: <LuNotebookText size={16} />,
      route: ROUTES.POINTANDCOUPONS,
    },
    {
      key: ROUTES.CAMPAIGN.replace('/', ''),
      label: "Campaign",
      icon: <GoBook size={16} />,
      route: ROUTES.CAMPAIGN,
    },
    {
      key: ROUTES.REPORTANDANALYTICS.replace('/', ''),
      label: "Report and Analytics",
      icon: <GoQuestion size={16} />,
      route: ROUTES.REPORTANDANALYTICS,
    },
    {
      key: ROUTES.STAFF.replace('/', ''),
      label: "Staff",
      icon: <CiUser size={16} />,
      route: ROUTES.STAFF,
    },
    {
      key: ROUTES.NOTIFICATION.replace('/', ''),
      label: "Notification",
      icon: <IoVolumeHighOutline size={16} />,
      route: ROUTES.NOTIFICATION,
    },
    {
      key: ROUTES.GASSTATION.replace('/', ''),
      label: "Gas Station",
      icon: <TiFolder size={16} />,
      route: ROUTES.GASSTATION,
    },
    {
      key: ROUTES.SETTING.replace('/', ''),
      label: "Setting",
      icon: <CiSettings size={16} />,
      route: ROUTES.SETTING,
    },
  ];

  type MenuItem = Required<MenuProps>['items'][number];

  // Sinh ra items từ menuConfig
  const items: MenuItem[] = menuConfig.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => navigate(item.route),
  }));

  return (
    <div className="max-h-[100vh] h-full w-[258px] flex flex-col z-0 justify-between">
      <div className="flex flex-col flex-1">
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[selectItem]}
          className="px-4 overflow-auto flex-1"
          rootClassName="custom-menu"
        />
        <Button
          onClick={handleLogout}
          icon={<MdLogout />}
          className="mx-4"
          color="danger"
          variant="text"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default React.memo(DefaultNavigate);
