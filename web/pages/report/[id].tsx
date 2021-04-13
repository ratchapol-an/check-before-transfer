import Head from 'next/head';
import { Card, Layout, Typography, Breadcrumb, notification, Space, Tag } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportFormContainer, ReportFormValues } from '@components/Report';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { getReportById, updateReport, updateReportStatus } from 'services/reportingService';
import Report from '@models/Report';
import { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import React, { useCallback } from 'react';
import Link from 'next/link';
import ReportStatus, { reportStatusCaptions, reportStatusColors } from '@models/ReportStatus';
import { isAdminRole, notifyError } from 'utils';
import { useRouter } from 'next/router';
import { KeywordsAndDescription } from '@components/Seo';

interface ReportPageProps {
  report: Report;
  token: string;
  isAdmin: boolean;
}
const ReportPage: React.FunctionComponent<ReportPageProps> = ({ token, report, isAdmin }) => {
  const { Content } = Layout;
  const { Title } = Typography;
  const router = useRouter();
  const { attachedFiles, eventDate, ...restReport } = report;

  const initialReport: ReportFormValues = {
    ...restReport,
    eventDate: moment(eventDate),
    attachedFiles: attachedFiles?.files
      ? attachedFiles.files.map(
          (o, i) =>
            ({
              url: `https://firebasestorage.googleapis.com/v0/b/check-before-transfer.appspot.com/o/files${encodeURIComponent(
                `/${o.dirName}/${o.name}`,
              )}?alt=media&token=${o.accessToken}`,
              size: o.size,
              name: o.name,
              response: o,
              uid: i.toString(),
              type: '',
              status: 'done',
            } as UploadFile),
        )
      : [],
  };

  const handleConfirm = useCallback(
    async (updatingReport: Report) => {
      try {
        await updateReport(updatingReport, token);
        notification.success({
          message: 'บันทึกข้อมูลเรียบร้อย',
        });
      } catch {
        notifyError();
      }
    },
    [token],
  );
  const handleStatusChange = useCallback(
    async (id: string, status: ReportStatus) => {
      if (!isAdmin) {
        return;
      }
      try {
        await updateReportStatus(id, status, token);
        router.push('/admin');
      } catch {
        notifyError();
      }
    },
    [isAdmin, router, token],
  );
  return (
    <>
      <Head>
        <title>เช็คคนโกง - รายงานการโกง {report.name}</title>
        <KeywordsAndDescription />
        <script type="text/javascript" src="/gtag.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="report-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">หน้าแรก</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {isAdmin ? <Link href="/admin">จัดการรายงาน</Link> : <Link href="/user/profile">ประวัติของคุณ</Link>}
              </Breadcrumb.Item>
              <Breadcrumb.Item>รายงาน</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={3} className="page-title">
              รายงานการโกง <Tag color={reportStatusColors[report.status]}>{reportStatusCaptions[report.status]}</Tag>
            </Title>
            <Card>
              <ReportFormContainer
                viewOnly={isAdmin || report.status === ReportStatus.Approved || report.status === ReportStatus.Rejected}
                onConfirm={handleConfirm}
                initialReport={initialReport}
                token={token}
                submitBtnText="บันทึกรายงาน"
                isReviewing={isAdmin}
                onStatusChange={handleStatusChange}
              />
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, params }) => {
  const reportId = params && typeof params.id === 'string' ? params.id : undefined;
  let report: Report | null = null;
  let token: string | null = null;
  if (reportId) {
    token = await AuthUser.getIdToken();
    if (token) {
      report = await getReportById(reportId, token);
    }
  }

  if (!report) {
    return {
      redirect: {
        destination: '/report',
        permanent: false,
      },
    };
  }

  return {
    props: {
      report,
      token,
      isAdmin: isAdminRole(token),
    },
  };
});

export default withAuthUser<ReportPageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ReportPage);
