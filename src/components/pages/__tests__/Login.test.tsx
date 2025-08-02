import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../Login';

import { MemoryRouter } from 'react-router-dom';
describe('Login', () => {
  it('ログイン画面が表示される', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // h1のみを取得（複数一致回避）
    expect(screen.getByRole('heading', { level: 1, name: 'ログイン' })).toBeInTheDocument();
  });
});
