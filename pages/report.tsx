import Head from 'next/head';
import { Layout } from 'antd';
import React from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import './index.less';
import { ReportForm } from '@components/Report';

export default function Report() {
  const { Content, Footer } = Layout;
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="report-page-layout">
        <Header />
        <Content>
          <Container>
            <ReportForm />
          </Container>
        </Content>
      </Layout>
    </>
  );
}
