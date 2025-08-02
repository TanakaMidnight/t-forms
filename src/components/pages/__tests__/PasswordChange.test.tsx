import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import PasswordChange from '../PasswordChange';

import { MemoryRouter } from 'react-router-dom';
describe('PasswordChange', () => {
  it('パスワード変更画面が表示される', () => {
    render(
      <MemoryRouter>
        <PasswordChange />
      </MemoryRouter>
    );
    // 未ログイン時は「ログインしてください」のみ表示
    expect(screen.getByText('ログインしてください')).toBeInTheDocument();
  });
});
