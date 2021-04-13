import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import '../styles/antd.less';
import moment from 'moment';
import NextJsProgressBar from 'nextjs-progressbar';
import TagManager from 'react-gtm-module';
import ScriptTag from 'react-script-tag';
import { useAuthUser } from 'next-firebase-auth';
import { parseToken } from 'utils';

initAuth();
moment.locale('th');

const tagManagerArgs = {
  gtmId: 'GTM-WR83PLJ',
};
if (process.browser) {
  TagManager.initialize(tagManagerArgs);
}

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuthUser();

  useEffect(() => {
    auth.getIdToken().then((token) => {
      if (!token) return;
      const decodedJWT = parseToken(token);
    });
  }, [auth]);

  <ScriptTag type="text/javascript" src="gtag.js" />;

  return (
    <ConfigProvider locale={thTH}>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
