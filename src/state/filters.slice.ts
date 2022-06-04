import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store";
import {clearStateAction} from "./shared-actions";

const SLICE_KEY = 'filters';

// this interface belongs to "react-multi-select-component",
// however, it's not exported, so had to paste it here.
export interface Option {
  value: string;
  label: string;
  key?: string;
  disabled?: boolean;
}

interface FiltersState {
  freeText: string;
  projects: Option[];
  repositories: Option[];
  authors: Option[];
}

const initialState: FiltersState = {
  freeText: "",
  projects: [],
  repositories: [],
  authors: [],
}

export const filtersSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    updateFreeTextFilter: (state, action: PayloadAction<string>) => {
      state.freeText = action.payload;
    },
    updateProjectsFilter: (state, action: PayloadAction<Option[]>) => {
      state.projects = action.payload;
    },
    updateRepositoriesFilter: (state, action: PayloadAction<Option[]>) => {
      state.repositories = action.payload;
    },
    updateAuthorsFilter: (state, action: PayloadAction<Option[]>) => {
      state.authors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearStateAction, () => initialState)
  },
});

export const { updateFreeTextFilter, updateProjectsFilter, updateRepositoriesFilter, updateAuthorsFilter  } = filtersSlice.actions;

export const selectFreeTextFilter = (state: RootState): string => state.filters.freeText;
export const selectProjectsFilter = (state: RootState): Option[] => state.filters.projects;
export const selectRepositoriesFilter = (state: RootState): Option[] => state.filters.repositories;
export const selectAuthorsFilter = (state: RootState): Option[] => state.filters.authors;

export const filtersReducers = filtersSlice.reducer;
