import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LogoutPage = () => {
  const authUser = useAuthUser();
  const router = useRouter();
  useEffect(() => {
    authUser.signOut().then(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  }, [authUser, router]);
  return <span>Please Wait...</span>;
};

export default withAuthUser({})(LogoutPage);
