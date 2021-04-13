import Head from 'next/head';
import { Card, Layout, Typography, Breadcrumb, notification } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { ReportFormContainer } from '@components/Report';
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import Report from '@models/Report';
import { addReport } from 'services/reportingService';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Link from 'next/link';
import { KeywordsAndDescription } from '@components/Seo';

interface ReportPageProps {
  token: string;
}
const ReportPage: React.FunctionComponent<ReportPageProps> = ({ token }) => {
  const { Content } = Layout;
  const { Title } = Typography;
  const router = useRouter();
  const handleConfirm = useCallback(
    async (report: Report) => {
      try {
        await addReport(report, token);
        router.push('/thankyou');
      } catch {
        notification.error({
          message: 'เพิ่มรายงานไม่สำเร็จ',
          description: 'ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        });
      }
    },
    [router, token],
  );
  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>
        <meta
          name="description"
          content="เช็คคนโกง ก่อนการโอนเงิน จากเลขบัญชีธนาคาร หรือ เบอร์โทรศัพท์มือถือ หรือ เลขประจำตัวประชาชน หรือ ชื่อ-นามสกุล"
        />
        <meta
          name="keywords"
          content="โอนเงิน,ทรูมันนี่,พร้อมเพย์,truemoney,truemoney wallet,เช็คแม่ค้า,โกงเงิน,เช็คประวัติ,ประวัติคนขาย,เช็คพ่อค้า,คนโกง,เว็บโกง,ร้านโกง,เช็คโกง,กู้เงิน"
        />
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
                <Link href="/user/profile">ประวัติของคุณ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>รายงาน</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={3} className="page-title">
              เพิ่มรายงานการโกง
            </Title>
            <Card>
              <ReportFormContainer onConfirm={handleConfirm} token={token} submitBtnText="ส่งรายงาน" />
            </Card>
          </Container>
        </Content>
      </Layout>
    </>
  );
};
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: `/user/login?signInSuccessUrl=${encodeURIComponent('/report')}`,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();

  return {
    props: {
      token,
    },
  };
});

export default withAuthUser<ReportPageProps>({
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: `/user/login?signInSuccessUrl=${encodeURIComponent('/report')}`,
})(ReportPage);
