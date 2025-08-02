import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import PasswordReset from '../PasswordReset';

import { MemoryRouter } from 'react-router-dom';
describe('PasswordReset', () => {
  it('パスワードリセット画面が表示される', () => {
    render(
      <MemoryRouter>
        <PasswordReset />
      </MemoryRouter>
    );
    // h1のみを取得（複数一致回避）
    expect(screen.getByRole('heading', { level: 1, name: 'パスワードリセット' })).toBeInTheDocument();
  });
});
