import { Card, Typography, Row, Col, Statistic, Descriptions, Divider, Alert } from 'antd';
import Report from 'models/Report';
import { paymentMethodCaptions } from 'models/PaymentMethod';
import productTypeCaptions from 'models/productTypeCaptions';
import { formatAmount, formatDate } from 'utils';
import './SearchResults.less';

type SearchResultsProps = {
  lastReport: Report;
  totalNumberOfReports: number;
  totalAmount: number;
};

const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
  lastReport,
  totalNumberOfReports,
  totalAmount,
}) => {
  const { Title } = Typography;

  return (
    <section className="search-results">
      <Title level={3} className="page-title">
        พบรายงานการโกง
      </Title>
      <Card className="search-result-item">
        {lastReport.name && <Title level={4}>{lastReport.name}</Title>}
        <Row gutter={16}>
          <Col sm={12} xs={12}>
            <Statistic title="จำนวนครั้งที่ถูกรายงาน" value={totalNumberOfReports} />
          </Col>
          <Col sm={12} xs={12}>
            <Statistic title="ความเสียหายรวม" suffix="บาท" value={totalAmount} />
          </Col>
        </Row>
        <Divider />
        <Descriptions className="latest-report--lg" title="รายงานล่าสุด" column={1} bordered>
          <Descriptions.Item label="วันที่">{formatDate(lastReport.eventDate)}</Descriptions.Item>
          <Descriptions.Item label="ช่องทาง">{paymentMethodCaptions[lastReport.paymentMethod]}</Descriptions.Item>
          <Descriptions.Item label="ประเภทสินค้า/บริการ">
            {productTypeCaptions[lastReport.productType]}
          </Descriptions.Item>
          <Descriptions.Item label="ยอดความเสียหาย">{formatAmount(lastReport.amount)}</Descriptions.Item>
        </Descriptions>
        <Descriptions className="latest-report" title="รายงานล่าสุด" column={1}>
          <Descriptions.Item label="วันที่">{formatDate(lastReport.eventDate)}</Descriptions.Item>
          <Descriptions.Item label="ช่องทาง">{paymentMethodCaptions[lastReport.paymentMethod]}</Descriptions.Item>
          <Descriptions.Item label="ประเภทสินค้า/บริการ">
            {productTypeCaptions[lastReport.productType]}
          </Descriptions.Item>
          <Descriptions.Item label="ยอดความเสียหาย">{formatAmount(lastReport.amount)}</Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
};

export default SearchResults;
