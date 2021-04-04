import React, { FunctionComponent } from 'react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { withAuthUser, withAuthUserTokenSSR, SSRPropsContext } from 'next-firebase-auth';

import { Breadcrumb, Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';

import Container from '@components/Container';
import Header from '@components/Header';
import { NoResults, SearchForm, SearchResults } from '@components/Search';
import SearchBy from 'models/searchBy';
import { search, SearchResult } from 'services/reportingService';

import './results.less';
import { ParsedUrlQuery } from 'querystring';
import Link from 'next/link';
import { KeywordsAndDescription } from '@components/Seo';

// type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

type ResultsProps = {
  searchValue: string;
  searchBy: SearchBy;
  searchResult: SearchResult | null;
};
const Results: FunctionComponent<ResultsProps> = ({ searchBy, searchValue, searchResult }) => {
  return (
    <div>
      <Head>
        <title>ผลการค้นหาคนโกง {searchValue}</title>
        <KeywordsAndDescription />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="results-page-layout layout-with-bg">
        <Header />
        <Content className="results-page-content">
          <Container>
            <SearchForm initialSearchBy={searchBy} initialValue={searchValue} />
          </Container>
          <Divider />
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">หน้าแรก</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>ผลการค้นหา</Breadcrumb.Item>
            </Breadcrumb>
            {searchResult ? (
              <SearchResults
                lastReport={searchResult.lastedReport}
                totalAmount={searchResult.totalDamagedPrice}
                totalNumberOfReports={searchResult.totalReport}
              />
            ) : (
              <NoResults />
            )}
            <a href="/" target="blank">
              <div className="ads ads-sky" />
            </a>
            <a href="/" target="blank">
              <div className="ads ads-lb" />
            </a>
            <a href="/" target="blank">
              <div className="ads ads-rec" />
            </a>
            <a href="/" target="blank">
              <div className="ads ads-mobile" />
            </a>
          </Container>
        </Content>
      </Layout>
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ query }: SSRPropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<ResultsProps>> => {
    const { q, by } = query;
    const searchValue = typeof q === 'string' ? q.trim() : '';
    const searchBy = typeof by === 'string' ? (by as SearchBy) : 'bank-account';
    let searchResult: SearchResult | null = null;
    if (searchValue) {
      try {
        searchResult = await search(searchValue, searchBy);
      } catch (e) {
        searchResult = null;
      }
    }

    return {
      props: {
        searchValue,
        searchBy,
        searchResult,
      },
    } as GetServerSidePropsResult<ResultsProps>;
  },
) as Promise<GetServerSidePropsResult<ResultsProps>>;

export default withAuthUser<ResultsProps>()(Results);
