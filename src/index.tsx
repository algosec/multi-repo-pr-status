import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./state/store";
import {ToastContainer} from "react-toastify";
import {cleanupLegacyDataFromStorage} from "./services/cleanup";

cleanupLegacyDataFromStorage();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter basename="/multi-repo-pr-status">
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);
