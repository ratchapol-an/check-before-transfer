/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Busboy from 'busboy';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { firebaseStorage } from './firebase';
import { getAuthorizationToken, validateToken } from './admin';
import { UploadedFile } from '../types';

interface FileRequest extends Request {
  files?: any;
  rawBody?: any;
}

export const filesUpload = async (req: FileRequest, res: Response): Promise<void> => {
  if (req.method !== 'POST') return res.status(405).end();

  if (!req.headers['x-report-session']) return res.status(404).end();
  const reportSession = req.headers['x-report-session'];

  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  const fields: any = {};
  const files: any = {};
  const fileWrites: any = [];
  // Note: os.tmpdir() points to an in-memory file system on GCF
  // Thus, any files in it must fit in the instance's memory.
  const tmpdir = os.tmpdir();

  busboy.on('field', (key, value) => {
    fields[key] = value;
  });

  busboy.on('file', (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);

    const filepath = path.join(tmpdir, filename);
    files[filename] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written to disk.
    const promise = new Promise((resolve, reject) => {
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });

  busboy.on('finish', () => {
    Promise.all(fileWrites).then(() => {
      Object.keys(files).forEach(async (k) => {
        const file = files[k];
        const token = uuidv4();
        const fileRes = await firebaseStorage.upload(file, {
          gzip: true,
          destination: `files/${reportSession as string}/${k}`,
          metadata: {
            cacheControl: 'public, max-age=31536000',
            metadata: {
              firebaseStorageDownloadTokens: token,
            },
          },
        });
        fs.unlinkSync(file);
        const imgMeta = fileRes[0].metadata;
        console.log('file', fileRes[0].metadata);

        const resp: UploadedFile = {
          name: k,
          dirName: reportSession as string,
          size: imgMeta.size,
          accessToken: token,
          url: imgMeta.name,
          // url: `https://firebasestorage.googleapis.com/v0/b/${imgMeta.bucket}/o/${encodeURIComponent(
          //   imgMeta.name,
          // )}?alt=media&token=${token}`,
        };
        res.send(resp);
      });
    });
  });

  busboy.end(req.rawBody);
};

export const deleteFile = async (req: Request, res: Response): Promise<Response<any>> => {
  if (req.method !== 'DELETE') return res.status(403).send('Forbidden!');

  const idToken = getAuthorizationToken(req);
  if (idToken === '') return res.status(401).send('Unauthorized');

  const token = await validateToken(idToken);
  if (!token) return res.status(401).send('Unauthorized');

  const { dirName, fileName } = req.body;
  if (!dirName) return res.status(404).send('Bad Request');

  try {
    await firebaseStorage.deleteFiles({
      prefix: `files/${dirName as string}/${fileName}`,
    });
    return res.status(200).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export const ping = async (req: Request, res: Response): Promise<Response<any>> => {
  return res.status(200).send('pong');
};

export default {};
