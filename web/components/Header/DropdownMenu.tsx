import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import { Role } from '@models/Role';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';

type DropdownMenuProps = {
  role: Role;
  onLoginBtnClick: () => void;
  onProfileBtnClick: () => void;
  onReportBtnClick: () => void;
  onLogoutBtnClick: () => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  role,
  onLoginBtnClick,
  onLogoutBtnClick,
  onProfileBtnClick,
  onReportBtnClick,
}) => {
  const menu = (
    <Menu>
      {role.user ? (
        <>
          {role.admin && (
            <Menu.Item key="4">
              <a href="/admin">จัดการรายงาน</a>
            </Menu.Item>
          )}
          {role.superUser && (
            <Menu.Item key="5">
              <a href="/admin/manage">จัดการแอดมิน</a>
            </Menu.Item>
          )}
          {(role.admin || role.superUser) && <Menu.Divider />}
          <Menu.Item key="3">
            <Button type="link" onClick={onProfileBtnClick}>
              ประวัติของคุณ
            </Button>
          </Menu.Item>
          <Menu.Item key="1">
            <a href="/user/logout">ออกจากระบบ</a>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="0">
          <Button type="link" onClick={onLoginBtnClick}>
            เข้าสู่ระบบ
          </Button>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="2">
        <Button type="link" onClick={onReportBtnClick}>
          รายงานการโกง
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} className="mobile-dropdown-menu">
      <a className="ant-dropdown-link" role="button" onClick={(e) => e.preventDefault()} aria-hidden="true">
        เมนู <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default DropdownMenu;
