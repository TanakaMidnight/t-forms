import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import MyPage from '../MyPage';

import { MemoryRouter } from 'react-router-dom';
describe('MyPage', () => {
  it('マイページが表示される', () => {
    render(
      <MemoryRouter>
        <MyPage />
      </MemoryRouter>
    );
    // 未ログイン時は「ログインしてください」のみ表示
    expect(screen.getByText('ログインしてください')).toBeInTheDocument();
  });
});
