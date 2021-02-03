import { Input, Radio, RadioChangeEvent, Space } from 'antd';
import { useState } from 'react';

type SearchBy = 'bankAccount' | 'phone' | 'idNumber' | 'name';

const SearchForm: React.FunctionComponent = () => {
  const { Search } = Input;
  const [searchBy, updateSearchBy] = useState<SearchBy>('bankAccount');
  const handleSearch = (value: string) => {};
  const handleSearchByChange = (e: RadioChangeEvent) => {
    updateSearchBy(e.target.value);
  };
  return (
    <Space direction="vertical" size="middle">
      <Search placeholder="เลขบัญชีธนาคาร" allowClear enterButton="ค้นหา" size="large" onSearch={handleSearch} />
      <Radio.Group onChange={handleSearchByChange} value={searchBy}>
        <Radio value="bankAccount">เลขบัญชีธนาคาร</Radio>
        <Radio value="phone">เบอร์โทรศัพท์</Radio>
        <Radio value="idNumber">เลขประจำตัวประชาชน</Radio>
        <Radio value="name">ชื่อนามสกุล</Radio>
      </Radio.Group>
    </Space>
  );
};

export default SearchForm;
