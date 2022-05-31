import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store";
import {clearStateAction} from "./shared-actions";
import {DataSourceInfo} from "../services/DataSource";

const SLICE_KEY = 'data-source';

interface DataSourceInfoState {
  value: DataSourceInfo | null;
}

const initialState: DataSourceInfoState = {
  value: null
}

const dataSourceInfoSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    updateDataSourceInfo: (state, action: PayloadAction<DataSourceInfo>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStateAction, () => initialState)
  },
});

export const { updateDataSourceInfo } = dataSourceInfoSlice.actions;

export const selectDataSourceInfo = (state: RootState): DataSourceInfo => state.dataSourceInfo.value as DataSourceInfo;
export const hasDataSourceInfo = (state: RootState): boolean => Boolean(state.dataSourceInfo.value);

export const dataSourceInfoReducer = dataSourceInfoSlice.reducer;
