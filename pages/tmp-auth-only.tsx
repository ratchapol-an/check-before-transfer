import { withAuthUser, useAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import Header from '@components/Header';

const Demo = () => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <Header auth={AuthUser} />
      Test
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // Optionally, get other props.
  const token = await AuthUser.getIdToken();

  return {
    props: {},
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Demo);
