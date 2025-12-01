import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Alert, Input, Select, Skeleton, message, Grid, Pagination } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { AppDispatch, RootState } from '../store/store';
import { fetchProducts, setSearchTerm, setSortOption, setCurrentPage, setPageSize } from '../store/productsSlice';
import type { SortOption } from '../store/productsSlice';
import { addToCart, setCartOpen } from '../store/cartSlice';

const { Meta } = Card;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, searchTerm, sortOption, currentPage, pageSize } = useSelector((state: RootState) => state.products);
  const screens = useBreakpoint();
  const gridRef = useRef<FixedSizeGrid>(null);

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

  // Sync local state if Redux state changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Scroll to top when page changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ scrollTop: 0 });
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

  // Determine column count based on breakpoint (similar to Ant Design responsive grid)
  const getColumnCount = () => {
    if (screens.xxl) return 6;
    if (screens.xl) return 4; // 6 cols was a bit tight for XL, let's try 4
    if (screens.lg) return 3;
    if (screens.md) return 2;
    if (screens.sm) return 2;
    return 1;
  };
  
  const columnCount = getColumnCount();
  
  // Calculate row count
  const rowCount = Math.ceil(paginatedProducts.length / columnCount);

  // Render cell for react-window
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const product = paginatedProducts[index];

    if (!product) {
      return <div style={style} />;
    }

    // Add padding to simulate gap
    const gutter = 24;
    const left = parseFloat(style.left || 0);
    const top = parseFloat(style.top || 0);
    const width = parseFloat(style.width || 0);
    const height = parseFloat(style.height || 0);

    const itemStyle = {
      ...style,
      left: left + gutter / 2,
      top: top + gutter / 2,
      width: width - gutter,
      height: height - gutter,
    };

    return (
      <div style={itemStyle}>
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
      </div>
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
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Featured Products
      </Title>

      {/* Controls: Search and Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', flexShrink: 0 }}>
        <Search
          placeholder="Search products..."
          allowClear
          value={localSearchTerm}
          onSearch={handleManualSearch}
          onChange={handleSearchChange}
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

      {/* Virtualized Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {status === 'loading' ? (
           <div style={{ textAlign: 'center', marginTop: '50px' }}>
             <Skeleton active paragraph={{ rows: 10 }} />
           </div>
        ) : processedProducts.length > 0 ? (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeGrid
                ref={gridRef}
                columnCount={columnCount}
                columnWidth={(width - 20) / columnCount} // Subtract 20px for scrollbar
                height={height}
                rowCount={rowCount}
                rowHeight={420} // Approximate height of the Card
                width={width}
                style={{ overflowX: 'hidden' }}
              >
                {Cell}
              </FixedSizeGrid>
            )}
          </AutoSizer>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Text type="secondary">No products found.</Text>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', flexShrink: 0 }}>
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
