import Container from '@components/Container';
import Header from '@components/Header';
import { NoResults, SearchForm, SearchResults } from '@components/Search';
import { Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import Report from 'models/Report';
import SearchBy from 'models/searchBy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { search } from 'services/reportingService';

import './results.less';

export default function Results({
  searchBy,
  searchValue,
  reports,
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
            <SearchForm initialSearchBy={searchBy} initialValue={searchValue} />
          </Container>
          <Divider />
          <Container>{reports.length ? <SearchResults /> : <NoResults />}</Container>
        </Content>
      </Layout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  searchValue: string;
  searchBy?: SearchBy;
  reports: Report[];
}> = async (context) => {
  const { q, by } = context.query;
  const searchValue = typeof q === 'string' ? q : '';
  const searchBy = typeof by === 'string' ? (by as SearchBy) : 'bank-account';
  let reports: Report[] = [];
  if (searchValue) {
    reports = await search(searchValue, searchBy);
  }

  return {
    props: {
      searchValue,
      searchBy,
      reports,
    },
  };
};
