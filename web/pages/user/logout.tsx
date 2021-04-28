import React, { FunctionComponent, useEffect, useState } from 'react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Layout } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';

const LogoutPage: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const authUser = useAuthUser();
  const router = useRouter();
  useEffect(() => {
    authUser.signOut().then(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  }, [authUser, router]);
  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>

        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="profile-page-layout layout-with-bg">
        <Header />
        <Content>
          <Container />
        </Content>
      </Layout>
    </>
  );
};

export default withAuthUser({})(LogoutPage);
