import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const firebaseFunction = functions.region('asia-southeast2');
export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
export const firebaseAdmin = admin;

export default {};
