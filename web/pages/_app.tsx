import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import '../styles/antd.less';
import moment from 'moment';
import NextJsProgressBar from 'nextjs-progressbar';
import useGTM from '@elgorditosalsero/react-gtm-hook';

initAuth();
moment.locale('th');

function MyApp({ Component, pageProps }: AppProps) {

  const { init, UseGTMHookProvider } = useGTM();
  useEffect(() => init({ id: 'GTM-WR83PLJ' }), []);

  return (
    <ConfigProvider locale={thTH}>
      <UseGTMHookProvider>
        <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      </UseGTMHookProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;