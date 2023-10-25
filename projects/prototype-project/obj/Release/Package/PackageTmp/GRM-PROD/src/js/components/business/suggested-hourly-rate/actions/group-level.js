export const GROUP_LEVEL_SET_SELECTED = 'GROUP_LEVEL_SET_SELECTED';

export function setSelected(group, level, hourlyRate) {
  return {
    type: GROUP_LEVEL_SET_SELECTED,
    payload: { group, level, hourlyRate },
  };
}

