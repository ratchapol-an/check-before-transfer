import * as functions from 'firebase-functions';
import admin, { auth } from 'firebase-admin';

admin.initializeApp();

export const firebaseFunction = functions.region('asia-southeast2');
export const db = admin.firestore();
export const firebaseStorage = admin.storage().bucket('files');

db.settings({ ignoreUndefinedProperties: true });
export const firebaseAdmin = admin;

export type AuthVerifyToken = auth.DecodedIdToken;

export default {};
