import { init } from 'next-firebase-auth';
import { NextApiRequest } from 'next';

const initAuth = () => {
  init({
    authPageURL: '/user/login',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login',
    logoutAPIEndpoint: '/api/logout',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'whoscheat-e2261',
        clientEmail: 'firebase-adminsdk-d9ngl@whoscheat-e2261.iam.gserviceaccount.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      },
      databaseURL: 'https://whoscheat-e2261.firebaseio.com',
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: 'whoscheat-e2261.firebaseapp.com',
      projectId: 'whoscheat-e2261',
    },
    cookies: {
      name: 'whoscheat',
      keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_APP_STAGE === 'production' || false, // set this to false in local (non-HTTPS) development
      signed: true,
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
