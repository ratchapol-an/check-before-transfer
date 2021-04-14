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
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';

initAuth();
moment.locale('th');

function MyApp({ Component, pageProps }: AppProps) {

  const { init, UseGTMHookProvider } = useGTM();
  const gtmParams = {
    id: 'GTM-WR83PLJ',
    dataLayer: {'event':'','userId':''}
  };

  useEffect(() => init(gtmParams), []);

  return (
    <ConfigProvider locale={thTH}>
      <UseGTMHookProvider>
        <MetaTags>
        <meta name="description"
          content="เช็คคนโกง ก่อนการโอนเงิน จากเลขบัญชีธนาคาร หรือ เบอร์โทรศัพท์มือถือ หรือ เลขประจำตัวประชาชน หรือ ชื่อ-นามสกุล"
        />
        <meta
          name="keywords"
          content="โอนเงิน,ทรูมันนี่,พร้อมเพย์,truemoney,truemoney wallet,เช็คแม่ค้า,โกงเงิน,เช็คประวัติ,ประวัติคนขาย,เช็คพ่อค้า,คนโกง,เว็บโกง,ร้านโกง,เช็คโกง,กู้เงิน"
        />
      </MetaTags>
      </UseGTMHookProvider>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;