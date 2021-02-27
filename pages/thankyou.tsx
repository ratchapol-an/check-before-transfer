import Head from 'next/head';
import { Button, Layout, Result } from 'antd';
import { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import { useAuthUser, withAuthUserTokenSSR, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';

export const ThankYouPage: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const AuthUser = useAuthUser();
  const router = useRouter();
  const handleBackToHomeBtnClick = () => {
    router.push('/');
  };
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="thank-you-page-layout layout-with-bg">
        <Header auth={AuthUser} />
        <Content>
          <Container>
            <Result
              status="success"
              title="ขอบคุณ! ท่านได้มีส่วนสำคัญในการทำให้มิจชาชีพ ไม่มีที่ยืนในสังคมไทย"
              subTitle="หากท่านต้องการแก้ไข หรือต้องการส่งหลักฐานเพิ่มเติม สามารถทำได้ที่หน้าสมาชิก ระบบจะตรวจสอบ และแสดงผลทันทีที่รายงานของท่านได้รับการอนุมัติ"
              extra={[
                <Button type="primary" key="member">
                  ไปยังหน้าสมาชิก
                </Button>,
                <Button key="home" onClick={handleBackToHomeBtnClick}>
                  กลับไปยังหน้าแรก
                </Button>,
              ]}
            />
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser }) => {
  return {
    props: {
      email: AuthUser.email,
    },
  };
});

export default withAuthUser()(ThankYouPage);
