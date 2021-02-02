import { Button, Layout, Menu } from 'antd';
import Container from '@components/Container';

import './header.less';

const Header: React.FunctionComponent = () => {
  const { Header: AntdHeader } = Layout;
  return (
    <AntdHeader className="header">
      <Container className="header-container">
        <Menu className="header-menu" theme="light" mode="horizontal">
          <Menu.Item key="1">ประวัติของฉัน</Menu.Item>
        </Menu>
        <Button shape="round">เข้าสู่ระบบ</Button>
      </Container>
    </AntdHeader>
  );
};

export default Header;
