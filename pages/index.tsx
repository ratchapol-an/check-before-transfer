import Head from 'next/head';
import { Layout } from 'antd';
import { FunctionComponent } from 'react';
import Header from '@components/Header';
import Container from '@components/Container';
import Hero from '@components/Hero';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import './index.less';

interface HomeProps {
  email: string;
}
export const Home: FunctionComponent<HomeProps> = ({ email }) => {
  const { Content, Footer } = Layout;
  const AuthUser = useAuthUser();

  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="home-page-layout">
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
  return {
    props: {
      email: AuthUser.email,
    },
  };
});

export default withAuthUser<HomeProps>()(Home);
