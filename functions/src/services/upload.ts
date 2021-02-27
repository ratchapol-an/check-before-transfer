/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

export const filesUpload = async (req: Request, res: Response): Promise<Response<any>> => {
  return res.status(200).send({});
};

export default {};
