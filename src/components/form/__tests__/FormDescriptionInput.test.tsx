import React from 'react';
import { render } from '@testing-library/react';
import FormDescriptionInput from '../FormDescriptionInput';

describe('FormDescriptionInput', () => {
  it('レンダリングできる', () => {
    render(<FormDescriptionInput value="" onChange={() => {}} />);
    // TODO: 適切なアサーションを追加
  });
});
describe('FormDescriptionInput', () => {
  it('説明入力欄が表示される', () => {
    render(<FormDescriptionInput value="" onChange={() => {}} />);
    // 入力欄の存在を検証するのが理想
  });
});
