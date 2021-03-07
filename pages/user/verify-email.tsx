import Head from 'next/head';
import { Button, Layout, Result } from 'antd';
import { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import { withAuthUserTokenSSR, withAuthUser, useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';

export const VerifyEmailPage: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const router = useRouter();
  const authUser = useAuthUser();
  const handleBackToHomeBtnClick = () => {
    router.push('/');
  };
  const handleSendEmailBtnClick = () => {
    authUser.firebaseUser?.sendEmailVerification();
  };
  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="thank-you-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            <Result
              status="warning"
              title="คุณยังไม่ได้ยืนอีเมล์"
              subTitle="กรุณาเช็คอีเมล์ของท่าน และกดยืนยันอีเมล์ของท่าน หากไม่พบอีเมล์ กรุณากดส่งอีเมล์อีกครั้ง"
              extra={[
                <Button type="primary" key="send" onClick={handleSendEmailBtnClick}>
                  ส่งอีเมล์ยืนยันอีกครั้ง
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
  if (!AuthUser.emailVerified) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
});

export default withAuthUser()(VerifyEmailPage);
