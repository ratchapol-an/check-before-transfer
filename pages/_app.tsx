import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import thTH from 'antd/lib/locale/th_TH';
import initAuth from 'services/firebaseService';
import '../styles/antd.less';

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={thTH}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
