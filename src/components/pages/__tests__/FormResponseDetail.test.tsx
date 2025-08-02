import React from 'react';
import { render } from '@testing-library/react';
import FormResponseDetail from '../FormResponseDetail';
describe('FormResponseDetail', () => {
  it('回答詳細画面が表示される', () => {
    render(<FormResponseDetail />);
    // 詳細内容の存在を検証するのが理想
  });
});
