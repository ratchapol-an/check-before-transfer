import Head from 'next/head';
import { Button } from 'antd';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Button type="primary">Primary Button</Button>
      </main>

      <footer>Footer</footer>
    </div>
  );
}
