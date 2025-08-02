import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import GoogleLoginButton from '../GoogleLoginButton';

describe('GoogleLoginButton', () => {
  it('レンダリングできる', () => {
    render(<GoogleLoginButton onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument(); // ボタンが存在することを確認
  });
});
