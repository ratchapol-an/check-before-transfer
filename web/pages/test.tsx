import { AuthAction, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';

const TestPage = ({ email }: any) => {
  console.log('test');
  return <div>{email}</div>;
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser }) => {
  return {
    props: {
      email: AuthUser.email,
    },
  };
});

// export default withAuthUser({
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(TestPage);

export default TestPage;
