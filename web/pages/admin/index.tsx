import Head from 'next/head';
import { Layout, Typography, Breadcrumb, Select, TablePaginationConfig } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import ReportTable from '@components/Report/ReportTable';
import { deleteReport, getReportsByStatus, PaginatedReports } from 'services/reportingService';
import { PaginationConfig } from 'antd/lib/pagination';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import ReportStatus, { reportStatusCaptions } from '@models/ReportStatus';
import './index.less';
import { isAdminRole } from 'utils';

type AdminPageProps = { token: string; email: string };
type ReportPageConfig = {
  reportStatus: ReportStatus;
  currentPage: number;
};
export const AdminPage: React.FunctionComponent<AdminPageProps> = ({ token, email }) => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const [reportPageConfig, setReportPageConfig] = useState<ReportPageConfig>({
    reportStatus: ReportStatus.WaitingForReview,
    currentPage: 1,
  });
  const handleDeleteReport = useCallback(
    async (reportId: string) => {
      await deleteReport(reportId, token);
    },
    [token],
  );

  const handleLoadReport = useCallback(
    async (pagination: PaginationConfig): Promise<PaginatedReports> => {
      return getReportsByStatus(reportPageConfig.reportStatus, pagination, token);
    },
    [reportPageConfig, token],
  );

  const handleReportStatusChange = (value: ReportStatus) => {
    setReportPageConfig({ reportStatus: value, currentPage: 1 });
  };

  const handleTableChange = ({ current = 1 }: TablePaginationConfig) => {
    setReportPageConfig({ reportStatus: reportPageConfig.reportStatus, currentPage: current });
  };

  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>
        <script type="text/javascript" src="/gtag.js" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
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
              <Select value={reportPageConfig.reportStatus} onChange={handleReportStatusChange} style={{ width: 160 }}>
                <Select.Option value={ReportStatus.WaitingForReview}>{reportStatusCaptions[1]}</Select.Option>
                <Select.Option value={ReportStatus.RequestMoreDocument}>{reportStatusCaptions[4]}</Select.Option>
                <Select.Option value={ReportStatus.Approved}>{reportStatusCaptions[2]}</Select.Option>
                <Select.Option value={ReportStatus.Rejected}>{reportStatusCaptions[3]}</Select.Option>
                <Select.Option value={0}>ทั้งหมด</Select.Option>
              </Select>
            </div>
            <ReportTable
              isAdmin
              currentPage={reportPageConfig.currentPage}
              onLoadReports={handleLoadReport}
              onDeleteReport={handleDeleteReport}
              onTableChange={handleTableChange}
            />
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

  if (!isAdminRole(token)) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

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
