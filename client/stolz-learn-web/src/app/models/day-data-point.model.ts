import { DateTime } from '../types/date-time.type';
import { QuestionDataPoint } from './question-data-point.model';

export interface DayDataPoint {
  date: DateTime;
  questionDataPoints: QuestionDataPoint[];
  questionCnt: number;
  correctCnt: number;
}
