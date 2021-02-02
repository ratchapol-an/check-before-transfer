import { Input } from 'antd';

const SearchForm: React.FunctionComponent = () => {
  const { Search } = Input;
  const handlerSearch = (value: string) => {};
  return (
    <>
      <Search placeholder="เลขบัญชีธนาคาร" allowClear enterButton="ค้นหา" size="large" onSearch={handlerSearch} />
    </>
  );
};

export default SearchForm;
