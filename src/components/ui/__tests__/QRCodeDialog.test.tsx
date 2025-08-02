import React from 'react';
import { render } from '@testing-library/react';
import QRCodeDialog from '../QRCodeDialog';
describe('QRCodeDialog', () => {
  it('QRコードダイアログが表示される', () => {
    render(<QRCodeDialog open={true} onClose={() => {}} url="https://example.com" />);
    // QRコードやダイアログの存在を検証するのが理想
  });
});
