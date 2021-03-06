import { configureStore } from '@reduxjs/toolkit';
import {dataSourceInfoReducer} from './dataSourceInfo.slice';
import {useDispatch, useSelector} from "react-redux";
import type {TypedUseSelectorHook} from "react-redux";
import {remoteDataReducer} from "./remoteData.slice";
import {getItemFromStorage, setItemInStorage} from "./storage";
import {debounce} from "debounce";
import {clearStateAction} from "./shared-actions";
import {filtersReducers} from "./filters.slice";

const STORAGE_KEY = "redux";

export const store = configureStore({
  reducer: {
    dataSourceInfo: dataSourceInfoReducer,
    remoteData: remoteDataReducer,
    filters: filtersReducers,
  },
  preloadedState: getItemFromStorage(STORAGE_KEY),
});

// here we subscribe to the store changes to persist to storage
store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => setItemInStorage(STORAGE_KEY, store.getState()), 800)
);

export const clearStore = () => store.dispatch(clearStateAction());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
