import { GUID } from '../types/guid.type';
import { DateTime } from '../types/date-time.type';
import { Answer } from './answer.model';

export interface Questionnaire {
  id: GUID;
  courseId: GUID;
  dateCreate: DateTime;
  answers: Answer[];
}
