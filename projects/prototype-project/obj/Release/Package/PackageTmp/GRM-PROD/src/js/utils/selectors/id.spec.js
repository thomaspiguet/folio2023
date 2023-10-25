import { getId, invertThreeStateOption } from './id';

describe('id selectors', () => {
  describe('object id', () => {
    it('should return id of item', () => {
      const id='42';
      const converted = getId({id});
      expect(converted).toBe(id);
    });
    it('should return undefined if no id', () => {
      const converted = getId({});
      expect(converted).toBeUndefined();
    });
  });
  describe('invert 3-state option', () => {
    it('should return undefined for undefined', () => {
      const converted = invertThreeStateOption(undefined);
      expect(converted).toBeUndefined();
    });
    it('should return true for false', () => {
      const converted = invertThreeStateOption(false);
      expect(converted).toBe(true);
    });
    it('should return false for true', () => {
      const converted = invertThreeStateOption(true);
      expect(converted).toBe(false);
    });
  });
});
