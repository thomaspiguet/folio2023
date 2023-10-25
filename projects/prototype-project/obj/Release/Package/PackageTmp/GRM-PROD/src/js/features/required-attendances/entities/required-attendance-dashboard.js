import { each, get, isUndefined, set } from 'lodash';

export const scheduleDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'otherNonWorkDay1', 'otherNonWorkDay2', 'otherNonWorkDay3'];
export const schedulePhases = ['day', 'evening', 'night', 'rotation'];

export function convertToSave(changedData) {
  const resultMap = {};
  const result = [];

  each(changedData, ({ value, key, index, row, ref }) => {
    if (!row) {
      return;
    }
    let resultRow = resultMap[ref];
    if (!resultRow) {
      resultRow = row;
      resultMap[ref] = resultRow;
      result.push(resultRow);
    }
    set(resultRow, key, value);
  });

  each(result, (row) => {
    each(scheduleDays, (day) => {
      each(schedulePhases, (phase) => {
        const path = `${ day }.${ phase }`;
        const value = get(row, path);
        if (value === '' || isUndefined(value)) {
          set(row, path, null);
        }
      });
    });
  });

  return result;
}

