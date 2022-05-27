import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store";
import {PullRequest} from "../services/DataSource";
import moment, {Moment} from "moment/moment";
import {clearStateAction} from "./shared-actions";

const SLICE_KEY = 'pull-requests';
export const EMPTY_TIME = moment(0);

interface RemoteDataState {
  pullRequests: PullRequest[];
  lastUpdate: number;
}

const initialState: RemoteDataState = {
  pullRequests: [],
  lastUpdate: 0
}

export const remoteDataSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    updatePullRequests: (state, action: PayloadAction<PullRequest[]>) => {
      state.pullRequests = action.payload;
      state.lastUpdate = moment().valueOf();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStateAction, () => initialState)
  },
});

export const { updatePullRequests } = remoteDataSlice.actions;

export const selectPullRequests = (state: RootState): PullRequest[] => state.remoteData.pullRequests;
export const selectLastUpdate = (state: RootState): Moment => moment(state.remoteData.lastUpdate);

export const remoteDataReducer = remoteDataSlice.reducer;
