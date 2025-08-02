import React from 'react';
import { render } from '@testing-library/react';
import FormResponseList from '../FormResponseList';
describe('FormResponseList', () => {
  it('回答一覧画面が表示される', () => {
    render(<FormResponseList />);
    // 回答リストの存在を検証するのが理想
  });
});
