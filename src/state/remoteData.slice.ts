import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store";
import {GroupedPullRequest} from "../services/DataSource";
import moment, {Moment} from "moment/moment";
import {clearStateAction} from "./shared-actions";

const SLICE_KEY = 'pull-requests';
export const EMPTY_TIME = moment(0);

// used for differentiate between different data. For example data is
// saved in storage, and then a new version is deployed and
// the data can't be used anymore since it's in the wrong format.
//
// Increment this value when the data structure is changes (e.g. new feature was added)
const CURRENT_DATA_VERSION = 3;

interface RemoteDataState {
  data: GroupedPullRequest[];
  lastUpdate: number;
  isLoading: boolean;
  version: number;
}

const initialState: RemoteDataState = {
  data: [],
  lastUpdate: 0,
  isLoading: false,
  version: CURRENT_DATA_VERSION,
}

export const remoteDataSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<GroupedPullRequest[]>) => {
      state.data = action.payload;
      state.lastUpdate = moment().valueOf();
      state.version = CURRENT_DATA_VERSION;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStateAction, () => initialState)
  },
});

export const { updateData } = remoteDataSlice.actions;

export const selectData = (state: RootState): GroupedPullRequest[] => state.remoteData.data;
export const selectIsDataWithLatestVersion = (state: RootState): boolean => state.remoteData.version === CURRENT_DATA_VERSION;
export const selectLastUpdate = (state: RootState): Moment => moment(state.remoteData.lastUpdate);

export const remoteDataReducer = remoteDataSlice.reducer;
