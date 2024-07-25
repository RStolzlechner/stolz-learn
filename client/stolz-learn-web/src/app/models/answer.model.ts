import { GUID } from '../types/guid.type';
import { DateTime } from '../types/date-time.type';

export interface Answer {
  id: GUID;
  questionId: GUID;
  questionnaireId: GUID;
  givenAnswer: string;
  isCorrect: boolean;
  dateCreate: DateTime;
}
