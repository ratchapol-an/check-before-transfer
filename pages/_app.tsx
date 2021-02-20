import type { AppProps } from 'next/app';
import initAuth from '../services/firebaseService';
import '../styles/antd.less';

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
