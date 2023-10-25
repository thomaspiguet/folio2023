
import { convertToSave } from './required-attendance-dashboard';

describe('required attendance dashboard', () => {
  describe('convertToSave test', () => {
    const ref = 'ref1.fc1.Attendance';
    const key = 'sunday.day';
    const key2 = 'sunday.night';

    it('should fill one row for two cells', () => {
      const row = { sunday: { day: 1, night: 0, rotate: 0 }};
      const changedData = {
        [`${ ref }.${ key }`]: { value: 33, key, row, ref },
        [`${ ref }.${ key2 }`]: { value: 11, key: key2, row, ref },
      };
      const converted = convertToSave(changedData);
      expect(converted).toHaveLength(1);
      expect(converted[0]).toHaveProperty(['sunday', 'day'], 33);
      expect(converted[0]).toHaveProperty(['sunday', 'night'], 11);
      expect(converted[0]).toHaveProperty(['sunday', 'rotate'], 0);
    });

    it('should set null for empty cells', () => {
      const row = { sunday: { day: 1, night: 0, rotate: 0 }};
      const changedData = {
        [`${ ref }.${ key }`]: { value: '', key, row, ref },
        [`${ ref }.${ key2 }`]: { value: 11, key: key2, row, ref },
      };
      const converted = convertToSave(changedData);
      expect(converted).toHaveLength(1);
      expect(converted[0]).toHaveProperty(['sunday', 'day'], null);
      expect(converted[0]).toHaveProperty(['sunday', 'night'], 11);
      expect(converted[0]).toHaveProperty(['sunday', 'rotate'], 0);
    });

    it('should not save changes with empty row', () => {
      const row = { sunday: { day: 1, night: 0, rotate: 0 }};
      const changedData = {
        [`${ ref }.${ key }`]: { value: '', key,  ref },
      };
      const converted = convertToSave(changedData);
      expect(converted).toHaveLength(0);
    });
  });
});
