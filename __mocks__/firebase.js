// __mocks__/firebase.js
// Jest用のFirebaseモック（auth, firestoreのみ必要な部分をモック）

export const auth = {};
export const db = {};

// firebase/authのonAuthStateChangedはHome.test.tsxで個別にモックされているため、ここでは不要
// firebase/firestoreの関数を全てダミー関数でエクスポート
export const collection = jest.fn();
export const addDoc = jest.fn();
export const setDoc = jest.fn();
export const doc = jest.fn();
export const getDocs = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const deleteDoc = jest.fn();
