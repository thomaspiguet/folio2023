import {
  convertFunctionalCenter,
  isEmptyObject, makeArray, omitUndefinedProps, omitZeroIdObjects,
} from './utils';

describe('utils', () => {
  describe('convertFunctionalCenter', () => {
    it('should convert functional centers to a proper format', () => {
      const input = [
        '001171600001',
        '001171 600002',
        '001171600003'
      ];

      const expected = [
        '001171 600001',
        '001171 600002',
        '001171 600003'
      ];

      input.forEach((fc, index) => {
        expect(convertFunctionalCenter(fc)).toBe(expected[index]);
      });
    });

    it('should convert account numbers to a proper format', () => {
      const input = [
        '001171699999   69999',
        '0011719999     205',
        '0011710001529  67510'
      ];

      const expected = [
        '001171 699999 69999',
        '001171 9999 205',
        '001171 0001529 67510'
      ];

      input.forEach((an, index) => {
        expect(convertFunctionalCenter(an)).toBe(expected[index]);
      });
    });
  });
  describe('isEmptyObject', () => {
    it('should be true for no keys object', () => {
      expect(isEmptyObject({})).toBeTruthy();
    });
    it('should be false for one field', () => {
      expect(isEmptyObject({a: 1})).toBeFalsy();
    });
    it('should be true for keys with undefined value', () => {
      expect(isEmptyObject({a: undefined})).toBeTruthy();
    });
    it('should be true for keys with null value', () => {
      expect(isEmptyObject({a: null})).toBeTruthy();
    });
    it('should be false for 0 value', () => {
      expect(isEmptyObject({a: 0})).toBeFalsy();
    });
    it('should be true for empty array value', () => {
      expect(isEmptyObject({a: []})).toBeTruthy();
    });
    it('should be true for non-empty array value', () => {
      expect(isEmptyObject({a: [1]})).toBeFalsy();
    });
    it('should be true for undefined value', () => {
      expect(isEmptyObject(undefined)).toBeTruthy();
    });
    it('should be true for null value', () => {
      expect(isEmptyObject(null)).toBeTruthy();
    });
    it('should be true for empty string value', () => {
      expect(isEmptyObject({a: ''})).toBeTruthy();
    });
  });
  describe('omitUndefinedProps', () => {
    it('should omit empty prop', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: undefined});
      expect(converted).not.toHaveProperty('extra');
      expect(converted).toHaveProperty('name', 'asdf');
    });
    it('should not omit non-empty prop', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: 'qwer'});
      expect(converted).toHaveProperty('name', 'asdf');
      expect(converted).toHaveProperty('extra', 'qwer');
    });
    it('should omit empty array prop', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: []});
      expect(converted).not.toHaveProperty('extra');
      expect(converted).toHaveProperty('name', 'asdf');
    });
    it('should not omit non-empty array prop', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: [1]});
      expect(converted).toHaveProperty('extra');
      expect(converted).toHaveProperty('name', 'asdf');
    });
    it('should omit empty string', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: ''});
      expect(converted).not.toHaveProperty('extra');
      expect(converted).toHaveProperty('name', 'asdf');
    });
    it('should omit null prop', () => {
      const converted = omitUndefinedProps({name:'asdf', extra: null});
      expect(converted).not.toHaveProperty('extra');
      expect(converted).toHaveProperty('name', 'asdf');
    });
  });
  describe('omitZeroIdObjects', () => {
    it('should omit zero id obj', () => {
      const converted = omitZeroIdObjects({ name:'asdf', obj: {id: 0, extra: 'asdf'} });
      expect(converted).not.toHaveProperty('obj');
      expect(converted).toHaveProperty('name', 'asdf');
    });
    it('should not omit non-zero id obj', () => {
      const converted = omitZeroIdObjects({ name:'asdf', obj: {id: 1, extra: 'asdf'} });
      expect(converted).toHaveProperty('obj');
      expect(converted).toHaveProperty('name', 'asdf');
    });
  });

  describe('makeArray', () => {
    it('should keep array', () => {
      const obj = ['a'];
      const converted = makeArray(obj);
      expect(converted).toBe(obj);
    });
    it('should keep empty array', () => {
      const obj = [];
      const converted = makeArray(obj);
      expect(converted).toBe(obj);
    });
    it('should make an empty for undefined', () => {
      const obj = undefined;
      const converted = makeArray(obj);
      expect(converted).toEqual([]);
    });
    it('should make an empty for null', () => {
      const obj = null;
      const converted = makeArray(obj);
      expect(converted).toEqual([]);
    });
    it('should make array from non-array object', () => {
      const obj = 'a';
      const converted = makeArray(obj);
      expect(converted).toEqual(['a']);
    });
  });
});
