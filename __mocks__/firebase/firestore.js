// __mocks__/firebase/firestore.js
// Jest用のfirebase/firestoreモック

export const collection = jest.fn();
export const addDoc = jest.fn();
export const setDoc = jest.fn();
export const doc = jest.fn();
export const getDocs = jest.fn(() => ({ forEach: jest.fn() }));
export const query = jest.fn();
export const where = jest.fn();
export const deleteDoc = jest.fn();
