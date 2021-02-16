import { Input, Radio, RadioChangeEvent, Space } from 'antd';
import clsx from 'clsx';
import SearchBy from 'models/searchBy';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './SearchForm.less';

const placeHolders: Record<SearchBy, string> = {
  'bank-account': 'ระบุเลขบัญชีธนาคาร เช่น 099-9-99999-0 หรือ 0999999990',
  phone: 'ระบุเบอร์มือถือ เช่น 099-999-9999 หรือ 0999999999',
  'id-number': 'ระบุหมายเลขประจำตัวประชาชน เช่น 190990000999',
  name: 'ระบุชื่อนามสกุล โดยไม่มีคำนำหน้า เช่น สมชาย ใจดี',
};

type SearchFormProps = {
  size?: 'normal' | 'large';
  initialValue?: string;
  initialSearchBy?: SearchBy;
};

const SearchForm: React.FunctionComponent<SearchFormProps> = ({
  size = 'normal',
  initialValue = '',
  initialSearchBy = 'bank-account',
}) => {
  const { Search } = Input;
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [searchBy, setSearchBy] = useState<SearchBy>(initialSearchBy);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearch = async (value: string) => {
    // setIsSearching(true);
    await router.push(`/results?q=${value}&by=${searchBy}`);
    // if (isMounted) {
    //   setIsSearching(false);
    // }
  };
  const handleSearchByChange = (e: RadioChangeEvent) => {
    setSearchBy(e.target.value);
  };
  return (
    <Space className={clsx('search-form', { 'search-form-lg': size === 'large' })} direction="vertical" size="middle">
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
          loading={isSearching}
          size="large"
          value={searchValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
          type="search"
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
