import Head from 'next/head';
import { Card, Layout, Space, Typography, Breadcrumb } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport, getReportsByUserId, PaginatedReports } from 'services/reportingService';
import { PaginationConfig } from 'antd/lib/pagination';
import React, { useCallback } from 'react';
import Link from 'next/link';

type ProfilePageProps = { token: string; email: string };

export const ProfilePage: React.FunctionComponent<ProfilePageProps> = ({ token, email }) => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;

  const handleDeleteReport = useCallback(
    async (reportId: string) => {
      await deleteReport(reportId, token);
    },
    [token],
  );

  const handleLoadReport = useCallback(
    async (pagination: PaginationConfig): Promise<PaginatedReports> => {
      return getReportsByUserId(pagination, token);
    },
    [token],
  );

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
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">หน้าแรก</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>ประวัติของคุณ</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={3} className="page-title">
              {email}
            </Title>
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