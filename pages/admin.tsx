import Head from 'next/head';
import { Card, Layout, Space, Typography, Breadcrumb, Radio, Select } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport, getReportsByUserId, PaginatedReports } from 'services/reportingService';
import { PaginationConfig } from 'antd/lib/pagination';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import ReportStatus, { reportStatusCaptions } from '@models/ReportStatus';
import './admin.less';

type AdminPageProps = { token: string; email: string };

export const AdminPage: React.FunctionComponent<AdminPageProps> = ({ token, email }) => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const [reportStatus, setReportStatus] = useState<ReportStatus | 0>(ReportStatus.WaitingForReview);
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

  const handleReportStatusChange = (value: ReportStatus) => {
    setReportStatus(value);
  };

  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="admin-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">หน้าแรก</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>จัดการรายงาน</Breadcrumb.Item>
            </Breadcrumb>
            <div className="table-header-container">
              <Title level={3} className="page-title">
                รายงานทั้งหมด
              </Title>
              <Select value={reportStatus} onChange={handleReportStatusChange} style={{ width: 120 }}>
                <Select.Option value={ReportStatus.WaitingForReview}>{reportStatusCaptions[1]}</Select.Option>
                <Select.Option value={ReportStatus.RequestMoreDocument}>{reportStatusCaptions[3]}</Select.Option>
                <Select.Option value={ReportStatus.Approved}>{reportStatusCaptions[2]}</Select.Option>
                <Select.Option value={ReportStatus.Rejected}>{reportStatusCaptions[4]}</Select.Option>
                <Select.Option value={0}>ทั้งหมด</Select.Option>
              </Select>
            </div>
            <ReportTable onLoadReports={handleLoadReport} onDeleteReport={handleDeleteReport} />
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

export default withAuthUser<AdminPageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AdminPage);
