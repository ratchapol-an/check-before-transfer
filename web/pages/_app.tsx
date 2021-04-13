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

const tagManagerArgs = {
  gtmId: 'GTM-WR83PLJ'
}
TagManager.initialize(tagManagerArgs)

initAuth();
moment.locale('th');
const auth = useAuthUser();

useEffect(() => {
  auth.getIdToken().then((token) => {
    if (!token) return;
    const decodedJWT = parseToken(token);
  });
}, [auth]);

function MyApp({ Component, pageProps }: AppProps) {
  <ScriptTag type="text/javascript">
window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
  'event': 'login',
  'userId': {auth.firebaseUser?.uid}
  })
  </ScriptTag>

  return (
    <ConfigProvider locale={thTH}>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
