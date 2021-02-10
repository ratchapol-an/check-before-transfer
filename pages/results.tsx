import Container from '@components/Container';
import Header from '@components/Header';
import { NoResults, SearchForm, SearchResults } from '@components/Search';
import { Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import SearchBy from 'models/searchBy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { search, SearchResult } from 'services/reportingService';

import './results.less';

export default function Results({
  searchBy,
  searchValue,
  searchResult,
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
          <Container>
            {searchResult ? (
              <SearchResults
                lastReport={searchResult.lastedReport}
                totalAmount={searchResult.totalDamagedPrice}
                totalNumberOfReports={searchResult.totalReport}
              />
            ) : (
              <NoResults />
            )}
          </Container>
        </Content>
      </Layout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  searchValue: string;
  searchBy?: SearchBy;
  searchResult: SearchResult | null;
}> = async (context) => {
  const { q, by } = context.query;
  const searchValue = typeof q === 'string' ? q : '';
  const searchBy = typeof by === 'string' ? (by as SearchBy) : 'bank-account';
  let searchResult: SearchResult | null = null;
  if (searchValue) {
    try {
      searchResult = await search(searchValue, searchBy);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    props: {
      searchValue,
      searchBy,
      searchResult,
    },
  };
};
