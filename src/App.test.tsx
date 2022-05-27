import React from 'react';
import { render, screen } from '@testing-library/react';
import {MemoryRouter} from "react-router-dom";
import App from './App';
import {store} from "./state/store";
import {Provider} from "react-redux";

test('renders page title', () => {
  render(<Provider store={store}><MemoryRouter><App /></MemoryRouter></Provider>);
  const titleElement = screen.getByText("Multi-Repo PR Status");

  expect(titleElement).toBeInTheDocument();
});
