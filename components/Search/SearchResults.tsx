import { Card, Space, Typography, Row, Col, Statistic, Descriptions, Divider, Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

// type SearchResultsProps = {};

const SearchResults: React.FunctionComponent = () => {
  const { Title } = Typography;
  const formatter = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' });
  return (
    <section className="search-results">
      <Title level={3}>พบรายงานการโกง</Title>
      {/* <PageHeader className="search-results-header" title="ผลการค้นหา" /> */}
      <Space direction="vertical" size="large">
        <Card className="search-result-item">
          <Title level={4}>รัชพล อนันตวัฒน์</Title>
          <Row gutter={16}>
            <Col sm={12} xs={12}>
              <Statistic title="จำนวนครั้งที่ถูกรายงาน" value={10} />
            </Col>
            <Col sm={12} xs={12}>
              <Statistic title="ความเสียหายรวมทั้งหมด" prefix="฿" value={112893} precision={2} />
            </Col>
          </Row>
          <Divider />
          <Descriptions title="รายงานล่าสุด" column={{ md: 2, sm: 1, xs: 1 }} bordered>
            <Descriptions.Item label="วันที่">31 ธันวาคม 2563</Descriptions.Item>
            <Descriptions.Item label="ช่องทาง">โอนเงินเข้าบัญชีธนาคาร</Descriptions.Item>
            <Descriptions.Item label="ประเภทสินค้า/บริการ">ซื้อสินค้าออนไลน์</Descriptions.Item>
            <Descriptions.Item label="ยอดความเสียหาย">{formatter.format(5852.698)}</Descriptions.Item>
          </Descriptions>
        </Card>
        {/* <Card>
          <Title level={4}>รัชพล อนันตวัฒน์</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="จำนวนครั้งที่ถูกรายงาน" value={10} />
            </Col>
            <Col span={12}>
              <Statistic title="ความเสียหายรวม" prefix="฿" value={112893} precision={2} />
            </Col>
          </Row>
          <Divider />
          <Descriptions title="รายงานล่าสุด" column={{ md: 2, sm: 1, xs: 1 }} bordered>
            <Descriptions.Item label="วันที่">31 ธันวาคม 2563</Descriptions.Item>
            <Descriptions.Item label="ช่องทาง">โอนเงินเข้าบัญชีธนาคาร</Descriptions.Item>
            <Descriptions.Item label="ประเภทสินค้า/บริการ">ซื้อสินค้าออนไลน์</Descriptions.Item>
            <Descriptions.Item label="ยอดความเสียหาย">{formatter.format(5852.698)}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card>
          <Title level={4}>รัชพล อนันตวัฒน์</Title> <WarningOutlined />
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="จำนวนครั้งที่ถูกรายงาน" value={10} />
            </Col>
            <Col span={12}>
              <Statistic title="ความเสียหายรวม" prefix="฿" value={112893} precision={2} />
            </Col>
          </Row>
          <Divider />
          <Descriptions title="รายงานล่าสุด" column={{ md: 2, sm: 1, xs: 1 }} bordered>
            <Descriptions.Item label="วันที่">31 ธันวาคม 2563</Descriptions.Item>
            <Descriptions.Item label="ช่องทาง">โอนเงินเข้าบัญชีธนาคาร</Descriptions.Item>
            <Descriptions.Item label="ประเภทสินค้า/บริการ">ซื้อสินค้าออนไลน์</Descriptions.Item>
            <Descriptions.Item label="ยอดความเสียหาย">{formatter.format(5852.698)}</Descriptions.Item>
          </Descriptions>
        </Card> */}
      </Space>
    </section>
  );
};

export default SearchResults;
