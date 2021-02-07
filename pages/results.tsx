import Container from '@components/Container';
import Header from '@components/Header';
import { SearchForm, SearchResults } from '@components/Search';
import { Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import SearchBy from 'models/searchBy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import './results.less';

export default function Results({
  initialSearchBy,
  initialSearchValue,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  initialSearchValue: string;
  initialSearchBy?: SearchBy;
}> = async (context) => {
  const { q, by } = context.query;
  return {
    props: {
      initialSearchValue: typeof q === 'string' ? q : '',
      initialSearchBy: typeof by === 'string' ? (by as SearchBy) : 'bank-account',
    },
  };
};
