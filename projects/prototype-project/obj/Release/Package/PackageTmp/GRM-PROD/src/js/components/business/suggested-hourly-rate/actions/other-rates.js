export const OTHER_RATES_SET_GROUPS = 'OTHER_RATES_SET_GROUPS';
export const OTHER_RATES_SET_FILTERS = 'OTHER_RATES_SET_FILTERS';
export const OTHER_RATES_SET_SELECTED = 'OTHER_RATES_SET_SELECTED';

export function setOtherRatesGroups(groups) {
  return {
    type: OTHER_RATES_SET_GROUPS,
    payload: groups,
  };
}

export function setFilterCenters(filterCenters) {
  return {
    type: OTHER_RATES_SET_FILTERS,
    payload: filterCenters,
  };
}

export function setSelected(functionalCenter, hourlyRate) {
  return {
    type: OTHER_RATES_SET_SELECTED,
    payload: { functionalCenter, hourlyRate },
  };
}

