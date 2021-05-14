import Head from 'next/head';
import { Button, Layout, Result, Space } from 'antd';
import React, { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import { withAuthUserTokenSSR, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import './thankyou.less';
import SEOTags from '@components/SEO';

export const ThankYouPage: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const router = useRouter();
  const handleBackToHomeBtnClick = () => {
    router.push('/');
  };
  const handleGoToProfileBtnClick = () => {
    router.push('/user/profile');
  };
  return (
    <>
      <Head>
      <meta name="title" 
          content="โดนโกงอีกแล้วทำยังไงดี มาเชคที่นี่ก่อนโอนสิ ลดโอกาสโดนโกงง่ายๆ | whoscheat.com"
        />
        <meta name="description"
          content=" เช็คก่อนโอนช่วยให้การโอนทุกครั้งมั่นใจขึ้น ลดโอกาสในการเอาเปรียบของมิจฉาชีพ ร่วมกันสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน"
        />
        <meta
          name="keywords"
          content="โอนเงิน,ทรูมันนี่,พร้อมเพย์,truemoney,truemoney wallet,เช็คแม่ค้า,โกงเงิน,เช็คประวัติ,ประวัติคนขาย,เช็คพ่อค้า,คนโกง,เว็บโกง,ร้านโกง,เช็คโกง,กู้เงิน"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="thank-you-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container>
            <Space direction="vertical" size="large">
              <Result
                status="success"
                title="ขอบคุณ! ท่านได้มีส่วนสำคัญในการทำให้มิจชาชีพ ไม่มีที่ยืนในสังคมไทย"
                subTitle="หากท่านต้องการแก้ไข หรือต้องการส่งหลักฐานเพิ่มเติม สามารถทำได้ที่หน้าสมาชิก ระบบจะตรวจสอบ และแสดงผลทันทีที่รายงานของท่านได้รับการอนุมัติ"
                extra={[
                  <Button type="primary" key="member" onClick={handleGoToProfileBtnClick}>
                    ไปยังหน้าสมาชิก
                  </Button>,
                  <Button key="home" onClick={handleBackToHomeBtnClick}>
                    กลับไปยังหน้าแรก
                  </Button>,
                ]}
              />
              {/* <a href="/" target="blank">
                <div className="ads ads-lb" />
              </a>
              <a href="/" target="blank">
                <div className="ads ads-mobile" />
              </a> */}
            </Space>
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
