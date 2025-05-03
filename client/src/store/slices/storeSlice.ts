// src/slices/storeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  rating?: number;
}

interface StoreState {
  stores: Store[];
}

const initialState: StoreState = {
  stores: [],
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
  },
});

export const { setStores } = storeSlice.actions;
export default storeSlice.reducer;
