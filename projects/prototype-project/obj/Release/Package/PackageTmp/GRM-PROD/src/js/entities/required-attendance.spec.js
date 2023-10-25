import { convertToSave, convertCopyToSave } from './required-attendance';
import { JOB_TITLE_GROUP_TYPE_CODE, JOB_TITLE_TYPE_CODE } from './suggested-hourly-rate';

describe('required attendance model', () => {
  describe('convert to save', () => {

    const baseEntry = {
      groupType: { code: JOB_TITLE_TYPE_CODE },
      level: {
        suggestedHourlyRate: {
          rateOriginFunctionalCenter: {},
        },
        hoursPerDaySelected: {},
      },
    };

    it('should set empty funcCenter to null', () => {
      const entry = {
        ...baseEntry,
        functionalCenter: {},
      };
      const converted = convertToSave(entry);
      expect(converted.functionalCenter).toBeNull();
    });

    it('should set empty jobTitle to null', () => {
      const entry = {
        ...baseEntry,
        jobTitle: {},
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitle).toBeNull();
    });

    it('should set empty jobTitleGroup to null', () => {
      const entry = {
        ...baseEntry,
        jobTitleGroup: {},
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitleGroup).toBeNull();
    });

    it('should set empty union to null', () => {
      const entry = {
        ...baseEntry,
        union: {},
      };
      const converted = convertToSave(entry);
      expect(converted.union).toBeNull();
    });

    it('should clear jobTitleGroup if type is jobTitle', () => {
      const entry = {
        ...baseEntry,
        groupType: { code: JOB_TITLE_TYPE_CODE },
        jobTitle: { id: 1 },
        jobTitleGroup: { id: 2 },
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitleGroup).toBeNull();
      expect(converted.jobTitle).not.toBeNull();
      expect(converted.jobTitle.id).toBe(entry.jobTitle.id);
    });

    it('should clear jobTitle if type is jobTitleGroup', () => {
      const entry = {
        ...baseEntry,
        groupType: { code: JOB_TITLE_GROUP_TYPE_CODE },
        jobTitle: { id: 1 },
        jobTitleGroup: { id: 2 },
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitle).toBeNull();
      expect(converted.jobTitleGroup).not.toBeNull();
      expect(converted.jobTitleGroup.id).toBe(entry.jobTitleGroup.id);
    });

    it('should clear specificHoursPerDay if type is jobTitle', () => {
      const entry = {
        ...baseEntry,
        level: {
          ...baseEntry.level,
          specificHoursPerDay: 7.5,
          hoursPerDaySelected: { value: 1 },
        },
        groupType: { code: JOB_TITLE_TYPE_CODE },
      };
      const converted = convertToSave(entry);
      expect(converted.level.specificHoursPerDay).toBeNull();
      expect(converted.level.hoursPerDaySelected).not.toBeNull();
      expect(converted.level.hoursPerDaySelected.value).toBe(entry.level.hoursPerDaySelected.value);
    });

    it('should clear hoursPerDaySelected if type is jobTitleGroup', () => {
      const entry = {
        ...baseEntry,
        level: {
          ...baseEntry.level,
          specificHoursPerDay: 7.5,
          hoursPerDaySelected: { value: 1 },
        },
        groupType: { code: JOB_TITLE_GROUP_TYPE_CODE },
      };
      const converted = convertToSave(entry);
      expect(converted.level.hoursPerDaySelected).toBeNull();
      expect(converted.level.specificHoursPerDay).not.toBeNull();
      expect(converted.level.specificHoursPerDay).toBe(entry.level.specificHoursPerDay);
    });

    it('should set specificHoursPerDay if type is jobTitleGroup', () => {
      const entry = {
        ...baseEntry,
        level: {
          ...baseEntry.level,
          specificHoursPerDay: undefined,
          hoursPerDaySelected: { value: 1 },
        },
        groupType: { code: JOB_TITLE_GROUP_TYPE_CODE },
      };
      const converted = convertToSave(entry);
      expect(converted.level.hoursPerDaySelected).toBeNull();
      expect(converted.level.specificHoursPerDay).not.toBeNull();
      expect(converted.level.specificHoursPerDay).toBe(entry.level.hoursPerDaySelected.value);
    });
  });

  describe('convert copy to save', () => {

    const baseEntry = {
      groupType: { code: JOB_TITLE_TYPE_CODE },
    };

    it('should set empty jobTitle to null', () => {
      const entry = {
        ...baseEntry,
        jobTitle: {},
      };
      const converted = convertCopyToSave(entry);
      expect(converted.jobTitle).toBeNull();
    });

    it('should set empty jobTitleGroup to null', () => {
      const entry = {
        ...baseEntry,
        jobTitleGroup: {},
      };
      const converted = convertCopyToSave(entry);
      expect(converted.jobTitleGroup).toBeNull();
    });

    it('should clear jobTitleGroup if type is jobTitle', () => {
      const entry = {
        ...baseEntry,
        groupType: { code: JOB_TITLE_TYPE_CODE },
        jobTitle: { id: 3 },
        jobTitleGroup: { id: 4 },
      };
      const converted = convertCopyToSave(entry);
      expect(converted.jobTitleGroup).toBeNull();
      expect(converted.jobTitle).not.toBeNull();
      expect(converted.jobTitle.id).toBe(entry.jobTitle.id);
    });

    it('should clear jobTitle if type is jobTitleGroup', () => {
      const entry = {
        ...baseEntry,
        groupType: { code: JOB_TITLE_GROUP_TYPE_CODE },
        jobTitle: { id: 5 },
        jobTitleGroup: { id: 6 },
      };
      const converted = convertCopyToSave(entry);
      expect(converted.jobTitle).toBeNull();
      expect(converted.jobTitleGroup).not.toBeNull();
      expect(converted.jobTitleGroup.id).toBe(entry.jobTitleGroup.id);
    });

  });
});
