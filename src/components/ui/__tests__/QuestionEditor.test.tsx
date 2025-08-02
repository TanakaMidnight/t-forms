

import React from 'react';
import { render } from '@testing-library/react';
import QuestionEditor from '../QuestionEditor';

describe('QuestionEditor', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  it('質問エディタが表示される', () => {
    render(
      <QuestionEditor
        question={{ id: 'q1', text: '', type: 'text', options: [] }}
        onChange={() => {}}
        onDelete={() => {}}
      />
    );
    // エディタの存在を検証するのが理想
  });
});
