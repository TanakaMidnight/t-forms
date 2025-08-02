import React from 'react';
import { render } from '@testing-library/react';
import PieChartResult from '../PieChartResult';

describe('PieChartResult', () => {
  it('レンダリングできる', () => {
    render(<PieChartResult values={[1,2,3,4,5]} />);
    // TODO: 適切なアサーションを追加
  });
});
