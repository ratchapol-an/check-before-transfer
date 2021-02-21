import Head from 'next/head';
import { Card, Divider, Layout, Typography } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportForm } from '@components/Report';
import './index.less';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';

const Report: React.FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
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
          <Divider />
          <Container>
            <Title level={3}>รายงานการโกง</Title>
            <Card>
              <ReportForm />
            </Card>
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
