import Head from 'next/head';
import { Layout } from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import Hero from '@components/Hero';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import './index.less';
import useGTM from '@elgorditosalsero/react-gtm-hook';
import SEOTags from '@components/SEO';

export const Home: FunctionComponent = () => {
  const { Content, Footer } = Layout;

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
      <Layout className="home-page-layout layout-with-bg bg-main">
        <Header />
        <Content>
          <Container>
            <Hero className="home-hero" />
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export default withAuthUser()(Home);
