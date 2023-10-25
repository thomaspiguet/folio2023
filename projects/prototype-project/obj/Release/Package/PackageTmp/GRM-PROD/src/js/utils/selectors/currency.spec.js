import { unformatNumber } from './currency';

describe('currency', () => {
  describe('unformatNumber', () => {
    it('value:(1.1), sep:(.)', () => {
      const options = { decimal: '.' };
      const converted = unformatNumber('1.1', options);
      expect(converted).toBe(1.1);
    });

    it('value:(1,0000.00), sep:(.)', () => {
      const options = { decimal: '.' };
      const converted = unformatNumber('1,0000.00', options);
      expect(converted).toBe(10000.0);
    });

    it('value:(1.1), sep:(,)', () => {
      const options = { decimal: ',' };
      const converted = unformatNumber('1.1', options);
      expect(converted).toBe(1.1);
    });

    it('value:(1,000.00), sep:(,)', () => {
      const options = { decimal: ',' };
      const converted = unformatNumber('1,000.00', options);
      expect(converted).toBe(1000.0);
    });

    it('value:(100 000,00), sep:(,)', () => {
      const options = { decimal: ',' };
      const converted = unformatNumber('100 000,00', options);
      expect(converted).toBe(100000.0);
    });

    it('value:(100 000.00), sep:(,)', () => {
      const options = { decimal: ',' };
      const converted = unformatNumber('100 000.00', options);
      expect(converted).toBe(100000.0);
    });

    it('undefined value should return zero', () => {
      const options = { decimal: ',' };
      const converted = unformatNumber(undefined, options);
      expect(converted).toBe(0);
    });

  });
});
