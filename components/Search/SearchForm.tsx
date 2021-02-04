import { Input, Radio, RadioChangeEvent, Space } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import './SearchForm.less';

type SearchBy = 'bank-account' | 'phone' | 'id-number' | 'name';
const placeHolders: Record<SearchBy, string> = {
  'bank-account': 'ระบุเลขบัญชีธนาคาร เช่น 099-9-99999-0 หรือ 0999999990',
  phone: 'ระบุเบอร์มือถือ เช่น 099-999-9999 หรือ 0999999999',
  'id-number': 'ระบุหมายเลขประจำตัวประชาชน เช่น 190990000999',
  name: 'ระบุชื่อนามสกุล โดยไม่มีคำนำหน้า เช่น สมชาย ใจดี',
};

const SearchForm: React.FunctionComponent = () => {
  const { Search } = Input;
  const [searchBy, updateSearchBy] = useState<SearchBy>('bank-account');
  const router = useRouter();
  const handleSearch = (value: string) => {
    router.push(`/results?q=${value}&by=${searchBy}`);
  };
  const handleSearchByChange = (e: RadioChangeEvent) => {
    updateSearchBy(e.target.value);
  };
  return (
    <Space className="search-form" direction="vertical" size="middle">
      <Radio.Group onChange={handleSearchByChange} value={searchBy}>
        <Radio value="bank-account">เลขบัญชีธนาคาร</Radio>
        <Radio value="phone">เบอร์โทรศัพท์มือถือ</Radio>
        <Radio value="id-number">เลขประจำตัวประชาชน</Radio>
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
          maxLength={searchBy === 'name' ? 100 : 20}
        />
        {/* <Button className="report-btn" size="large">
          รายงานการโกง
        </Button> */}
      </Space>
    </Space>
  );
};

export default SearchForm;
