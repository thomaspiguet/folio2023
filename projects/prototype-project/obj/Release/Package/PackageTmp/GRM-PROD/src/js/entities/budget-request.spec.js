import '../test/mock-appinsight';
import {
  convertToSave,
} from './budget-request';

import { JOB_TITLE_GROUP_TYPE_CODE, JOB_TITLE_TYPE_CODE } from './suggested-hourly-rate';

describe('budget request model', () => {
  describe('convert to save', () => {
    it('should set empty type to null', () => {
      const entry = {
        type: {}
      };
      const converted = convertToSave(entry);
      expect(converted.type).toBeNull();
    });

    it('should set empty funcCenter to null', () => {
      const entry = {
        functionalCenter: {}
      };
      const converted = convertToSave(entry);
      expect(converted.functionalCenter).toBeNull();
    });

    it('should set empty jobTitle to null', () => {
      const entry = {
        jobTitle: {}
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitle).toBeNull();
    });

    it('should set empty jobTitleGroup to null', () => {
      const entry = {
        jobTitleGroup: {}
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitleGroup).toBeNull();
    });

    it('should set empty union to null', () => {
      const entry = {
        union: {}
      };
      const converted = convertToSave(entry);
      expect(converted.union).toBeNull();
    });

    it('should clear jobTitleGroup if type is jobTitle', () => {
      const entry = {
        type: {code: JOB_TITLE_TYPE_CODE},
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
        type: {code: JOB_TITLE_GROUP_TYPE_CODE},
        jobTitle: { id: 1 },
        jobTitleGroup: { id: 2 },
      };
      const converted = convertToSave(entry);
      expect(converted.jobTitle).toBeNull();
      expect(converted.jobTitleGroup).not.toBeNull();
      expect(converted.jobTitleGroup.id).toBe(entry.jobTitleGroup.id);
    });

  });
});
