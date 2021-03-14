/* eslint-disable import/prefer-default-export */
import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import { firebaseFunction } from './services/firebase';
import { createAdmin, getAdminInfo } from './services/admin';
import { filesUpload, deleteFile } from './services/upload';
import 'dayjs/locale/th';

dayjs.locale('th');
// const DATE_FORMAT = 'DD-MM-YYYY HH:mm';

const app = express();

const defaultCors = cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-report-session'],
});

// Automatically allow cross-origin requests
app.use(defaultCors);

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.post('/admin/create', createAdmin);
app.get('/admin/:id', getAdminInfo);
app.post('/file/upload', filesUpload);
app.delete('/file', deleteFile);

// Expose Express API as a single Cloud Function:
exports.api = firebaseFunction.https.onRequest(app);
