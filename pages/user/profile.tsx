import Head from 'next/head';
import { Card, Layout, PageHeader, Space, Typography } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport } from 'services/reportingService';
import { mockReport } from '@models/Report';

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
            {/* <PageHeader title="โปรไฟล์ของคุณ" subTitle="sixteenevils3@gmail.com" /> */}
            <Title level={3}>โปรไฟล์ของคุณ</Title>
            <Card>
              <Space direction="vertical">
                <Title level={5}>รายงานของคุณ</Title>
                <ReportTable onDeleteReport={handleDeleteReport} />
              </Space>
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
