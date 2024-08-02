import { GUID } from '../types/guid.type';
import { DateTime } from '../types/date-time.type';

export interface Course {
  id: GUID;
  number: string;
  name: string;
  dateCreate: DateTime;
  inArchive: boolean;
}
