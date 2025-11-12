export type QuestionType = 'scale' | 'text' | 'choice';

export interface BaseQuestion {
  id: number;
  label: string;
  required?: boolean;
}

export interface ScaleQuestion extends BaseQuestion {
  type: 'scale';
  min: number;
  max: number;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholder?: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'choice';
  options: string[];
  multiple?: boolean;
}

export type Question = ScaleQuestion | TextQuestion | ChoiceQuestion;
