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
      {/* COMMON TAGS */}
      <meta charSet="utf-8" />
      <title>เช็คก่อนโอน - ลดโอกาสโดนโกงด้วยวิธีง่ายๆ มาเช็คที่นี่ก่อนสิ</title>
      {/* Search Engine */}
      <meta name="description" content="โอนเงินได้อย่างมั่นใจ ตัดรายได้มิจฉาชีพ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน" />
      <meta name="image" content="https://firebasestorage.googleapis.com/v0/b/whoscheat-e2261.appspot.com/o/pub%2FSEO-og-image%402x.png?alt=media" />
      {/* Schema.org for Google */}
      <meta itemProp="name" content="เช็คก่อนโอน - ลดโอกาสโดนโกงด้วยวิธีง่ายๆ มาเช็คที่นี่ก่อนสิ" />
      <meta itemProp="description" content="โอนเงินได้อย่างมั่นใจ ตัดรายได้มิจฉาชีพ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน" />
      <meta itemProp="image" content="https://firebasestorage.googleapis.com/v0/b/whoscheat-e2261.appspot.com/o/pub%2FSEO-og-image%402x.png?alt=media" />
      {/* Open Graph general (Facebook, Pinterest & LinkedIn) */}
      <meta property="og:title" content="เช็คก่อนโอน - ลดโอกาสโดนโกงด้วยวิธีง่ายๆ มาเช็คที่นี่ก่อนสิ" />
      <meta property="og:description" content="โอนเงินได้อย่างมั่นใจ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัย" />
      <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/whoscheat-e2261.appspot.com/o/pub%2FSEO-og-image%402x.png?alt=media" />
      <meta property="og:url" content="https://www.whoscheat.com" />
      <meta property="og:site_name" content="เช็คก่อนโอน" />
      <meta property="og:locale" content="th-TH" />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content="เช็คก่อนโอน - ลดโอกาสโดนโกงด้วยวิธีง่ายๆ มาเช็คที่นี่ก่อนสิ" />
      <meta property="twitter:description" content="โอนเงินได้อย่างมั่นใจ ตัดรายได้มิจฉาชีพ ร่วมสร้างสังคมซื้อขายออนไลน์ที่ปลอดภัยที่เช็คก่อนโอน" />
      <meta property="twitter:image:src" content="https://firebasestorage.googleapis.com/v0/b/whoscheat-e2261.appspot.com/o/pub%2FSEO-og-image%402x.png?alt=media" />
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
