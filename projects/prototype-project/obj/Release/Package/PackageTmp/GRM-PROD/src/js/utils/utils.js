import md5 from 'md5';
import removeAccents from 'remove-accents';
import {
  each,
  every,
  filter,
  find,
  get,
  isArray,
  isDate,
  isEmpty,
  isEqual,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  keys,
  map,
  omitBy,
  padStart,
  set,
  transform,
  union,
} from 'lodash';

import { accessElement, setAccessor, setByPathAccessor } from './selectors/currency';

export function isEmptyField(value) {
  return value === '' || value === undefined || value === null;
}

export function isEmptyOrDash(value) {
  return value === '' || value === undefined || value === null || value === '-';
}

export function calculateHash(filter) {
  return md5(JSON.stringify(filter));
}

export function removeLastPath(path) {
  return path.substr(0, path.lastIndexOf('/'));
}

export function removeLastOccurrence(path, occurrence) {
  return path.substr(0, path.lastIndexOf(occurrence));
}

export const rootHash = calculateHash([]);

export function buildFilter(filters) {
  const filter = {};
  each(filters, ({ name, value }) => {
    setByPathAccessor(filter, value, name);
  });
  return filter;
}

export function setHashRef(parentHash, hash, groupData, filters) {
  if (parentHash !== hash) {
    const parentGroup = groupData[parentHash];
    if (parentGroup) {
      const filter = buildFilter(filters);
      const row = find(parentGroup.data, filter);
      if (row) {
        row._hash = hash;
      }
    }
  }
}

export function convertGroupData(filters, groupId, data) {
  return map(data, (values) => {
    const row = { _expanded: false };
    setAccessor(row, values, groupId);
    each(filters, ({ name, value }) => {
      setAccessor(row, value, name);
    });
    return row;
  });
}

function fillColumnInfo(columnsData, columnGroup) {
  const { id, visible, expanded } = columnGroup;
  const hidden = !visible;
  const collapsed = expanded === false;
  if (hidden || collapsed) {
    columnsData[id] = { hidden, collapsed };
  } else {
    delete columnsData[id];
  }
}

export function fillColumnsInfo(columnsData, columns) {
  each(columns, (columnGroup) => {
    fillColumnInfo(columnsData, columnGroup);
    each(columnGroup.columns, (column) => {
      fillColumnInfo(columnsData, column);
    });
  });
}

function fillDefaultCostomizedColumn(columnsData, columnGroup) {
  const { id, hiddenByDefault, expanded } = columnGroup;
  const collapsed = expanded === false;
  if (hiddenByDefault || collapsed) {
    columnsData[id] = { hidden: hiddenByDefault, collapsed };
  } else {
    delete columnsData[id];
  }
}

function fillDefaultCostomizedColumns(columnsData, columns) {
  each(columns, (columnGroup) => {
    fillDefaultCostomizedColumn(columnsData, columnGroup);
    each(columnGroup.columns, (column) => {
      fillDefaultCostomizedColumn(columnsData, column);
    });
  });
}

export function getDefaultCostomizedColumns(columns) {
  const columnsData = {};
  fillDefaultCostomizedColumns(columnsData, columns.columnsFixed);
  fillDefaultCostomizedColumns(columnsData, columns.columnsScrolled);
  return columnsData;
}


export function fillGroupRows(rows, dataGroups, hash, emptyRow, parentRow) {
  const rootGroup = dataGroups[hash];
  if (!rootGroup) {
    return;
  }

  const { data, filters, groupId, isLoading } = rootGroup;
  if (parentRow) {
    parentRow.isLoading = isLoading;
  }
  each(data, (groupRow) => {
    const row = { ...emptyRow, ...groupRow, hash, groupId };
    each(filters, ({ name, value }) => {
      setByPathAccessor(row, value, name);
      row[name] = value;
    });
    rows.push(row);
    if (row._hash && row._expanded) {
      fillGroupRows(rows, dataGroups, row._hash, emptyRow, row);
    }
  });
}

export function buildExpandParameters(groups, original, groupId) {
  const filters = [];
  let isLast = false;
  let nextGroup;
  each(groups, (column) => {
    const name = column.groupId;
    if (isLast) {
      nextGroup = column;
      return false;
    }
    if (groupId === name) {
      isLast = true;
    }
    const value = accessElement(original, name);
    filters.push({ name, value });
    return true;
  });
  const groupBy = accessElement(original, groupId);
  return { filters, nextGroup, groupBy };
}

export function convertFunctionalCenter(fc) {
  if (!fc) {
    return '';
  }
  const splittedBySpaces = fc.split(' ');
  const resultStrings = [];
  splittedBySpaces.forEach((item) => {
    if (item === '') {
      return;
    }
    if (item.length > 6) {
      resultStrings.push(item.substr(0, 6));
      resultStrings.push(item.substr(6));
      return;
    }
    resultStrings.push(item);
  });

  return resultStrings.join(' ');
}

export function getCustomColumn(column, columnsInfo) {
  const { id, intlId, title, intlValues, isLink, grouped } = column;
  const info = columnsInfo ? columnsInfo[id] : undefined;
  return {
    id,
    intlId,
    intlValues,
    isLink,
    grouped,
    label: title,
    visible: info ? !info.hidden : true,
    expanded: info ? !info.collapsed : true,
  };
}

export function getCustomColumnGroup(columnGroups, columnsInfo) {
  return map(columnGroups, (columnGroup) => {
    return {
      ...getCustomColumn(columnGroup, columnsInfo),
      columns: map(columnGroup.columns, column => getCustomColumn(column, columnsInfo)),
    };
  });
}

export function applyCustomColumns(columnsGroups, customColumnsGroups) {
  const dstColumns = [];
  each(columnsGroups, (group) => {
    const customGroup = find(customColumnsGroups, { id: group.id });
    if (customGroup) {
      const dstGroup = { ...group, columns: [] };
      dstColumns.push(dstGroup);
      each(group.columns, (column) => {
        const customColumn = find(customGroup.columns, { id: column.id });
        if (customColumn && customColumn.visible || column.isLink) {
          dstGroup.columns.push({ ...column });
        }
      });
    }
  });
  return dstColumns;
}

export function makeSearchString(str) {
  return removeAccents(`${ str }`.toLowerCase().replace(/ /g, ''));
}

export function setNull(obj, path) {
  const val = omitBy(get(obj, path), isUndefined);
  if (isEmpty(val)) {
    set(obj, path, null);
  }
}

export function isZeroId(id) {
  return !id || id === '0';
}

export function addScenarioIdToRoute(route, scenarioId) {
  return route.replace(':scenarioId', scenarioId);
}

export function addScenarioAndIdToRoute(route, scenarioId, id) {
  return route.replace(':scenarioId', scenarioId).replace(':id', id);
}

export function increaseFieldVersion(state, key) {
  let value = state.entry.version[key];
  return {
    ...state.entry.version,
    [key]: isUndefined(value) ? 0 : ++value,
  };
}

export function increaseStateVersion(instance) {
  let { version } = instance.state;
  ++version;
  instance.setState({ version });
}

export function isEmptyObject(value) {
  if (isObject(value)) {
    return every(value, (value, key) => {
      return (value === undefined
        || value === null
        || value === ''
        || isArray(value) && value.length === 0);
    });
  } else if (isNull(value)) {
    return true;
  }
  return isUndefined(value);
}

export function nullifyIfEmpty(field) {
  if (isEmptyObject(field)) {
    return null;
  }
  return field;
}

export function objDiff(o1, o2) {
  const allKeys = union(keys(o1), keys(o2));
  const changedKeys = filter(allKeys, (key) => !isEqual(o1[key], o2[key]));
  const diff = {};
  each(changedKeys, (key) => {
    diff[key] = { old: o1[key], new: o2[key] };
  });
  return isEmpty(diff) ? null : diff;
}

export function isInvalidDate(value) {
  return isNaN(Date.parse(value));
}

export function isFullInvalidDate(value) {
  if (isInvalidDate(value)) {
    return true;
  } else if (isString(value)) {
    if (value.length === 0) {
      return false;
    }
    return value.length !== 10;
  }
  return false;
}

export function formatDate(valueP) {
  let value = valueP;
  if (isString(value)) {
    if (value.length < 10) {
      return value;
    }
    value = new Date(value);
  } else if (!isDate(value)) {
    return '';
  }
  if (isInvalidDate(value)) {
    if (isUndefined(valueP) || isNull(valueP)) {
      return '';
    }
    return valueP.toString();
  }
  const year = value.getFullYear();
  const month = value.getMonth();
  const day = value.getDate();
  return `${ year }-${ padStart(month + 1, 2, '0') }-${ padStart(day, 2, '0') }`;
}


export function unformatDate(value, defaultValue = '') {
  if (isDate(value)) {
    return value;
  } else if (isString(value) || isNumber(value)) {
    const result = new Date(value);
    return isInvalidDate(result) ? defaultValue : result;
  }

  return defaultValue;
}

const PREVIOUS_FINANCIAL_YEAR = 1;
const FINANCIAL_YEAR_START = '-04-01';
const FINANCIAL_YEAR_END = '-03-31';

export function getFinancialYearStartDate(year) {
  return `${ year - PREVIOUS_FINANCIAL_YEAR }${ FINANCIAL_YEAR_START }`;
}

export function getFinancialYearEndDate(year) {
  return `${ year }${ FINANCIAL_YEAR_END }`;
}

export function transferPropToState(instance, props, propName) {
  const oldProp = instance.state[propName];
  const newProp = props[propName];
  if (!isUndefined(newProp) && newProp !== oldProp) {
    instance.setState({ [propName]: newProp });
  }
}

export function transferPropsToState(instance, props, propNames) {
  each(propNames, (propName) => { transferPropToState(instance, props, propName); });
}

export function omitUndefinedProps(props) {
  return omitBy(props, (prop) => (isUndefined(prop) || prop === '' || prop === null || isArray(prop) && !prop.length));
}

export function omitZeroIdObjects(props) {
  return omitBy(props, (prop) => (isObject(prop) && prop.id === 0));
}

export function difference(object, base, maxLevel = 10) {
  if (maxLevel < 1) {
    return null;
  }
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key], maxLevel - 1) : value;
    }
  });
}

export function isFunction(object) {
  return (typeof object === 'function');
}

export function makeArray(obj) {
  if (isArray(obj)) {
    return obj;
  } else if (isUndefined(obj) || isNull(obj)) {
    return [];
  }
  return [obj];
}
