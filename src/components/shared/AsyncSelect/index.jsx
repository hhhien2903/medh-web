import { Select, Spin } from 'antd';
import React from 'react';
import { useDebounce } from 'use-debounce';

const AsyncSelect = (props) => {
  const {
    fetchOptions,
    getOptionLabel,
    getOptionValue,
    onBlur,
    findContentLabel,
    notFoundLabel,
    optionLabelKey,
    optionValueKey,
    ...other
  } = props;

  const [search, setSearch] = React.useState('');
  const [searchDebounced] = useDebounce(search, 600);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleBlur = (event) => {
    setSearch('');

    if (onBlur) {
      onBlur(event);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchOptions(searchDebounced)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [fetchOptions, searchDebounced]);

  let options = data.map((item) => ({
    value: item[optionValueKey],
    label: item[optionLabelKey],
  }));

  if (loading || !search) {
    options = [];
  }

  let notFoundContent = findContentLabel;
  if (loading || search !== searchDebounced) {
    notFoundContent = <Spin size="small" style={{ margin: 'auto', width: '100%' }} />;
  } else if (searchDebounced) {
    notFoundContent = notFoundLabel ? notFoundLabel : 'Không có kết quả...';
  }

  return (
    <>
      <Select
        {...other}
        filterOption={false}
        onSearch={setSearch}
        loading={loading}
        notFoundContent={<div style={{ color: '#D4D4D4' }}>{notFoundContent}</div>}
        options={options}
        onBlur={handleBlur}
        showSearch
        labelInValue
        allowClear
        autoClearSearchValue
        listHeight={130}
        onClick={() => {
          setSearch(' ');
        }}
      />
    </>
  );
};

export default AsyncSelect;
