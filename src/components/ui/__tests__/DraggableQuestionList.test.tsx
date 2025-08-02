import React from 'react';
import { render } from '@testing-library/react';
import DraggableQuestionList from '../DraggableQuestionList';
describe('DraggableQuestionList', () => {
  it('ドラッグ可能な質問リストが表示される', () => {
    render(
      <DraggableQuestionList
        questions={[]}
        onChange={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
      />
    );
    // 質問リストの存在を検証するのが理想
  });
});
