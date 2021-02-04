import { Button, Layout, Menu, Space } from 'antd';
import Container from '@components/Container';

import './header.less';

const Header: React.FunctionComponent = () => {
  const { Header: AntdHeader } = Layout;
  return (
    <AntdHeader className="header">
      <Container className="header-container">
        {/* <Menu className="header-menu" theme="light" mode="horizontal">
          <Menu.Item key="1">เข้าสู่ระบบ</Menu.Item>
        </Menu> */}
        <Space direction="horizontal">
          <Button type="primary" ghost size="large">
            รายงานการโกง
          </Button>
          <Button type="link" size="large">
            เข้าสู่ระบบ
          </Button>
        </Space>
      </Container>
    </AntdHeader>
  );
};

export default Header;
