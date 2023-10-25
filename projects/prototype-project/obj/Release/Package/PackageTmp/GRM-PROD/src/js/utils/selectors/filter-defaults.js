import { forOwn, isUndefined } from 'lodash';

function isDefined(val) {
  return val !== undefined;
}

function processNode(schemaNode, dataNode) {
  switch (schemaNode.type) {
    case 'object':
      return processObject(schemaNode, dataNode); // eslint-disable-line no-use-before-define

    case 'array':
      return processArray(schemaNode, dataNode); // eslint-disable-line no-use-before-define

    default:
      if (isDefined(dataNode)) {
        return dataNode;
      }
      if (isDefined(schemaNode.default)) {
        return schemaNode.default;
      }
      return undefined;
  }
}

function processObject(schemaNode, dataNode) {
  const result = {};

  forOwn(schemaNode.properties, (propertySchema, propertyName) => {
    const nodeValue = isDefined(dataNode) ? dataNode[propertyName] : undefined;
    result[propertyName] = processNode(propertySchema, nodeValue);
  });

  return result;
}

function processArray(schemaNode, dataNode) {
  if (isUndefined(dataNode)) {
    if (isDefined(schemaNode.default)) {
      return schemaNode.default;
    }
    return [];
  }

  const result = [];

  for (let i = 0; i < dataNode.length; i++) {
    result.push(processNode(schemaNode.items, dataNode[i]));
  }
  return result;
}

export function filterDefaults(data, schema) {
  return processNode(schema, data);
}
