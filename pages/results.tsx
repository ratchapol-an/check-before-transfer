import Container from '@components/Container';
import Header from '@components/Header';
import { SearchBy, SearchForm, SearchResults } from '@components/Search';
import { Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import './results.less';

export default function Results() {
  const router = useRouter();
  const { q, by } = router.query;
  const initialSearchValue = typeof q === 'string' ? q : undefined;
  const initialSearchBy = typeof by === 'string' ? (by as SearchBy) : undefined;

  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="results-page-layout">
        <Header />
        <Content className="results-page-content">
          <Container>
            <SearchForm initialSearchBy={initialSearchBy} initialValue={initialSearchValue} />
          </Container>
          <Divider />
          <Container>
            <SearchResults />
          </Container>
        </Content>
      </Layout>
    </>
  );
}
