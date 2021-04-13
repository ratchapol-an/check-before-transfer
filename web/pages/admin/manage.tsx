import Head from 'next/head';
import { Layout, Typography, Breadcrumb, Form, Radio, Input, Button, message } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import './index.less';
import { isSuperUser } from 'utils';
import { addRole } from 'services/adminService';

type AdminPageProps = { token: string; email: string };

export const AdminPage: React.FunctionComponent<AdminPageProps> = ({ token, email }) => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const handleFormFinish = useCallback(
    async ({ uid, role }: { role: 'admin' | 'superUser'; uid: string }) => {
      try {
        await addRole(uid, { superUser: role === 'superUser', admin: role === 'admin' }, token);
        message.success('สำเร็จ');
      } catch {
        message.error('ไม่สำเร็จ');
      }
    },
    [token],
  );
  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>

        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="admin-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">หน้าแรก</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>จัดการแอดมิน</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={3} className="page-title">
              จัดการตำแหน่งแอดมิน
            </Title>
            <Form layout="vertical" onFinish={handleFormFinish} style={{ maxWidth: 480 }}>
              <Form.Item label="ตำแหน่ง" name="role">
                <Radio.Group>
                  <Radio.Button value="admin">Admin</Radio.Button>
                  <Radio.Button value="superUser">Super User</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="UID"
                name="uid"
                required
                tooltip="จาก https://console.firebase.google.com/u/3/project/whoscheat-e2261/authentication/users"
              >
                <Input placeholder="UID" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  ยืนยัน
                </Button>
              </Form.Item>
            </Form>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();

  if (!isSuperUser(token)) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
      email: AuthUser.email,
    },
  };
});

export default withAuthUser<AdminPageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AdminPage);
