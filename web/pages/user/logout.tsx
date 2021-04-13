import React, { FunctionComponent, useEffect, useState } from 'react';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';

const LogoutPage: FunctionComponent = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  useEffect(() => {
    authUser.signOut().then(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  }, [authUser, router]);
  return (
    <>
      <Head>
        <title>เช็คคนโกง</title>

        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default withAuthUser({})(LogoutPage);
