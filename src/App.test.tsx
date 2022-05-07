import React from 'react';
import { render, screen } from '@testing-library/react';
import {MemoryRouter} from "react-router-dom";
import App from './App';

test('renders page title', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const titleElement = screen.getByText("Multi-Repo PR Status");

  expect(titleElement).toBeInTheDocument();
});
