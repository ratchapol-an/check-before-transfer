import Head from 'next/head';
import { Layout } from 'antd';
import { FunctionComponent, useEffect } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import Hero from '@components/Hero';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { parseToken } from '../utils';
import './index.less';

export const Home: FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const AuthUser = useAuthUser();

  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="home-page-layout layout-with-bg">
        <Header auth={AuthUser} />
        <Content>
          <Container>
            <Hero className="home-hero" />
          </Container>
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser }) => {
  // const token = await AuthUser.getIdToken();
  const role = {
    admin: false,
    user: false,
  };
  AuthUser.getIdToken().then((token) => {
    console.log(token);
    if (token) {
      const decodedJWT = parseToken(token);
      console.log(decodedJWT);
      console.log(decodedJWT.superUser);
      console.log(decodedJWT.admin);

      if (decodedJWT.superUser === true || decodedJWT.admin === true) role.admin = true;
      if (decodedJWT.superUser === undefined && decodedJWT.admin === undefined) role.user = true;
    }
  });
  return {
    props: {},
  };
});

export default withAuthUser()(Home);
