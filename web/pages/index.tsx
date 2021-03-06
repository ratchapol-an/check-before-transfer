import Head from 'next/head';
import { Layout } from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import Hero from '@components/Hero';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import './index.less';

export const Home: FunctionComponent = () => {
  const { Content, Footer } = Layout;

  return (
    <>
      <Head>
      {/* COMMON TAGS */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <title>เช็คก่อนโอน - ตรวจสอบคนโกง บัญชีอันตรายให้ชัวร์ก่อนโอนเงิน</title>
      {/* Search Engine */}
      <meta name="description" content="โอนเงินได้อย่างมั่นใจ ตัดรายได้มิจฉาชีพ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน" />
      <meta name="image" content="https://www.whoscheat.com/เช็คคนโกงจากบัญชี.png"/>
      {/* Schema.org for Google */}
      <meta itemProp="name" content="เช็คก่อนโอน - ตรวจสอบคนโกง บัญชีอันตรายให้ชัวร์ก่อนโอนเงิน" />
      <meta itemProp="description" content="ตรวจสอบคนโกงด้วย ชื่อ เลขบัญชีธนาคาร เบอร์โทร บัตรประชาชน ทรูวอลเล็ต" />
      <meta itemProp="image" content="https://www.whoscheat.com/เช็คคนโกงจากบัญชี.png" />
      {/* Open Graph general (Facebook, Pinterest & LinkedIn) */}
      <meta property="og:title" content="เช็คก่อนโอน - ตรวจสอบคนโกง บัญชีอันตรายให้ชัวร์ก่อนโอนเงิน" />
      <meta property="og:description" content="โอนเงินได้อย่างมั่นใจ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัย" />
      <meta property="og:image" content="https://www.whoscheat.com/เช็คคนโกงจากบัญชี.png" />
      <meta property="og:url" content="https://www.whoscheat.com" />
      <meta property="og:site_name" content="เช็คก่อนโอน - ตรวจสอบคนโกง บัญชีอันตรายให้ชัวร์ก่อนโอนเงิน" />
      <meta property="og:locale" content="th-TH" />
      <meta property="og:type" content="website" />
      <meta property="fb:app_id" content="314459616702586" />
      {/* Twitter */}
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content="เช็คก่อนโอน - ตรวจสอบคนโกง บัญชีอันตรายให้ชัวร์ก่อนโอนเงิน" />
      <meta property="twitter:description" content="โอนเงินได้อย่างมั่นใจ ตัดรายได้มิจฉาชีพ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน" />
      <meta property="twitter:image:src" content="https://www.whoscheat.com/เช็คคนโกงจากบัญชี.png" />
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
