/* eslint-disable import/prefer-default-export */
import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { firebaseFunction } from './services/firebase';
import { getReport, updateReport, verify, addReport } from './services/reports';
import { createAdmin, getAdminInfo } from './services/admin';
import 'dayjs/locale/th';

dayjs.locale('th');
// const DATE_FORMAT = 'DD-MM-YYYY HH:mm';

const app = express();

const defaultCors = cors({ origin: true });
// Automatically allow cross-origin requests
app.use(defaultCors);

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.post('/addReport', addReport);
app.put('/updateReport', updateReport);
app.put('/verify', verify);
app.get('/getReport', getReport);
app.post('/admin/create', createAdmin);
app.get('/admin/:id', getAdminInfo);

// Expose Express API as a single Cloud Function:
exports.api = firebaseFunction.https.onRequest(app);
