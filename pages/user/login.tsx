import { FunctionComponent, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import { withAuthUser, AuthAction, withAuthUserTokenSSR, useAuthUser } from 'next-firebase-auth';
import Head from 'next/head';
import { Layout, Row, Col } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { useRouter } from 'next/router';
import queryString from 'querystring';
import Title from 'antd/lib/typography/Title';
import 'firebase/auth';
import './login.less';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false,
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

interface FunctionComponentProps {
  currentPath: string;
}
const LoginPage: FunctionComponent<FunctionComponentProps> = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);
  const { Content } = Layout;
  const { query } = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true);
    }
  }, []);

  useEffect(() => {
    const currentQuery = { ...query };
    delete currentQuery.redirectURL;
    const search = currentQuery === undefined ? '' : queryString.stringify(currentQuery);

    uiConfig.signInSuccessUrl = `${
      (query.redirectURL as string) === '/' || (query.redirectURL as string) === undefined
        ? ''
        : (query.redirectURL as string)
    }/?${search}`;
  }, [query]);

  return (
    <>
      <Head>
        <title>เช็คก่อนโอน</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="home-page-layout layout-with-bg">
        <Header />
        <Content style={{ position: 'relative' }}>
          <Container>
            {renderAuth ? (
              <section className="login">
                <Row>
                  <Col xs={24} md={7} className="login-box">
                    <h2>เข้าสู่ระบบ</h2>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} className="login-option" />
                  </Col>
                </Row>
              </section>
            ) : null}
          </Container>
        </Content>
      </Layout>
    </>
  );
};
export const getServerSideProps = withAuthUserTokenSSR()(async () => {
  return {
    props: {
      currentPath: 'currentPath.email',
    },
  };
});

export default withAuthUser<FunctionComponentProps>({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage);
