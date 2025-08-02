import React from 'react';
import { render } from '@testing-library/react';
import FormTitleInput from '../FormTitleInput';

describe('FormTitleInput', () => {
  it('レンダリングできる', () => {
    render(<FormTitleInput value="" onChange={() => {}} />);
    // TODO: 適切なアサーションを追加
  });
});
