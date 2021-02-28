import Report from 'models/Report';
import SearchBy from 'models/searchBy';
import axios from 'axios';
import { PaginationConfig } from 'antd/lib/pagination';
import ReportStatus from '@models/ReportStatus';

// HOW TO RUN LOCAL (Node 12 Only)
// - cd function
// - nvm use 12
// - yarn build & yarn serve
const API_HOST =
  process.env.NODE_ENV === 'production'
    ? 'https://asia-southeast2-check-before-transfer.cloudfunctions.net'
    : 'http://localhost:5001';
axios.defaults.baseURL = `${API_HOST}/check-before-transfer/asia-southeast2/api`;

// PROD URL
// https://asia-southeast2-check-before-transfer.cloudfunctions.net

export const apiUploadFile = `${API_HOST}/check-before-transfer/asia-southeast2/api/upload`;
export interface SearchResult {
  name: string;
  totalReport: number;
  totalDamagedPrice: number;
  lastedReport: Report;
}
export const search = async (value: string, by: SearchBy): Promise<SearchResult> => {
  const { data } = await axios.get<SearchResult>('/report/get', {
    params: {
      q: value,
      by,
    },
    // timeout: 1000,
  });
  return data;
};

export const addReport = async (report: Report, token: string) => {
  const { data } = await axios.post<{ reportId: string }>(
    '/report/add',
    {
      body: report,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.reportId;
};

interface UpdateReportReq {
  report_id: string;
  report: Report;
}

export const updateReport = (req: UpdateReportReq, token: string) => {
  axios
    .put<{ report_id: string }>(
      '/report/update',
      {
        body: req,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(({ data }) => {
      return data.report_id;
    })
    .catch((e) => {
      console.log(e);
    });
};

interface VerifyReportReq {
  report_id: string;
  status: number;
}

export const verifyReport = (req: VerifyReportReq, token: string) => {
  axios
    .put<{ report_id: string }>(
      '/report/verify',
      {
        body: req,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(({ data }) => {
      console.log(data.report_id);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const deleteReport = async (reportId: string, token: string) => {
  axios
    .delete<{ reportID: string; status: string }>('/report', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        reportID: reportId,
      },
    })
    .then(({ data }) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
};

export type PaginatedReports = {
  total: number;
  data: Report[];
};
export const getReportsByUserId = async (
  userId: string,
  paginationConfig: PaginationConfig,
  token: string,
): Promise<PaginatedReports> => {
  const resp = await axios
    .get<PaginatedReports>('/report/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((e) => {
      console.log(e);
    });
  if (resp) return resp.data;
  const emptyResp: PaginatedReports = {
    total: 0,
    data: [],
  };
  return emptyResp;
};

export const getReportsByStatus = async (
  status: ReportStatus,
  paginationConfig: PaginationConfig,
  token: string,
): Promise<PaginatedReports> => {
  return { total: 100, data: [] };
};
