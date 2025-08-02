import React from 'react';
import { render } from '@testing-library/react';
import BarChartResult from '../BarChartResult';

describe('BarChartResult', () => {
  it('レンダリングできる', () => {
    render(<BarChartResult options={[]} responses={[]} />);
    // TODO: 適切なアサーションを追加
  });
});
