import { create } from 'zustand';
import type { Form, FormResponse } from '../types';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export type FormState = {
  forms: Form[];
  responses: FormResponse[];
  addForm: (form: Form) => Promise<void>;
  addResponse: (response: FormResponse) => Promise<void>;
  updateForm: (updatedForm: Form) => Promise<void>;
  deleteForm: (formId: string) => Promise<void>;
  fetchForms: (uid: string) => Promise<void>;
  fetchResponses: (formId: string) => Promise<void>;
};

export const useFormStore = create<FormState>()((set) => ({
  forms: [],
  responses: [],
  addForm: async (form: Form) => {
    const docRef = doc(db, 'forms', form.id);
    await setDoc(docRef, form);
    // フォーム追加後はfetchFormsで最新を取得するため、ここでローカルstateにpushしない
  },
  updateForm: async (updatedForm: Form) => {
    const docRef = doc(db, 'forms', updatedForm.id);
    await setDoc(docRef, updatedForm);
    set((state: FormState) => ({
      forms: state.forms.map((form: Form) =>
        form.id === updatedForm.id ? updatedForm : form
      ),
    }));
  },
  deleteForm: async (formId: string) => {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'forms', formId);
    await deleteDoc(docRef);
    set((state: FormState) => ({ forms: state.forms.filter((f: Form) => f.id !== formId) }));
  },
  addResponse: async (response: FormResponse) => {
    await addDoc(collection(db, 'responses'), response);
    set((state: FormState) => ({ responses: [...state.responses, response] }));
  },
  fetchForms: async (uid: string) => {
    const q = query(collection(db, 'forms'), where('ownerUid', '==', uid));
    const snap = await getDocs(q);
    const forms: Form[] = [];
    snap.forEach((doc) => forms.push(doc.data() as Form));
    set((state: FormState) => ({ ...state, forms }));
  },
  fetchResponses: async (formId: string) => {
    // 現在のユーザー（フォーム作成者）のUIDを取得
    const user = auth.currentUser;
    if (!user) {
      set((state: FormState) => ({ ...state, responses: [] }));
      return;
    }
    // formIdとformOwnerUid両方で絞り込む
    const q = query(
      collection(db, 'responses'),
      where('formId', '==', formId),
      where('formOwnerUid', '==', user.uid)
    );
    const snap = await getDocs(q);
    const responses: FormResponse[] = [];
    snap.forEach((doc) => responses.push(doc.data() as FormResponse));
    set((state: FormState) => ({ ...state, responses }));
  },
}));
