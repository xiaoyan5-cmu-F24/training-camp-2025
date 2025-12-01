import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Alert, Input, Select, Skeleton, message, Pagination, Row, Col, Button, Tooltip } from 'antd';
import { ShoppingCartOutlined, ReloadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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
  const listRef = useRef<VariableSizeList>(null);

  // Local state for immediate UI update
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  // State to trigger recommendation refresh
  const [recTrigger, setRecTrigger] = useState(0);

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

  // Sync local state if Redux state changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Scroll to top when page changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [currentPage]);

  // Debounced search action
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchTerm(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Client-side Filtering and Sorting
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
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleManualSearch = (value: string) => {
    debouncedSearch.cancel();
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

  const handleRefreshRecs = () => {
    setRecTrigger(prev => prev + 1);
  };

  // Random Recommendations (Simulate AI)
  const randomRecommendations = useMemo(() => {
    if (items.length === 0) return [];
    // Shuffle array and pick first 4. Depend on recTrigger to refresh.
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [items, recTrigger]);

  if (status === 'failed') {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        {status === 'loading' ? (
           <div style={{ textAlign: 'center', marginTop: '50px' }}>
             <Skeleton active paragraph={{ rows: 10 }} />
           </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => {
              // Calculate columns based on width
              let columnCount = 1;
              if (width >= 1600) columnCount = 6;
              else if (width >= 1200) columnCount = 4;
              else if (width >= 992) columnCount = 3;
              else if (width >= 768) columnCount = 2;
              else if (width >= 576) columnCount = 2;
              
              const productRowCount = Math.ceil(paginatedProducts.length / columnCount);
              const totalListCount = 1 + productRowCount; // 1 for Header
              
              // Estimate header height
              const headerHeight = randomRecommendations.length > 0 ? 550 : 150;

              const getItemSize = (index: number) => {
                if (index === 0) return headerHeight;
                return 450; // Product Row Height + Gap
              };

              return (
                <VariableSizeList
                  ref={listRef}
                  height={height}
                  width={width}
                  itemCount={totalListCount}
                  itemSize={getItemSize}
                  style={{ overflowX: 'hidden' }}
                >
                  {({ index, style }) => {
                    // Adjust style to account for scrollbar width
                    const rowStyle = {
                      ...style,
                      width: typeof style.width === 'number' ? style.width - 20 : 'calc(100% - 20px)',
                    };

                    // Header Row
                    if (index === 0) {
                      return (
                        <div style={rowStyle}>
                          <div style={{ paddingBottom: 24 }}>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
                              Featured Products
                            </Title>

                            {/* Recommendations Section */}
                            {randomRecommendations.length > 0 && (
                              <div style={{ marginBottom: '40px' }}>
                                <Row gutter={[24, 24]} style={{ margin: 0 }}>
                                  <Col span={24}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                                      <Title level={4} style={{ margin: 0 }}>You May Also Like</Title>
                                      <Tooltip title="Refresh Recommendations">
                                          <Button type="text" icon={<ReloadOutlined />} onClick={handleRefreshRecs} />
                                      </Tooltip>
                                    </div>
                                  </Col>
                                </Row>
                                <Row gutter={[24, 24]} style={{ margin: 0 }}>
                                  {randomRecommendations.map(product => (
                                    <Col key={`rec-${product.id}`} xs={24} sm={12} md={6} lg={6} xl={6}>
                                      <Card
                                        hoverable
                                        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                                        cover={<img alt={product.name} src={product.image} style={{ height: 160, objectFit: 'cover' }} />}
                                        bodyStyle={{ padding: '12px', flex: 1 }}
                                        actions={[
                                          <ShoppingCartOutlined key="cart" onClick={() => handleAddToCart(product)} />,
                                        ]}
                                      >
                                        <Meta
                                          title={<Text strong style={{ fontSize: '14px' }} ellipsis>{product.name}</Text>}
                                          description={
                                            <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                                              ${product.price.toFixed(2)}
                                            </Text>
                                          }
                                        />
                                      </Card>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            )}

                            {/* Controls: Search and Sort */}
                            <Row gutter={[24, 24]} style={{ margin: '0 0 24px 0' }}>
                              <Col span={24}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                  <Search
                                    placeholder="Search products..."
                                    allowClear
                                    value={localSearchTerm}
                                    onSearch={handleManualSearch}
                                    onChange={handleSearchChange}
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
                              </Col>
                            </Row>
                          </div>
                        </div>
                      );
                    }

                    // Product Grid Row
                    const rowIndex = index - 1;
                    const startIndex = rowIndex * columnCount;
                    const rowItems = paginatedProducts.slice(startIndex, startIndex + columnCount);
                    
                    return (
                      <div style={rowStyle}>
                        <Row gutter={[24, 24]} style={{ margin: 0, height: 'calc(100% - 30px)' }}>
                          {rowItems.map(product => (
                            <Col key={product.id} span={24 / columnCount} style={{ height: '100%' }}>
                              <Card
                                hoverable
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
                      </div>
                    );
                  }}
                </VariableSizeList>
              );
            }}
          </AutoSizer>
        )}
      </div>

      {/* Pagination - Fixed at bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', paddingBottom: '16px', flexShrink: 0 }}>
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
