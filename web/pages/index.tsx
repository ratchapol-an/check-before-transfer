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
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WR83PLJ');</script>
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
