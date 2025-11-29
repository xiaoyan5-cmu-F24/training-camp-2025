import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Typography, Spin, Alert, Row, Col, Input, Select, Pagination, Space } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import type { AppDispatch, RootState } from '../store/store';
import { fetchProducts, setSearchTerm, setSortOption, setCurrentPage, setPageSize } from '../store/productsSlice';
import type { SortOption } from '../store/productsSlice';

const { Meta } = Card;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, searchTerm, sortOption, currentPage, pageSize } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Client-side Filtering, Sorting, and Pagination Logic
  const processedProducts = useMemo(() => {
    let result = [...items];

    // 1. Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerTerm) || 
        product.description.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Sort
    if (sortOption) {
      result.sort((a, b) => {
        switch (sortOption) {
          case 'price_asc': return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
    }

    return result;
  }, [items, searchTerm, sortOption]);

  const totalItems = processedProducts.length;
  
  // 3. Paginate
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedProducts.slice(startIndex, startIndex + pageSize);
  }, [processedProducts, currentPage, pageSize]);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleSortChange = (value: SortOption) => {
    dispatch(setSortOption(value));
  };

  const handlePageChange = (page: number, size?: number) => {
    dispatch(setCurrentPage(page));
    if (size && size !== pageSize) {
        dispatch(setPageSize(size));
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', flexDirection: 'column', alignItems: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading products...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Featured Products
      </Title>

      {/* Controls: Search and Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Search
          placeholder="Search products..."
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)} // Live search
          style={{ width: 300 }}
        />
        <Select
          defaultValue={null}
          style={{ width: 200 }}
          onChange={handleSortChange}
          placeholder="Sort by"
          allowClear
        >
          <Option value="price_asc">Price: Low to High</Option>
          <Option value="price_desc">Price: High to Low</Option>
          <Option value="name_asc">Name: A to Z</Option>
          <Option value="name_desc">Name: Z to A</Option>
        </Select>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <Row gutter={[24, 24]} justify="center">
          {paginatedProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <ShoppingCartOutlined key="cart" style={{ fontSize: '20px' }} />,
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <Text type="secondary" style={{ display: 'block', height: '44px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#1890ff', marginTop: '10px', display: 'block' }}>
                        ${product.price.toFixed(2)}
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Text type="secondary">No products found.</Text>
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['6', '12', '24']}
        />
      </div>
    </div>
  );
};

export default ProductList;