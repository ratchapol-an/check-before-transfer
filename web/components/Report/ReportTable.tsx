/* eslint-disable jsx-a11y/anchor-is-valid */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PaymentMethod, { paymentMethodCaptions } from '@models/PaymentMethod';
import productTypeCaptions from '@models/productTypeCaptions';
import Report from '@models/Report';
import ReportStatus, { reportStatusCaptions, reportStatusColors } from '@models/ReportStatus';
import { Table, Tag, Space, Button, Modal, TablePaginationConfig } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';
import { PaginatedReports } from 'services/reportingService';
import { formatAmount, formatDate } from 'utils';

type ReportTableProps = {
  currentPage: number;
  onDeleteReport: (reportId: string) => Promise<void>;
  onLoadReports: (pagination: PaginationConfig) => Promise<PaginatedReports>;
  onTableChange: (tablePagination: TablePaginationConfig) => void;
  isAdmin?: boolean;
};
type ReportItem = Report;
const pageSize = 7;
const ReportTable: React.FunctionComponent<ReportTableProps> = ({
  currentPage,
  onDeleteReport,
  onLoadReports,
  isAdmin,
  onTableChange,
}) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loadReportsCallback = useCallback(async () => {
    setIsLoading(true);
    const response = await onLoadReports({ current: currentPage, pageSize });
    setReports(response.data as ReportItem[]);
    setTotal(response.total);
    setIsLoading(false);
  }, [currentPage, onLoadReports]);

  useEffect(() => {
    loadReportsCallback();
  }, [loadReportsCallback]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'คุณยืนยันที่จะลบรายงานนี้?',
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      async onOk() {
        await onDeleteReport(id);
        setReports(reports.filter((report) => report.id !== id));
      },
    });
  };

  const pagination: TablePaginationConfig = {
    current: currentPage,
    showSizeChanger: false,
    total,
  };

  return (
    <Table
      dataSource={reports}
      rowKey={(report) => report.id}
      pagination={pagination}
      loading={isLoading}
      scroll={{ x: true }}
      onChange={onTableChange}
    >
      <Table.Column<ReportItem> title="รหัสรายงาน" dataIndex="id" key="id" />
      <Table.Column<ReportItem>
        title="วันที่ทำธุรกรรม"
        dataIndex="eventDate"
        key="eventDate"
        render={(value: string) => formatDate(value)}
      />
      <Table.Column<ReportItem>
        title="ประเภทสินค้า/บริการ"
        dataIndex="productType"
        key="productType"
        render={(value: number) => productTypeCaptions[value]}
      />
      <Table.Column<ReportItem>
        title="ช่องทาง"
        dataIndex="paymentMethod"
        key="paymentMethod"
        render={(value: PaymentMethod) => paymentMethodCaptions[value]}
      />
      <Table.Column<ReportItem>
        title="จำนวนเงิน"
        dataIndex="amount"
        key="amount"
        render={(value: number) => formatAmount(value)}
      />
      <Table.Column<ReportItem>
        title="สถานะ"
        dataIndex="status"
        key="status"
        render={(status: ReportStatus) => (
          <Tag color={reportStatusColors[status]} key={status}>
            {reportStatusCaptions[status]}
          </Tag>
        )}
      />
      <Table.Column<ReportItem>
        key="action"
        render={(_, report: ReportItem) => {
          return (
            <Space size="middle" key="action">
              <Link href={`/report/${report.id}`}>
                <a>{isAdmin ? 'ตรวจสอบ' : 'ดูรายละเอียด'}</a>
              </Link>
              <Button type="link" onClick={() => handleDelete(report.id)}>
                ลบ
              </Button>
            </Space>
          );
        }}
      />
    </Table>
  );
};

export default memo(ReportTable);
