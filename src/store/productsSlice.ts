import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null;

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchTerm: string;
  sortOption: SortOption;
  currentPage: number;
  pageSize: number;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  searchTerm: '',
  sortOption: null,
  currentPage: 1,
  pageSize: 50,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://localhost:3001/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data as Product[];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { setSearchTerm, setSortOption, setCurrentPage, setPageSize } = productsSlice.actions;

export default productsSlice.reducer;