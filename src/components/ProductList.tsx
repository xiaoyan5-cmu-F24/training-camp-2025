import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Alert, Skeleton, Pagination, Row, Col, message } from 'antd';
import { debounce } from 'lodash';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import type { AppDispatch, RootState } from '../store/store';
import { fetchProducts, setSearchTerm, setSortOption, setCurrentPage, setPageSize } from '../store/productsSlice';
import type { SortOption, Product } from '../store/productsSlice';
import { addToCart, setCartOpen } from '../store/cartSlice';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import Recommendations from './Recommendations';

const { Title } = Typography;

interface ItemData {
  paginatedProducts: Product[];
  columnCount: number;
  randomRecommendations: Product[];
  handleRefreshRecs: () => void;
  handleAddToCart: (product: Product) => void;
  localSearchTerm: string;
  sortOption: SortOption;
  handleManualSearch: (value: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (value: SortOption) => void;
}

interface RowRendererProps {
  index: number;
  style: React.CSSProperties;
  data: ItemData;
}

// Define RowRenderer outside to ensure stability and prevent focus loss
const RowRenderer: React.FC<RowRendererProps> = ({ index, style, data }) => {
  const {
    paginatedProducts,
    columnCount,
    randomRecommendations,
    handleRefreshRecs,
    handleAddToCart,
    localSearchTerm,
    sortOption,
    handleManualSearch,
    handleSearchChange,
    handleSortChange
  } = data;

  // Adjust style for scrollbar
  const rowStyle = {
    ...style,
    width: typeof style.width === 'number' ? (style.width as number) - 20 : 'calc(100% - 20px)',
  };

  // Header Row
  if (index === 0) {
    return (
      <div style={rowStyle}>
        <div style={{ paddingBottom: 24 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
            Featured Products
          </Title>

          <Recommendations
            products={randomRecommendations}
            onRefresh={handleRefreshRecs}
            onAddToCart={handleAddToCart}
          />

          <ProductFilter
            searchTerm={localSearchTerm}
            sortOption={sortOption}
            onSearch={handleManualSearch}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
          />
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
        {rowItems.map((product: Product) => (
          <Col key={product.id} span={24 / columnCount} style={{ height: '100%' }}>
            <ProductCard
              product={product}
              handleAddToCart={handleAddToCart}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

// A simple pseudo-random number generator (PRNG) for deterministic shuffling
const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

const seededShuffle = (array: Product[], seed: number): Product[] => {
  if (array.length === 0) return [];
  const getRnd = mulberry32(seed);
  
  // Create an array of objects with original item and a random sort key
  const tempArr = array.map(item => ({
    item,
    sortKey: getRnd()
  }));

  // Sort based on the generated sort key
  tempArr.sort((a, b) => a.sortKey - b.sortKey);

  // Return the shuffled items
  return tempArr.map(entry => entry.item);
};

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, searchTerm, sortOption, currentPage, pageSize } = useSelector((state: RootState) => state.products);
  const listRef = useRef<VariableSizeList>(null);

  // Local state for immediate UI update
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  // State to trigger recommendation refresh
  const [recTrigger, setRecTrigger] = useState(0);

  const handleAddToCart = (product: Product) => {
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
    const shuffled = seededShuffle(items, recTrigger);
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

              // Prepare item data for the renderer
              const itemData = {
                paginatedProducts,
                columnCount,
                randomRecommendations,
                handleRefreshRecs,
                handleAddToCart,
                localSearchTerm,
                sortOption,
                handleManualSearch,
                handleSearchChange,
                handleSortChange
              };

              return (
                <VariableSizeList
                  ref={listRef}
                  height={height}
                  width={width}
                  itemCount={totalListCount}
                  itemSize={getItemSize}
                  itemData={itemData}
                  style={{ overflowX: 'hidden' }}
                >
                  {RowRenderer}
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