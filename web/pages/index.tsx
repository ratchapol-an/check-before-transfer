import Head from 'next/head';
import { Layout } from 'antd';
import React, { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import Hero from '@components/Hero';
import { withAuthUser } from 'next-firebase-auth';
import './index.less';
import { KeywordsAndDescription } from '@components/Seo';

export const Home: FunctionComponent = () => {
  const { Content, Footer } = Layout;
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
