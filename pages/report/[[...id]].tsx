import Head from 'next/head';
import { Card, Divider, Layout, Typography, Modal } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportForm, ReportFormValues } from '@components/Report';

import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { addReport, getReportById } from 'services/reportingService';
import React, { useCallback, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Report from '@models/Report';

interface ReportPageProps {
  report?: Report;
  token?: string;
}
const ReportPage: React.FunctionComponent<ReportPageProps> = ({ token, report }) => {
  const { Content } = Layout;
  const { Title } = Typography;
  const router = useRouter();

  useEffect(() => {
    if (report == null) router.push('/');
  }, [router, report]);

  const handleFormFinish = useCallback(
    async (values: ReportFormValues) => {
      const { confirm, error } = Modal;

      if (!token) {
        error({
          title: 'Something went wrong.',
          content: 'Please try again.',
        });
        return;
      }

      confirm({
        title: 'รู้ก่อนส่ง',
        icon: <ExclamationCircleOutlined />,
        content:
          'ประมวลกฎหมายอาญา กำหนดความผิดฐานหมิ่นประมาทไว้ใน มาตรา 326 โดยมีมาตรา 328 เป็นบทเพิ่มโทษบัญญัติไว้ว่า "มาตรา 326 ผู้ใดใส่ความผู้อื่นต่อบุคคลที่สาม โดยประการที่น่าจะทำให้ผู้อื่นนั้นเสียชื่อเสียง ถูกดูหมิ่น หรือถูกเกลียดชัง ผู้นั้นกระทำความผิดฐานหมิ่นประมาท ต้องระวางโทษจำคุกไม่เกินหนึ่งปี หรือปรับไม่เกินสองหมื่นบาท หรือทั้งจำทั้งปรับ"',
        async onOk() {
          const rawReport = { ...values };
          const newAttachedFiles = rawReport.attachedFiles.map((f) => f.response);
          const newReport: Report = { ...rawReport, attachedFiles: newAttachedFiles };
          await addReport(newReport, token);
          router.push('/thankyou');
        },
        onCancel() {},
        okText: 'ยืนยันรายงาน',
        cancelText: 'ยกเลิก',
      });
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
              <ReportForm onFinish={handleFormFinish} userToken={token} />
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
  console.log('report', report);

  return {
    props: {
      report,
      token,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ReportPage);
