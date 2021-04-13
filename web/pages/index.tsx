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
        <KeywordsAndDescription />
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="/gtaghead.js" />
      </Head>
      <script type="text/javascript" src="/gtagbody.js" />
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
