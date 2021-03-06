import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import { useAuthUser } from 'next-firebase-auth';
import '../styles/antd.less';
import moment from 'moment';
import NextJsProgressBar from 'nextjs-progressbar';
import useGTM from '@elgorditosalsero/react-gtm-hook';

initAuth();
moment.locale('th');

function MyApp({ Component, pageProps }: AppProps) {
  const authUser = useAuthUser();

  const { init, UseGTMHookProvider } = useGTM();
  const gtmParams = {
    id: 'GTM-WR83PLJ',
    dataLayer: {
      userId: authUser.id,
      userEmail: authUser.email,
    },
  };

  useEffect(() => init(gtmParams), []);

  return (
    <ConfigProvider locale={thTH}>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={2} />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
