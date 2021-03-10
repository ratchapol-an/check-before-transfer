import { init } from 'next-firebase-auth';
import { NextApiRequest } from 'next';

const initAuth = () => {
  init({
    authPageURL: '/user/login',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'check-before-transfer',
        clientEmail: 'firebase-adminsdk-1jj8q@check-before-transfer.iam.gserviceaccount.com',
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      },
      databaseURL: 'https://check-before-transfer.firebaseio.com',
    },
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyD50gRAhUkGsWfX41UE_OH1wr3SMbRCTcM', // required
      authDomain: 'check-before-transfer.firebaseapp.com',
      // databaseURL: 'https://my-example-app.firebaseio.com',
      projectId: 'check-before-transfer',
    },
    cookies: {
      name: 'checkBeforeTransfer', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_APP_STAGE === 'production' || false, // set this to false in local (non-HTTPS) development
      signed: true,
      domain: 'localhost',
    },
  });
};

export const getAuthorizationToken = (req: NextApiRequest): string => {
  const { authorization } = req.headers;
  if (!authorization) return '';

  const split = authorization.split('Bearer ');
  return split[1];
};

export default initAuth;
