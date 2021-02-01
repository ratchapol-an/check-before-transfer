/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();
const firebaseFunction = functions.region('asia-southeast2');

export const helloWorld = firebaseFunction.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const addMessage = firebaseFunction.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin.firestore().collection('messages').add({ original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});
// export default {};
