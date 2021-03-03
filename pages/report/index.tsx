import Head from 'next/head';
import { Card, Divider, Layout, Typography, Modal } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportFormContainer } from '@components/Report';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import Report from '@models/Report';
import { addReport } from 'services/reportingService';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface ReportPageProps {
  token: string;
}
const ReportPage: React.FunctionComponent<ReportPageProps> = ({ token }) => {
  const { Content } = Layout;
  const { Title } = Typography;
  const router = useRouter();
  const handleConfirm = useCallback(
    async (report: Report) => {
      await addReport(report, token);
      router.push('/thankyou');
    },
    [router, token],
  );
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="report-page-layout layout-with-bg">
        <Header />
        <Content>
          <Divider />
          <Container>
            <Title level={3}>รายงานการโกง</Title>
            <Card>
              <ReportFormContainer onConfirm={handleConfirm} token={token} />
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  return {
    props: {
      token,
    },
  };
});

export default withAuthUser<ReportPageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ReportPage);
