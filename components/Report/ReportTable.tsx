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
  onDeleteReport: (reportId: string) => Promise<void>;
  onLoadReports: (pagination: PaginationConfig) => Promise<PaginatedReports>;
  isAdmin?: boolean;
};
type ReportItem = Report;
const pageSize = 7;
const ReportTable: React.FunctionComponent<ReportTableProps> = ({ onDeleteReport, onLoadReports, isAdmin }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loadReportsCallback = useCallback(async () => {
    setIsLoading(true);
    const response = await onLoadReports({ current: currentPage, pageSize });
    console.log(response.data);
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

  const handleTableChange = ({ current = 1 }: TablePaginationConfig) => {
    setCurrentPage(current);
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
      onChange={handleTableChange}
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
