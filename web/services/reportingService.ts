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
  process.env.NEXT_PUBLIC_APP_STAGE === 'production' ? process.env.NEXT_PUBLIC_HOST_URL : 'http://localhost:3000';

const API_FIREBASE_HOST =
  process.env.NEXT_PUBLIC_APP_STAGE === 'production'
    ? process.env.NEXT_PUBLIC_HOST_CLOUDFUNCTION_URL
    : 'http://localhost:5001/check-before-transfer/asia-southeast2';

axios.defaults.baseURL = `${API_HOST}/api`;

// PROD URL
// https://asia-southeast2-check-before-transfer.cloudfunctions.net

export interface SearchResult {
  name: string;
  totalReport: number;
  totalDamagedPrice: number;
  lastedReport: Report;
}
export const search = async (value: string, by: SearchBy): Promise<SearchResult> => {
  const { data } = await axios.get<SearchResult>('/reports/get', {
    params: {
      q: value.trim(),
      by,
    },
    // timeout: 1000,
  });
  return data;
};

export const addReport = async (report: Report, token: string) => {
  const { data } = await axios.post<{ reportId: string }>('/reports/add', report, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.reportId;
};

export const updateReport = async (report: Report, token: string) => {
  return axios.put('/reports/update', report, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateReportStatus = async (reportId: string, status: number, token: string) => {
  await axios.put<{ reportID: string }>(
    '/reports/verify',
    {
      reportId,
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const deleteReport = async (reportId: string, token: string) => {
  await axios.delete<{ reportId: string; status: string }>('/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      reportId,
    },
  });
};

export type PaginatedReports = {
  total: number;
  data: Report[];
};
export const getReportsByUserId = async (
  paginationConfig: PaginationConfig,
  token: string,
): Promise<PaginatedReports> => {
  const { pageSize = 10, current = 1 } = paginationConfig;
  const offset = pageSize * current - pageSize;
  const resp = await axios
    .get<PaginatedReports>('/reports', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        offset,
        limit: pageSize,
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
  const { pageSize = 10, current = 1 } = paginationConfig;
  const offset = pageSize * current - pageSize;
  const resp = await axios
    .get<PaginatedReports>('/admins/reports', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
        offset,
        limit: pageSize,
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

export const getReportById = async (id: string, token: string): Promise<Report | null> => {
  const resp = await axios.get<Report>(`/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resp ? resp.data : null;
};

export const apiUploadFile = `${API_FIREBASE_HOST}/api/file/upload`;

export const deleteFile = async (dirName: string, fileName: string, token: string) => {
  axios
    .delete(`/api/file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        dirName,
        fileName,
      },
      baseURL: `${API_FIREBASE_HOST}`,
    })
    .then(({ data }) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
};
