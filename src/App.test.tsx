import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders itself', () => {
  const { getByText } = render(<App />);
  const someElement = getByText(/UserSystem/i);
  expect(someElement).toBeInTheDocument();
});
