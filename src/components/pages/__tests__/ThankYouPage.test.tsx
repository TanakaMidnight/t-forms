import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ThankYouPage from '../ThankYouPage';

import { MemoryRouter } from 'react-router-dom';
describe('ThankYouPage', () => {
  it('サンクス画面が表示される', () => {
    render(
      <MemoryRouter>
        <ThankYouPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/ありがとう|Thank/i)).toBeInTheDocument();
  });
});
