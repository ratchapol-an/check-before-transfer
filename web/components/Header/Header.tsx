import { Button, Dropdown, Layout, Menu, Space } from 'antd';
import Container from '@components/Container';
import Image from 'next/image';
import Link from 'next/link';
import './header.less';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthUser } from 'next-firebase-auth';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import { parseToken } from 'utils';
import { Role } from 'models/Role';
import DropdownMenu from './DropdownMenu';

const Header: React.FunctionComponent = () => {
  const { Header: AntdHeader } = Layout;
  const auth = useAuthUser();
  const router = useRouter();
  const [role, setRole] = useState<Role>({
    superUser: false,
    admin: false,
    user: false,
  });
  const handleReportBtnClick = () => {
    router.push('/report');
  };
  const handleLoginBtnClick = () => {
    const currentQuery = router.query;
    let signInSuccessUrl = '/';
    if (typeof window !== 'undefined') signInSuccessUrl = window.location.pathname;
    router.push({
      pathname: '/user/login',
      query: { signInSuccessUrl, ...currentQuery },
    });
  };
  const handleProfileBtnClick = () => {
    router.push('/user/profile');
  };
  const handleLogout = async () => {
    router.push('/user/logout');
  };
  useEffect(() => {
    auth.getIdToken().then((token) => {
      if (!token) return;
      const decodedJWT = parseToken(token);
      setRole({
        superUser: decodedJWT.superUser,
        admin: decodedJWT.admin,
        user: !decodedJWT.admin && !decodedJWT.superUser,
      });
    });
  }, [auth]);

  const adminMenu = (
    <Menu>
      {(role.admin || role.superUser) && (
        <Menu.Item key="0">
          <Link href="/admin">จัดการรายงาน</Link>
        </Menu.Item>
      )}
      {role.superUser && (
        <Menu.Item key="1">
          <Link href="/admin/manage">จัดการแอดมิน</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <AntdHeader className="header">
      <Container className="header-container">
        <Link href="/">
          <a className="header-logo-link">
            <Image width={197.15} height={45} alt="whoscheat" src="/logo3.png" />
          </a>
        </Link>
        <Space direction="horizontal" className="large-screen-menu">
          {auth.email ? (
            <>
              <Button type="link" size="large" onClick={handleProfileBtnClick}>
                ประวัติของคุณ
              </Button>
              <Button type="link" size="large" onClick={handleLogout}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Button type="link" size="large" onClick={handleLoginBtnClick}>
              เข้าสู่ระบบ
            </Button>
          )}
          <Button type="primary" ghost size="large" onClick={handleReportBtnClick}>
            รายงานการโกง
          </Button>
          {(role.admin || role.superUser) && (
            <Dropdown className="admin-menu" overlay={adminMenu} trigger={['click']}>
              <a className="ant-dropdown-link" role="link" onClick={(e) => e.preventDefault()}>
                แอดมิน <DownOutlined />
              </a>
            </Dropdown>
          )}
        </Space>
        <Link href="https://www.facebook.com/whoscheatthailand">
          <a className="fb-link" target="_blank">
            <Image width={30} height={30} alt="facebook" src="/fb.png" />
          </a>
        </Link>
        <Link href="https://lin.ee/ktLQLwv">
          <a className="line-link" target="_blank">
            <Image width={45} height={45} alt="contact" src="/line.png" />
          </a>
        </Link>
        <DropdownMenu role={role} />
      </Container>
    </AntdHeader>
  );
};

export default Header;
