import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import { Role } from '@models/Role';
import { Dropdown, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';

type DropdownMenuProps = {
  role: Role;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ role }) => {
  const menu = (
    <Menu>
      {role.user || role.admin || role.superUser ? (
        <>
          {role.admin && (
            <Menu.Item key="4">
              <Link href="/admin">จัดการรายงาน</Link>
            </Menu.Item>
          )}
          {role.superUser && (
            <Menu.Item key="5">
              <Link href="/admin/manage">จัดการแอดมิน</Link>
            </Menu.Item>
          )}
          {(role.admin || role.superUser) && <Menu.Divider />}
          <Menu.Item key="3">
            <Link href="/user/profile">ประวัติของคุณ</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link href="/user/logout">ออกจากระบบ</Link>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="0">
          <Link href="/user/login">เข้าสู่ระบบ</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="2">
        <Link href="/report">รายงานการโกง</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="6">
        <Link href="https://lin.ee/ktLQLwv">ติดต่อเรา</Link>
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
