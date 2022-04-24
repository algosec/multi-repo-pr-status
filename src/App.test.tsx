import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page title', () => {
  render(<App />);
  const titleElement = screen.getByText("Multi-Repo PR Status");

  expect(titleElement).toBeInTheDocument();
});
