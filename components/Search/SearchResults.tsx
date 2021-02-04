import { PageHeader, Card, Space, Typography, Row, Col, Statistic, Descriptions, Divider } from 'antd';

// type SearchResultsProps = {};

const SearchResults: React.FunctionComponent = () => {
  const { Title } = Typography;
  return (
    <section className="search-results">
      <PageHeader className="search-results-header" title="ผลการค้นหา" />
      <Space direction="vertical" size="large">
        <Card>
          <Title level={4}>รัชพล อนันตวัฒน์</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="จำนวนครั้งที่ถูกรายงาน" value={10} />
            </Col>
            <Col span={12}>
              <Statistic title="ความเสียหายรวม (บาท)" value={112893} precision={2} />
            </Col>
          </Row>
          <Divider />
          <Descriptions title="รายงานล่าสุด" bordered>
            <Descriptions.Item label="วันที่">31 ธันวาคม 2563</Descriptions.Item>
            <Descriptions.Item label="ช่องทาง">โอนเงินเข้าบัญชีธนาคาร</Descriptions.Item>
            <Descriptions.Item label="ประเภทสินค้า/บริการ">ซื้อสินค้าออนไลน์</Descriptions.Item>
            <Descriptions.Item label="ยอดเงินที่โดนโกง">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card>test</Card>
      </Space>
    </section>
  );
};

export default SearchResults;
