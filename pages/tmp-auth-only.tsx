import { withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import Header from '@components/Header';

const Demo = () => {
  return (
    <div>
      <Header />
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
