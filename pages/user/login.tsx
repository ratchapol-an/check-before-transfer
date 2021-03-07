import { FunctionComponent, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import { withAuthUser, AuthAction, withAuthUserTokenSSR, useAuthUser } from 'next-firebase-auth';
import Head from 'next/head';
import Image from 'next/image';
import { Layout, Row, Col, Space, Card } from 'antd';
import Header from '@components/Header';
import Container from '@components/Container';
import { useRouter } from 'next/router';
import queryString from 'querystring';
import Title from 'antd/lib/typography/Title';
import 'firebase/auth';
import './login.less';

// Configure FirebaseUI.
const uiConfig: firebaseui.auth.Config = {
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
  callbacks: {
    signInSuccessWithAuthResult(authResult) {
      if (authResult.additionalUserInfo.isNewUser) {
        authResult.user.sendEmailVerification();
      }
      return true;
    },
  },
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
      <Layout className="layout-with-bg bg-main">
        <Content className="login-container">
          {renderAuth ? (
            <>
              <Image width={140} height={31.96} alt="whoscheat" src="/logo3.png" />
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} className="login-option" />
            </>
          ) : null}
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
