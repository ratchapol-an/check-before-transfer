import { Input, Radio, RadioChangeEvent, Space, Button } from 'antd';
import { useState } from 'react';
import './SearchForm.less';

type SearchBy = 'bankAccount' | 'phone' | 'idNumber' | 'name';
const placeHolders: Record<SearchBy, string> = {
  bankAccount: 'ระบุเลขบัญชีธนาคาร เช่น 099-9-99999-0 หรือ 0999999990',
  phone: 'ระบุเบอร์มือถือ เช่น 099-999-9999 หรือ 0999999999',
  idNumber: 'ระบุหมายเลขประจำตัวประชาชน เช่น 190990000999',
  name: 'ระบุชื่อนามสกุล โดยไม่มีคำนำหน้า เช่น สมชาย ใจดี',
};

const SearchForm: React.FunctionComponent = () => {
  const { Search } = Input;
  const [searchBy, updateSearchBy] = useState<SearchBy>('bankAccount');
  const handleSearch = (value: string) => {};
  const handleSearchByChange = (e: RadioChangeEvent) => {
    updateSearchBy(e.target.value);
  };
  return (
    <Space className="search-form" direction="vertical" size="middle">
      <Radio.Group onChange={handleSearchByChange} value={searchBy}>
        <Radio value="bankAccount">เลขบัญชีธนาคาร</Radio>
        <Radio value="phone">เบอร์โทรศัพท์มือถือ</Radio>
        <Radio value="idNumber">เลขประจำตัวประชาชน</Radio>
        <Radio value="name">ชื่อ-นามสกุล</Radio>
      </Radio.Group>
      <Space direction="horizontal" size="middle">
        <Search
          placeholder={placeHolders[searchBy]}
          allowClear
          enterButton="ค้นหา"
          size="large"
          onSearch={handleSearch}
          type={searchBy === 'name' ? 'text' : 'tel'}
        />
        <Button type="primary" className="report-btn" size="large">
          รายงานการโกง
        </Button>
      </Space>
    </Space>
  );
};

export default SearchForm;
