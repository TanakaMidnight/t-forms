import React from 'react';
import { render } from '@testing-library/react';
import AuthForm from '../AuthForm';
import { MemoryRouter } from 'react-router-dom';
describe('AuthForm', () => {
  it('認証フォームが表示される', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );
    // 入力欄やボタンの存在を検証するのが理想
  });
});
