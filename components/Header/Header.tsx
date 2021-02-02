import { Button, Layout, Menu } from 'antd';
import './header.less';

const Header: React.FunctionComponent = () => {
  const { Header: AntdHeader } = Layout;
  return (
    <AntdHeader className="header" style={{ backgroundColor: 'white', textAlign: 'right' }}>
      <Menu theme="light" mode="horizontal">
        <Menu.Item key="1">ประวัติของฉัน</Menu.Item>
      </Menu>
      <Button>เข้าสู่ระบบ</Button>
    </AntdHeader>
  );
};

export default Header;
