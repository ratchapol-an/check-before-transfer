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

  const { sendDataToGTM } = useGTM();
  const authUser = useAuthUser();
  useEffect(() =>
      sendDataToGTM({ 
        'userId': authUser.id, 
        'userEmail': authUser.email,
      })
  , []);

  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>
        <SEOTags />
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
