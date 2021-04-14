import React, { FunctionComponent, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import { withAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';
import Head from 'next/head';
import Image from 'next/image';
import { Layout } from 'antd';
import 'firebase/auth';
import './login.less';
import Link from 'next/link';
import useGTM from '@elgorditosalsero/react-gtm-hook';
import SEOTags from '@components/SEO';

type LoginPageProps = { token: string; email: string };

const LoginPage: FunctionComponent<LoginPageProps>  = ({ token, email }) => {

  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);
  const { Content } = Layout;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderAuth(true);
    }
  }, []);

  const { sendDataToGTM } = useGTM();

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: firebase.auth().isSignInWithEmailLink(window.location.href) ? 'redirect' : 'popup',
    // signInSuccessUrl: '/',
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
      signInSuccessWithAuthResult(authResult, redirectUrl) {
        const currentAuth = firebase.auth();
        sendDataToGTM({ 
          'event': 'logged_in', 
          'userId': currentAuth.currentUser.uid, 
          'userEmail': currentAuth.currentUser.email,
          'userDisplayName': currentAuth.currentUser.displayName,
          'userPhotoURL': currentAuth.currentUser.photoURL,
        });
        setTimeout(() => {
          window.location.href = `${
            process.env.NEXT_PUBLIC_APP_STAGE === 'production'
              ? process.env.NEXT_PUBLIC_HOST_URL
              : 'http://localhost:3000'
          }${redirectUrl || '/'}`;
          return false;
        }, 1500);
        return false;
      },
    },
  };

  // const { init, UseGTMHookProvider } = useGTM();
  // const gtmParams = {
  //   id: 'GTM-WR83PLJ',
  //   dataLayer: { 'event': 'loggedin', 'userId': '' }
  // };
  // useEffect(() => init(gtmParams), []);

  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>
        <SEOTags />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="layout-with-bg bg-main">
        <Content className="login-container">
          {renderAuth ? (
            <>
              <Link href="/">
                <a className="header-logo-link" target="_self">
                  <Image width={140} height={31.96} alt="whoscheat" src="/logo3.png" />
                </a>
              </Link>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} className="login-option" />
            </>
          ) : null}
        </Content>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken();
  return {
    props: {
      token,
      email: AuthUser.email,
    },
  };
});

export default withAuthUser<LoginPageProps>({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(LoginPage);
