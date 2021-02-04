import Container from '@components/Container';
import Header from '@components/Header';
import { SearchForm } from '@components/Search';
import Layout, { Content } from 'antd/lib/layout/layout';
import PageHeader from 'antd/lib/page-header';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

export default function Results() {
  const router = useRouter();
  console.log(router.query);
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="layout">
        <Header />
        <Content>
          <Container>
            <SearchForm />
            <PageHeader
              className="site-page-header"
              onBack={() => null}
              title="ผลการค้นหา"
              subTitle="This is a subtitle"
            />
          </Container>
        </Content>
      </Layout>
    </>
  );
}
