import { isEmpty, isUndefined, isString, omitBy, forOwn } from 'lodash';
import { unformatNumber } from './currency';

function isDefined(val) {
  return val !== undefined;
}

const options = { decimal: '.' };

function processNumber(schema, data) {
  if (!isDefined(data) || data === '') {
    return undefined;
  }
  return unformatNumber(data, options);
}

function processString(schema, data) {
  if (isUndefined(data)) {
    return data;
  }
  if (!isString(data)) {
    return String(data);
  }
  return data;
}

function processDate(schema, data) {
  if (isUndefined(data) || data === '-') {
    return schema.default;
  }

  return data;
}

function processNode(schema, data) {
  switch (schema.type) {
    case 'object':
      return processObject(schema, data); // eslint-disable-line no-use-before-define

    case 'array':
      return processArray(schema, data); // eslint-disable-line no-use-before-define

    case 'number':
      return processNumber(schema, data);

    case 'string':
      return processString(schema, data);

    case 'date':
      return processDate(schema, data);

    default:
      return data;
  }
}

function processObject(schema, node) {

  const val = omitBy(node, isUndefined);
  if (isEmpty(val)) {
    return null;
  }

  const result = {};

  if (node) {
    forOwn(node, (propertyValue, propertyName) => {
      if (isDefined(propertyValue)) {
        result[propertyName] = propertyValue;
      }
    });
  }
  forOwn(schema.properties, (propertySchema, propertyName) => {
    if (propertySchema.required
      || (isDefined(node) && isDefined(node[propertyName]))) {
      const nodeValue = isUndefined(node) ? undefined : node[propertyName];
      result[propertyName] = processNode(propertySchema, nodeValue);
    }
  });

  return result;
}

function processArray(schema, data) {
  if (isUndefined(data)) {
    if (schema.default) {
      return schema.default;
    }

    return undefined;
  }

  const result = [];

  for (let i = 0; i < data.length; i++) {
    result.push(processNode(schema.items, data[i]));
  }
  return result;
}

export function normalizeToSave(obj, schema) {
  const newObj = processNode(schema, obj);
  return newObj;
}
