import { GUID } from '../types/guid.type';

export interface QuestionDataPoint {
  id: GUID;
  totalAnswerCnt: number;
  correctAnswerCnt: number;
  correctAnswerPercent: number;
}
