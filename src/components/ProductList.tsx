import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Alert, Row, Col, Input, Select, Pagination, Skeleton, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import type { AppDispatch, RootState } from '../store/store';
import { fetchProducts, setSearchTerm, setSortOption, setCurrentPage, setPageSize } from '../store/productsSlice';
import type { SortOption } from '../store/productsSlice';
import { addToCart, setCartOpen } from '../store/cartSlice';

const { Meta } = Card;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, searchTerm, sortOption, currentPage, pageSize } = useSelector((state: RootState) => state.products);

  // Local state for immediate UI update
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
    message.success(`${product.name} added to cart`);
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Sync local state if Redux state changes externally (optional but good practice)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search action
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchTerm(value));
      }, 500), // 500ms delay
    [dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value); // Update input immediately
    debouncedSearch(value);    // Update Redux state after delay
  };

  const handleManualSearch = (value: string) => {
    debouncedSearch.cancel(); // Cancel pending debounce
    dispatch(setSearchTerm(value)); // Update immediately
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

  // Render Skeletons for Loading State
  const renderSkeletons = () => {
    return (
      <Row gutter={[24, 24]} justify="center">
        {Array.from({ length: pageSize }).map((_, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
            <Card
              hoverable
              cover={<Skeleton.Image active style={{ width: '100%', height: 200 }} />}
              actions={[
                <Skeleton.Button active size="small" shape="circle" key="cart" />,
              ]}
            >
              <Skeleton active paragraph={{ rows: 2 }} title={{ width: '70%' }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

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
          value={localSearchTerm}
          onSearch={handleManualSearch}
          onChange={handleSearchChange} // Live search with debounce
          style={{ width: 300 }}
          disabled={status === 'loading'}
        />
        <Select
          defaultValue={null}
          style={{ width: 200 }}
          onChange={handleSortChange}
          placeholder="Sort by"
          allowClear
          disabled={status === 'loading'}
        >
          <Option value="price_asc">Price: Low to High</Option>
          <Option value="price_desc">Price: High to Low</Option>
          <Option value="name_asc">Name: A to Z</Option>
          <Option value="name_desc">Name: Z to A</Option>
        </Select>
      </div>

      {/* Product Grid or Skeletons */}
      {status === 'loading' ? (
        renderSkeletons()
      ) : paginatedProducts.length > 0 ? (
        <Row gutter={[24, 24]} justify="center">
          {paginatedProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <ShoppingCartOutlined key="cart" style={{ fontSize: '20px' }} onClick={() => handleAddToCart(product)} />,
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

      {/* Pagination - Disable or hide when loading */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['50', '100', '200']}
          disabled={status === 'loading'}
        />
      </div>
    </div>
  );
};

export default ProductList;