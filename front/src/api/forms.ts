import axiosInstance from './axios';

export interface FormTemplateGroup {
  id: number;
  name: string;
  description: string;
  order: number;
  templateId: number;
}

export interface FormTemplateQuestion {
  id: number;
  type: 'SHORT_TEXT' | 'LONG_TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'STAR_RATING';
  label: string;
  order: number;
  required: boolean;
  options?: string[];
  groupId?: number;
  templateId?: number;
}

export interface FormTemplate {
  id: number;
  name: string;
  description: string;
  questions?: FormTemplateQuestion[];
  questionGroups?: FormTemplateGroup[];
}

export interface CreateFormsPayload {
  subjectId: number;
  templateId: number;
}

export interface CreateAnswerDto {
  questionId: number;
  value: any;
}

export interface CreateResponseDto {
  studentEmail: string;
  globalRating: number;
  formId: number;
  answers: CreateAnswerDto[];
}

export const fetchFormTemplates = async (): Promise<FormTemplate[]> => {
  const axios = axiosInstance();
  const { data } = await axios.get('/form-templates');
  return data;
};

export const fetchPublicForm = async (id: number | string) => {
  const axios = axiosInstance();
  const { data } = await axios.get(`/forms/public/${id}`);
  return data;
};

export const createSubjectForms = async (payload: CreateFormsPayload): Promise<void> => {
  const axios = axiosInstance();
  await Promise.all([
    axios.post('/forms', {
      type: 'DURING_COURSE',
      subjectId: payload.subjectId,
      templateId: payload.templateId,
    }),
    axios.post('/forms', {
      type: 'AFTER_COURSE',
      subjectId: payload.subjectId,
      templateId: payload.templateId,
    }),
  ]);
};

export const submitFormResponse = async (payload: CreateResponseDto) => {
  const axios = axiosInstance();
  const { data } = await axios.post('/responses', payload);
  return data;
};
