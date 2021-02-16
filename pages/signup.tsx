import { SignUpForm } from '@components/Account';
import { Card } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import React from 'react';
import './signup.less';

export default function SignIn() {
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="sign-up-page-layout">
        <Content className="sign-up-page-content">
          <Card className="sign-up-card">
            <SignUpForm />
          </Card>
        </Content>
      </Layout>
    </>
  );
}
