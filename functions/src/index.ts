/* eslint-disable import/prefer-default-export */
import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { firebaseFunction } from './services/firebase';
import { getReport, updateReport, verify, addReport, getReports, deleteReport } from './services/reports';
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
app.post('/report/add', addReport);
app.put('/report/updatet', updateReport);
app.put('/report/verify', verify);
app.get('/report/get', getReport);
app.post('/admin/create', createAdmin);
app.get('/admin/:id', getAdminInfo);
app.get('/report/list', getReports);
app.delete('/report', deleteReport);

// Expose Express API as a single Cloud Function:
exports.api = firebaseFunction.https.onRequest(app);
