import React from 'react';

import { withAuthUser, AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth';

const DemoPage: React.FunctionComponent<{ thing: string }> = ({ thing }) => <div>The thing is: {thing}</div>;

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  // Optionally, get other props.
  const token = await AuthUser.getIdToken();
  // const response = await fetch('/api/my-endpoint', {
  //   method: 'GET',
  //   headers: {
  //     Authorization: token,
  //   },
  // });
  // const data = await response.json();
  return {
    props: {
      thing: token,
    },
  };
});

export default withAuthUser<{ thing: string }>({ whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN })(DemoPage);
