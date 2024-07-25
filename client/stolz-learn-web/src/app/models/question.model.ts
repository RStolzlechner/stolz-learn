import { GUID } from '../types/guid.type';
import { DateTime } from '../types/date-time.type';

export interface Question {
  id: GUID;
  courseId: GUID;
  number: number;
  questionText: string;
  correctAnswer: string;
  dateCreate: DateTime;
  deleted: boolean;
}
