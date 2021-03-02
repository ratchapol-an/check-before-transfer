import Head from 'next/head';
import { Card, Layout, Space, Typography } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport, getReportsByUserId, PaginatedReports } from 'services/reportingService';
import { PaginationConfig } from 'antd/lib/pagination';
import { useCallback } from 'react';

export const ProfilePage: React.FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const AuthUser = useAuthUser();

  const handleDeleteReport = useCallback(
    async (reportId: string) => {
      const token = await AuthUser.getIdToken();
      if (token) {
        await deleteReport(reportId, token);
      }
    },
    [AuthUser],
  );

  const handleLoadReport = useCallback(
    async (pagination: PaginationConfig): Promise<PaginatedReports> => {
      const token = await AuthUser.getIdToken();
      if (AuthUser.id && token) {
        return getReportsByUserId(AuthUser.id, pagination, token);
      }

      return { total: 0, data: [] };
    },
    [AuthUser],
  );
  console.log('render profile');
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="profile-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            {/* <PageHeader title="โปรไฟล์ของคุณ" subTitle="sixteenevils3@gmail.com" /> */}
            <Title level={3}>โปรไฟล์ของคุณ</Title>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={5}>รายงานของคุณ</Title>
                <ReportTable onLoadReports={handleLoadReport} onDeleteReport={handleDeleteReport} />
              </Space>
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ProfilePage);
