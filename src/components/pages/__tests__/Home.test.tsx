import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// onAuthStateChangedのグローバルモック（__mocks__/firebase/auth.js）を利用
const onAuthStateChangedMock = require('firebase/auth').onAuthStateChanged;

describe('Home', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ホーム画面が表示される（未ログイン）', async () => {
    onAuthStateChangedMock.mockImplementation((_auth: any, callback: any) => {
      callback(null); // 未ログイン
      return () => {};
    });
    const Home = require('../Home').default;
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('welcome_title')).toBeInTheDocument();
    });
  });

  it('ホーム画面が表示される（ログイン済み）', async () => {
    onAuthStateChangedMock.mockImplementation((_auth: any, callback: any) => {
      callback({ displayName: 'Test User', uid: 'uid' }); // ログイン
      return () => {};
    });
    const Home = require('../Home').default;
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('welcome_title')).toBeInTheDocument();
    });
    // displayNameが表示されるUIがあれば下記を有効化
    // expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
