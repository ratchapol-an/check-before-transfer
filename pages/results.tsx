import { FunctionComponent } from 'react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { withAuthUser, useAuthUser, withAuthUserTokenSSR, SSRPropsContext } from 'next-firebase-auth';

import { Divider } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';

import Container from '@components/Container';
import Header from '@components/Header';
import { NoResults, SearchForm, SearchResults } from '@components/Search';
import SearchBy from 'models/searchBy';
import { search, SearchResult } from 'services/reportingService';

import './results.less';
import { ParsedUrlQuery } from 'querystring';

// type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

type ResultsProps = {
  searchValue: string;
  searchBy: SearchBy;
  searchResult: SearchResult | null;
};
const Results: FunctionComponent<ResultsProps> = ({ searchBy, searchValue, searchResult }) => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="results-page-layout">
        <Header auth={AuthUser} />
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
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ query, AuthUser }: SSRPropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<ResultsProps>> => {
    const token = await AuthUser.getIdToken();
    console.log('token', token);
    const { q, by } = query;
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
    console.log('searchResult', searchResult);

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

// export const getServerSideProps: GetServerSideProps<{
//   searchValue: string;
//   searchBy?: SearchBy;
//   searchResult: SearchResult | null;
// }> = async (context) => {
//   const { q, by } = context.query;
//   const searchValue = typeof q === 'string' ? q : '';
//   const searchBy = typeof by === 'string' ? (by as SearchBy) : 'bank-account';
//   let searchResult: SearchResult | null = null;
//   if (searchValue) {
//     try {
//       searchResult = await search(searchValue, searchBy);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//   console.log('searchResult', searchResult);

//   return {
//     props: {
//       searchValue,
//       searchBy,
//       searchResult,
//     },
//   };
// };
