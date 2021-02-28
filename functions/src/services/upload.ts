/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Busboy from 'busboy';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { firebaseStorage } from './firebase';

interface FileRequest extends Request {
  files?: any;
  rawBody?: any;
}

export const filesUpload = async (req: FileRequest, res: Response): Promise<void> => {
  if (req.method !== 'POST') return res.status(405).end();
  const busboy = new Busboy({
    headers: req.headers,
    // limits: {
    //   fileSize: 10 * 1024 * 1024,
    // },
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
      console.log(files);

      Object.keys(files).forEach(async (k) => {
        const file = files[k];
        const fileRes = await firebaseStorage.upload(file, {
          gzip: true,
          destination: `files/${k}`,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });
        fs.unlinkSync(file);
        res.send(fileRes[0].publicUrl());
      });
    });
  });

  busboy.end(req.rawBody);
};

export default {};
