import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import FormCreate from '../FormCreate';
import { MemoryRouter } from 'react-router-dom';

// Firebase, Zustandのstoreをモック
jest.mock('../../../firebase', () => ({ auth: { currentUser: { uid: 'user1' } } }));
const addFormMock = jest.fn();
const updateFormMock = jest.fn();
jest.mock('../../../store/formStore', () => ({
  useFormStore: () => ({ addForm: addFormMock, updateForm: updateFormMock })
}));

describe('FormCreate', () => {
  beforeEach(() => {
    addFormMock.mockClear();
    updateFormMock.mockClear();
    window.alert = jest.fn();
  });

  it('タイトル・説明・質問入力欄が表示される', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    expect(screen.getByRole('textbox', { name: 'フォームタイトル' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'フォーム説明' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '質問' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '質問を追加' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  it('タイトル・説明を入力できる', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    const titleInput = screen.getByRole('textbox', { name: 'フォームタイトル' });
    const descInput = screen.getByRole('textbox', { name: 'フォーム説明' });
    fireEvent.change(titleInput, { target: { value: '新しいタイトル' } });
    fireEvent.change(descInput, { target: { value: '説明文' } });
    expect((titleInput as HTMLInputElement).value).toBe('新しいタイトル');
    expect((descInput as HTMLInputElement).value).toBe('説明文');
  });

  it('質問を追加できる', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    const addBtn = screen.getByRole('button', { name: '質問を追加' });
    fireEvent.click(addBtn);
    // 質問欄が2つになる
    expect(screen.getAllByRole('textbox', { name: '質問' }).length).toBe(2);
  });

  it('質問テキストを編集できる', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    const qInput = screen.getByRole('textbox', { name: '質問' });
    fireEvent.change(qInput, { target: { value: '好きな色は？' } });
    expect((qInput as HTMLInputElement).value).toBe('好きな色は？');
  });

  it('必須スイッチを切り替えできる', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    const switchInput = screen.getByRole('checkbox', { name: '必須' }); // ここはそのまま
    expect((switchInput as HTMLInputElement).checked).toBe(false);
    fireEvent.click(switchInput);
    expect((switchInput as HTMLInputElement).checked).toBe(true);
  });

  it('タイトル未入力で保存時はアラート', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    const saveBtn = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveBtn);
    expect(window.alert).toHaveBeenCalledWith('フォームのタイトルは必須です');
    expect(addFormMock).not.toHaveBeenCalled();
  });

  it('質問未入力で保存時はアラート', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'フォームタイトル' }), { target: { value: 'タイトル' } });
    fireEvent.change(screen.getByRole('textbox', { name: '質問' }), { target: { value: '' } });
    const saveBtn = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveBtn);
    expect(window.alert).toHaveBeenCalledWith('すべての質問に名前を入力してください');
    expect(addFormMock).not.toHaveBeenCalled();
  });

  it('正しく入力して保存時はaddFormが呼ばれる', () => {
    render(
      <MemoryRouter>
        <FormCreate />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'フォームタイトル' }), { target: { value: 'タイトル' } });
    fireEvent.change(screen.getByRole('textbox', { name: '質問' }), { target: { value: 'Q1' } });
    const saveBtn = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveBtn);
    expect(addFormMock).toHaveBeenCalled();
  });
});
