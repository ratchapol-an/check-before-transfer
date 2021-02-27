import Head from 'next/head';
import { Card, Layout, PageHeader, Typography } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport, getReportsByUserId, PaginatedReports } from 'services/reportingService';
import { mockReport } from '@models/Report';
import { PaginationConfig } from 'antd/lib/pagination';

interface ProfilePageProps {
  email: string;
  token: string;
}
export const ProfilePage: React.FunctionComponent<ProfilePageProps> = ({ email, token }) => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const AuthUser = useAuthUser();

  const handleDeleteReport = async (reportId: string) => {
    await deleteReport(reportId, token);
  };

  const handleOnLoadReport = async (pagination: PaginationConfig): Promise<PaginatedReports> => {
    if (AuthUser.id) {
      return getReportsByUserId(AuthUser.id, token);
    }

    return { total: 0, data: [] };
  };
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="profile-page-layout layout-with-bg">
        <Header auth={AuthUser} />
        <Content>
          <Container>
            <PageHeader title="โปรไฟล์ของคุณ" subTitle={email} />
            <Card>
              <Title level={4}>รายงานของคุณ</Title>
              <ReportTable onLoadReports={} onDeleteReport={handleDeleteReport} />
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
      email: AuthUser.email,
    },
  };
});

export default withAuthUser<ProfilePageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ProfilePage);
