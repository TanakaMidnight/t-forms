export interface Option {
  id: string;
  text: string;
}

export type QuestionType = 'text' | 'radio' | 'checkbox' | 'email' | 'rating';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  isRequired?: boolean; // 必須項目を追加
  // email型の場合、バリデーション等はUI側で対応
  // rating型の場合、optionsは空配列でOK
}

export interface Answer {
  questionId: string;
  text?: string; // text, email型で利用
  selectedOptions?: string[];
  ratingValue?: number; // rating型で利用
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  ownerUid: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Answer[];
  formOwnerUid: string;
}
