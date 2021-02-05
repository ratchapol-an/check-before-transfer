import Container from '@components/Container';
import Header from '@components/Header';
import { SearchBy, SearchForm, SearchResults } from '@components/Search';
import Layout, { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

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
      <Layout className="layout">
        <Header />
        <Content>
          <Container>
            <SearchForm initialSearchBy={initialSearchBy} initialValue={initialSearchValue} />
          </Container>
          <Container>
            <SearchResults />
          </Container>
        </Content>
      </Layout>
    </>
  );
}
