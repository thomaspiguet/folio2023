import { dateSchema, numberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';

export const temporaryClosuresSchema = {
  id: numberSchema,
  sequence: numberSchema,
  workShift: codeDescriptionSchema,
  startDate: dateSchema,
  endDate: dateSchema,
  nbDayForSunday: numberSchema,
  nbDayForMonday: numberSchema,
  nbDayForTuesday: numberSchema,
  nbDayForWednesday: numberSchema,
  nbDayForThursday: numberSchema,
  nbDayForFriday: numberSchema,
  nbDayForSaturday: numberSchema,
  journal: stringSchema,
};
