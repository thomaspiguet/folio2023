import { createSelector } from 'reselect';
import { isUndefined, isArray, each, isString, isNumber, isEmpty, isNaN, isObject } from 'lodash';
import accounting from 'accounting';

export const getCurrencyOptions = createSelector(
  [
    state => state.app,
  ],
  (app) => {
    return {
      locale: app.locale,
      decimal: app.user.decimalSeparator || '.',
      thousand: app.user.groupSeparator || ',',
      precision: 2,
      format: '%s%v',
      symbol: '$',
    };
  }
);

export const getDigit0Options = createSelector(
  [
    state => state.app,
  ],
  (app) => {
    return {
      locale: app.locale,
      decimal: app.user.decimalSeparator || '.',
      thousand: app.user.groupSeparator || ',',
      precision: 0,
      format: '%v',
    };
  }
);

export const getDigit1Options = createSelector(
  [
    state => state.app,
  ],
  (app) => {
    return {
      locale: app.locale,
      decimal: app.user.decimalSeparator || '.',
      thousand: app.user.groupSeparator || ',',
      precision: 1,
      format: '%v',
    };
  }
);

export const getDigit2Options = createSelector(
  [
    state => state.app,
  ],
  (app) => {
    return {
      locale: app.locale,
      decimal: app.user.decimalSeparator || '.',
      thousand: app.user.groupSeparator || ',',
      precision: 2,
      format: '%v',
    };
  }
);

export function isEmptyElement(el) {
  return (isUndefined(el)
    || (isObject(el) || isString(el)) && isEmpty(el)
    || isNaN(el)
  );
}

export function setElement(dst, src, ...accessors) {
  let srcEl = src;
  let dstEl = dst;
  const last = accessors.pop();

  for (let ind = 0; ind < accessors.length; ++ind) {
    const accessor = accessors[ind];
    if (!accessor) {
      continue;
    }
    srcEl = srcEl[accessor];
    if (isUndefined(srcEl)) {
      return;
    }

    if (isUndefined(dstEl[accessor])) {
      dstEl[accessor] = {};
    }

    dstEl = dstEl[accessor];
  }

  dstEl[last] = srcEl[last];
}

export function setAccessor(dst, src, path) {
  setElement(...[dst, src].concat(path.split('.')));
  return dst;
}

export function setElementByPath(dst, val, index, accessors) {
  let dstEl = dst;
  const last = accessors.pop();

  for (let ind = 0; ind < accessors.length; ++ind) {
    const accessor = accessors[ind];
    if (!accessor) {
      continue;
    }

    if (isUndefined(dstEl[accessor])) {
      dstEl[accessor] = {};
    }

    dstEl = dstEl[accessor];
    if (isArray(dstEl) && !isUndefined(index)) {
      dstEl = dstEl[index];
    }
    if (isUndefined(dstEl)) {
      return;
    }
  }

  dstEl[last] = val;
}

export function setElementByPathArgs(dst, val, ...accessors) {
  return setElementByPath(dst, val, undefined, accessors);
}

export function setByPathAccessor(dst, val, path) {
  if (!path) {
    return;
  }
  setElementByPathArgs(...[dst, val].concat(path.split('.')));
}


export function getElement(obj, ...accessors) {
  if (!obj) {
    return '';
  }

  const allAccessors = [];
  each(accessors, (accessor) => {
    if (isArray(accessor)) {
      each(accessor, el => { allAccessors.push(el); });
    } else {
      allAccessors.push(accessor);
    }
  });

  let el = obj;
  each(allAccessors, (accessor) => {
    if (!accessor) {
      return true;
    }
    el = el[accessor];
    if (isUndefined(el)) {
      el = '';
      return false;
    }
    return true;
  });

  return el;
}

export function getElementEmpty(obj, ...accessors) {
  if (!obj) {
    return '-';
  }

  let el = obj;
  each(accessors, (accessor) => {
    if (!accessor) {
      return true;
    }
    el = el[accessor];
    if (isUndefined(el)) {
      el = '-';
      return false;
    }
    return true;
  });

  return el;
}

export function getElementEdit(obj, editMode, ...accessors) {
  const emptyStr = editMode ? '' : '-';
  if (!obj) {
    return emptyStr;
  }

  let el = obj;
  each(accessors, (accessor) => {
    if (!accessor) {
      return true;
    }
    el = el[accessor];
    if (isUndefined(el)) {
      el = emptyStr;
      return false;
    }
    return true;
  });

  return el;
}


export function accessElement(obj, path) {
  if (!path) {
    return undefined;
  }
  return getElement(...[obj].concat(path.split('.')));
}

export function unformatNumber(value, options) {
  let decimal = options.decimal;
  if (typeof value === 'number') {
    return value;
  }
  if (isUndefined(value)) {
    value = '';
  }

  if (decimal === ',' && value.indexOf('.') >= 0) {
    decimal = '.';
  } else if (decimal === '.' && value.indexOf(',') >= 0 && value.indexOf('.') === -1) {
    decimal = ',';
  }

  return accounting.unformat(value, decimal);
}

export function formatMoney(value, options) {
  if (value === '' || value === '-' || value === undefined) {
    return value;
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatMoney(value, options);
}

export function formatDashesMoney(value, options) {
  if (value === '' || value === '-' || value === undefined || value === null) {
    return '-';
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatMoney(value, options);
}

export function formatNumber(value, options) {
  if (value === '' || value === '-' || value === undefined || value === null) {
    return '-';
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatNumber(value, options);
}

export function formatDashesNumber(value, options) {
  if (value === '' || value === '-' || value === undefined || value === null) {
    return '-';
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatNumber(value, options);
}

export function formatEmptyNumber(value, options) {
  if (value === '' || value === '-' || value === undefined || value === null) {
    return '';
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatNumber(value, options);
}

export function formatZeroNumber(value, options) {
  if (value === '' || value === '-' || value === undefined) {
    value = 0;
  }

  if (isString(value)) {
    value = unformatNumber(value, options);
  }

  return accounting.formatNumber(value, options);
}


export function formatDigits(value, options) {
  if (value === '' || value === '-' || value === undefined) {
    return '';
  }

  return accounting.formatNumber(value, options);
}

export function makeNumber(value) {
  return isNumber(value) ? value : 0;
}

export function formatEmpty(value) {
  if (!value) {
    return '-';
  }
  return value;
}
