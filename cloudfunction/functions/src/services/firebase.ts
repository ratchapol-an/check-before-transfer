import * as functions from 'firebase-functions';
import admin, { auth, ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'check-before-transfer.appspot.com',
});

export const firebaseFunction = functions.region('asia-southeast2');
export const db = admin.firestore();
export const firebaseStorage = admin.storage().bucket();

db.settings({ ignoreUndefinedProperties: true });
export const firebaseAdmin = admin;

export type AuthVerifyToken = auth.DecodedIdToken;

export default {};
