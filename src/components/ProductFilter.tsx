import React from 'react';
import { Input, Select, Row, Col } from 'antd';
import type { SortOption } from '../store/productsSlice';

const { Search } = Input;
const { Option } = Select;

interface ProductFilterProps {
  searchTerm: string;
  sortOption: SortOption;
  onSearch: (value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (value: SortOption) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ searchTerm, sortOption, onSearch, onSearchChange, onSortChange }) => {
  return (
    <Row gutter={[24, 24]} style={{ margin: '0 0 24px 0' }}>
      <Col span={24}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Search
            placeholder="Search products..."
            allowClear
            value={searchTerm}
            onSearch={onSearch}
            onChange={onSearchChange}
            style={{ width: 300 }}
          />
          <Select
            value={sortOption}
            style={{ width: 200 }}
            onChange={onSortChange}
            placeholder="Sort by"
            allowClear
          >
            <Option value="price_asc">Price: Low to High</Option>
            <Option value="price_desc">Price: High to Low</Option>
            <Option value="name_asc">Name: A to Z</Option>
            <Option value="name_desc">Name: Z to A</Option>
          </Select>
        </div>
      </Col>
    </Row>
  );
};

export default ProductFilter;
