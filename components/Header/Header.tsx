/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Layout, Menu, Space } from 'antd';
import Container from '@components/Container';
import Image from 'next/image';
import Link from 'next/link';
import './header.less';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthUser } from 'next-firebase-auth';
import { parseToken } from '../../utils';

interface Role {
  admin: boolean;
  user: boolean;
}
const Header: React.FunctionComponent = () => {
  const { Header: AntdHeader } = Layout;
  const auth = useAuthUser();
  const router = useRouter();
  const [role, setRole] = useState<Role>({
    admin: false,
    user: false,
  });
  const handleReportBtnClick = () => {
    router.push('/report');
  };
  const handleLoginBtnClick = () => {
    const currentQuery = router.query;
    let redirectURL = '/';
    if (typeof window !== 'undefined') redirectURL = window.location.pathname;
    router.push({
      pathname: '/user/login',
      query: { redirectURL, ...currentQuery },
    });
  };
  const handleProfileBtnClick = () => {
    router.push('/user/profile');
  };

  useEffect(() => {
    auth.getIdToken().then((token) => {
      if (!token) return;
      const decodedJWT = parseToken(token);
      if (decodedJWT.superUser || decodedJWT.admin)
        setRole({
          admin: true,
          user: false,
        });
      if (!decodedJWT.superUser && !decodedJWT.admin)
        setRole({
          admin: false,
          user: true,
        });
    });
  }, [auth]);

  return (
    <AntdHeader className="header">
      <Container className="header-container">
        {/* <Menu className="header-menu" theme="light" mode="horizontal">
          <Menu.Item key="1">เข้าสู่ระบบ</Menu.Item>
        </Menu> */}
        <Link href="/">
          <a className="header-logo-link">
            <Image width={197.15} height={45} alt="whoscheat" src="/logo3.png" />
          </a>
        </Link>
        <Space direction="horizontal">
          {auth.email ? (
            <>
              <Button type="link" size="large" onClick={handleProfileBtnClick}>
                ประวัติของคุณ
              </Button>
              <Button type="link" size="large" onClick={auth.signOut}>
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
        </Space>
      </Container>
    </AntdHeader>
  );
};

export default Header;
