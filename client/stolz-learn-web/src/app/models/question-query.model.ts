import { GUID } from '../types/guid.type';

export interface QuestionQuery {
  courseId: GUID;
  randomOrder: boolean;
  limit: number;
}
