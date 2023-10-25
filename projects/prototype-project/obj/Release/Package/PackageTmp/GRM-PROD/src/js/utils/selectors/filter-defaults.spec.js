import { isArray } from 'lodash';

import { filterDefaults } from './filter-defaults';
import { codeDescriptionSchema } from '../../entities/code-description';
import { stringSchema } from '../../entities/base';

describe('filter defaults', () => {
  describe('object', () => {
    const schema = {
      type: 'object',
      properties: {
        type: codeDescriptionSchema,
        name: stringSchema,
      },
    };

    it('should make a deep copy ob object', () => {
      const typeObj = {};
      const entry = {
        type: typeObj,
      };
      const converted = filterDefaults(entry, schema);
      expect(converted).not.toBe(entry);
      expect(converted.type).not.toBe(entry.type);
    });

    it('should keep empty obj', () => {
      const entry = {
        type: {},
      };
      const converted = filterDefaults(entry, schema);
      expect(converted.type).toBeDefined();
    });

    it('should keep non-empty obj', () => {
      const type = {id: 0};
      const entry = {
        type,
      };
      const converted = filterDefaults(entry, schema);
      expect(converted.type.id).toBe(type.id);
    });

    it('should remove non-schema prop', () => {
      const entry = {
        extra: 'asdf',
      };
      const converted = filterDefaults(entry, schema);
      expect(converted.extra).toBeUndefined();
    });

    it('should add default array', () => {
      const entry = { };
      const schema = {
        type: 'object',
        properties: {
          names: { type: 'array', items: stringSchema },
        },
      };
      const converted = filterDefaults(entry, schema);
      expect(isArray(converted.names)).toBeTruthy();
    });

  });
});
