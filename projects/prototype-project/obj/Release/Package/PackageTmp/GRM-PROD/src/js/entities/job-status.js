import { codeDescriptionSchema } from './code-description';

export const jobStatusSchema = codeDescriptionSchema;

export function isPartTime(jobStatus) {
  if (!jobStatus) {
    return false;
  }

  const { codeDescription } = jobStatus;
  return ['PartialTimeRegular', 'PartialTimeTemporary', 'PartialTimeCasual'].indexOf(codeDescription) >= 0;
}
