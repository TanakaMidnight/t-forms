// jsdomのHTMLCanvasElement.getContext未実装によるconsole.error抑制
if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
  try {
    window.HTMLCanvasElement.prototype.getContext = () => null;
  } catch {
    // エラーを無視
  }
}
import '@testing-library/jest-dom';
import React from 'react';
import type { ComponentType } from 'react';

// ResizeObserverモック（recharts等のテスト用）
const ResizeObserverMock = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
if (typeof global !== 'undefined' && typeof (global as Record<string, unknown>).ResizeObserver === 'undefined') {
  (global as Record<string, unknown>).ResizeObserver = ResizeObserverMock;
}

// initReactI18nextの代わりにダミー3rdPartyプラグインでNO_I18NEXT_INSTANCE警告を抑制
import i18n from 'i18next';
const dummyI18n = i18n.createInstance();
dummyI18n.use({ type: '3rdParty', init() {} }).init({
  lng: 'ja',
  fallbackLng: 'ja',
  resources: {},
});

// t関数本体を日本語訳辞書で返すように修正
const jaDict: Record<string, string> = {
  form_title: 'フォームタイトル',
  form_description: 'フォーム説明',
  question: '質問',
  add_question: '質問を追加',
  save_form: '保存',
  required: '必須',
  create_new_form: '新しいフォーム作成',
};
const tFunc = (key: string) => jaDict[key] || key;
tFunc.i18n = dummyI18n;
const tProxy = new Proxy(tFunc, {
  get(target, prop: string | symbol) {
    if (prop === 't') return target;
    if (prop === 'i18n') return dummyI18n;
    return undefined;
  },
  apply(target, _thisArg, args: [string]) {
    return target(args[0]);
  },
});

// react-i18nextのuseTranslation, withTranslationをグローバルモック（テスト時のconsole.warn抑制）
jest.mock('react-i18next', () => {
  const withTranslation = () => (Component: ComponentType) => {
    return function WrapperComponent(props: Record<string, unknown>) {
      return React.createElement(Component, { ...props, t: tFunc } as React.ComponentProps<ComponentType>);
    };
  };
  return {
    useTranslation: () => ({ t: tProxy, i18n: dummyI18n }),
    withTranslation,
    Trans: ({ children }: { children: React.ReactNode }) => children,
  };
});

// i18n.tsをテスト時は空モジュールにモック
jest.mock('./i18n', () => ({}));
if (typeof window !== 'undefined' && typeof (window as unknown as Record<string, unknown>).ResizeObserver === 'undefined') {
  (window as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverMock;
}
if (typeof globalThis !== 'undefined' && typeof (globalThis as unknown as Record<string, unknown>).ResizeObserver === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverMock;
}
