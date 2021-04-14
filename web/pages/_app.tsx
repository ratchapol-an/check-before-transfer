import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import '../styles/antd.less';
import moment from 'moment';
import NextJsProgressBar from 'nextjs-progressbar';
import { useAuthUser } from 'next-firebase-auth';
import { parseToken } from 'utils';
import useGTM from '@elgorditosalsero/react-gtm-hook';
import MetaTags from 'react-meta-tags';

initAuth();
moment.locale('th');

function MyApp({ Component, pageProps }: AppProps) {
  const authUser = useAuthUser();

  useEffect(() => {
    authUser.getIdToken().then((token) => {
      if (!token) return;
      const decodedJWT = parseToken(token);
    });
  }, [authUser]);
  

  const { init, UseGTMHookProvider } = useGTM()
  const gtmParams = {
    id: 'GTM-WR83PLJ',
    dataLayer: {
      'event': 'loggedin',
      'userId': authUser.email
    }
  }

  useEffect(() => init(gtmParams), [])

  return (
    <ConfigProvider locale={thTH}>
      <UseGTMHookProvider><p>{authUser.email}</p>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      </UseGTMHookProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
