import Head from 'next/head';
import { Card, Divider, Layout, Typography, Modal } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportFormContainer, ReportFormValues } from '@components/Report';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { getReportById, updateReport } from 'services/reportingService';
import Report, { UploadedFile } from '@models/Report';
import { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import { useCallback } from 'react';

interface ReportPageProps {
  report: Report;
  token: string;
}
const ReportPage: React.FunctionComponent<ReportPageProps> = ({ token, report }) => {
  const { Content } = Layout;
  const { Title } = Typography;

  const { attachedFiles, eventDate, ...restReport } = report;
  const initialReport: ReportFormValues = {
    ...restReport,
    eventDate: moment(eventDate),
    attachedFiles: attachedFiles
      ? attachedFiles.map(
          (o, i) =>
            ({ url: o.url, size: o.size, name: o.name, response: o, uid: i.toString(), type: '' } as UploadFile),
        )
      : [],
  };

  const handleConfirm = useCallback(
    async (updatingReport: Report) => {
      await updateReport(updatingReport, token);
    },
    [token],
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
              <ReportFormContainer onConfirm={handleConfirm} initialReport={initialReport} token={token} />
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, params, res }) => {
  console.log(params);
  const reportId = params && params.id ? params.id[0] : undefined;
  let report: Report | null = null;
  let token: string | null = null;
  if (reportId) {
    token = await AuthUser.getIdToken();
    if (token) {
      report = await getReportById(reportId, token);
    }
  }

  if (!report) {
    res.writeHead(302, { Location: '/report' });
  }

  return {
    props: {
      report,
      token,
    },
  };
});

export default withAuthUser<ReportPageProps>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ReportPage);
