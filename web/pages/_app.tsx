import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import '../styles/antd.less';
import moment from 'moment';
import NextJsProgressBar from 'nextjs-progressbar';

initAuth();
moment.locale('th');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={thTH}>
      <NextJsProgressBar color="#00589b" startPosition={0.3} stopDelayMs={200} height={1} />
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
