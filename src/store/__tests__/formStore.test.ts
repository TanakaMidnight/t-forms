import { useFormStore } from '../formStore';

describe('useFormStore', () => {
  it('初期状態を取得できる', () => {
    // TODO: Zustandのテスト実装
    expect(typeof useFormStore.getState).toBe('function');
  });
});
