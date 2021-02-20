import Report, { mockReport } from 'models/Report';
import SearchBy from 'models/searchBy';
import axios from 'axios';

// HOW TO RUN LOCAL (Node 12 Only)
// - cd function
// - nvm use 12
// - yarn build & yarn serve

axios.defaults.baseURL = 'http://localhost:5001/check-before-transfer/asia-southeast2/api';
// PROD URL
// https://asia-southeast2-check-before-transfer.cloudfunctions.net
export interface SearchResult {
  name: string;
  totalReport: number;
  totalDamagedPrice: number;
  lastedReport: Report;
}
export const search = async (value: string, by: SearchBy): Promise<SearchResult> => {
  const { data } = await axios.get<SearchResult>('/getReport', {
    params: {
      q: value,
      by,
    },
    timeout: 1000,
  });
  console.log(data);
  return data;
};

export const addReport = (report: Report) => {
  axios
    .post<{ report_id: string }>('/addReport', {
      body: report,
    })
    .then(({ data }) => {
      console.log(data.report_id);
      // return data.report_id;
    })
    .catch((e) => {
      console.log(e);
    });
};

interface UpdateReportReq {
  report_id: string;
  reporter_id: string;
  report: Report;
}

export const updateReport = (req: UpdateReportReq) => {
  axios
    .put<{ report_id: string }>('/updateReport', {
      body: req,
    })
    .then(({ data }) => {
      return data.report_id;
    })
    .catch((e) => {
      console.log(e);
    });
};

interface VerifyReportReq {
  report_id: string;
  reporter_id: string;
  status: number;
}

export const verifyReport = (req: VerifyReportReq) => {
  axios
    .put<{ report_id: string }>('/verify', {
      body: req,
    })
    .then(({ data }) => {
      console.log(data.report_id);
    })
    .catch((e) => {
      console.log(e);
    });
};
