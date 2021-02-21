/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Layout, Menu, Space } from 'antd';
import Container from '@components/Container';
import Image from 'next/image';
import Link from 'next/link';
import { WithAuth } from '@models/Authentication';
import './header.less';
import { useRouter } from 'next/router';

type HeaderProps = {
  auth: WithAuth;
};

const Header: React.FunctionComponent<HeaderProps> = ({ auth }) => {
  const { Header: AntdHeader } = Layout;
  const router = useRouter();
  const handleReportBtnClick = () => {
    router.push('/report');
  };
  const handleLoginBtnClick = () => {
    router.push('/user/login');
  };
  return (
    <AntdHeader className="header">
      <Container className="header-container">
        {/* <Menu className="header-menu" theme="light" mode="horizontal">
          <Menu.Item key="1">เข้าสู่ระบบ</Menu.Item>
        </Menu> */}
        <Link href="/">
          <a className="header-logo-link" target="_self">
            <Image width={197.15} height={45} alt="whoscheat" src="/logo3.png" />
          </a>
        </Link>
        <Space direction="horizontal">
          <Button type="primary" ghost size="large" onClick={handleReportBtnClick}>
            รายงานการโกง
          </Button>
          {auth.email ? (
            <Button type="link" size="large" onClick={auth.signOut}>
              ออจากระบบ
            </Button>
          ) : (
            <Button type="link" size="large" onClick={handleLoginBtnClick}>
              เข้าสู่ระบบ
            </Button>
          )}
        </Space>
      </Container>
    </AntdHeader>
  );
};

export default Header;
