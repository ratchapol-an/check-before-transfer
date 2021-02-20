import Head from 'next/head';
import { withAuthUser, useAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { Layout } from 'antd';
import { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportForm } from '@components/Report';
import './index.less';

const Report: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const AuthUser = useAuthUser();
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="report-page-layout">
        <Header auth={AuthUser} />
        <Content>
          <Container>
            <ReportForm />
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  console.log('token', token);

  return {
    props: {},
  };
});

export default withAuthUser()(Report);
