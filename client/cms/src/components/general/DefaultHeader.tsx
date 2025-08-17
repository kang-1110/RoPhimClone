import { Avatar, Dropdown, Flex, Image, MenuProps, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_TITLES, ROUTES } from '../../constants/routers';
import { STORAGES } from '../../constants/storage';
import { useLogout } from '../../hooks/useAuth';
import { clearCookie, getCookie } from '../../utils/utils';
import LanguageSelect from './LanguageSelect';

const DefaultHeader = () => {
  const user = getCookie(STORAGES.USER_LOGIN);
  const [selectItem, setSelectItem] = useState('');
  const pathname = useLocation();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!pathname) return;
    setSelectItem(pathname?.pathname?.slice(1));
  }, [pathname]);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      onOk() {
        // logoutMutation.mutate();

        //fake logout
        clearCookie(STORAGES.ACCESS_TOKEN);
        navigate(ROUTES.LOGIN);
      },
    });
  };

  const getRandomUIAvatar = () => {
    const name = user?.username ?? 'test';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=random&color=ffffff&rounded=true`;
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <Flex justify="flex-start" align="center" gap={10}>
          <Image
            src="/icons/logout.svg"
            alt="logout icon"
            width={20}
            height={20}
            preview={false}
          />{' '}
          Logout
        </Flex>
      ),
      onClick: () => handleLogout(),
    },
  ];

  return (
    <div className="flex justify-center items-center w-full gap-4">
      <div className="flex-1 flex justify-between items-center border-none">
        <p className="text-xl font-bold">{HEADER_TITLES[pathname.pathname]}</p>

        <Flex align='center' gap={13}>
          <LanguageSelect />
          <Dropdown menu={{ items: dropdownItems }}>
            <Flex align='center' gap={10} className="cursor-pointer">
              <Avatar
                src={getRandomUIAvatar()}
                alt="User Avatar"
              />
              <Typography.Text>
                {user?.username || 'Guest'}
              </Typography.Text>
            </Flex>

          </Dropdown>
        </Flex>
      </div>
      
    </div>
  );
};

export default DefaultHeader;
