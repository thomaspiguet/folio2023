import { each, find } from 'lodash';
import { take } from 'redux-saga/effects';
import FileSaver from 'file-saver';

import {
  BUDGET_DETAILS_REPORT_SUCCESS,
  BUDGET_DETAILS_ORIGIN_REPORT_SUCCESS,
} from '../../../api/actions';

export class GridExport {
  makeColumn(columns, group, column, getColumnName, grouping) {
    const type = group.id === 'common' ? undefined : group.id;
    const id = column.exportId ? `${ column.exportId }` : undefined;
    let groupByOrder = 0;
    const groupingColumn = find(grouping, { id: column.id });
    if (groupingColumn) {
      groupByOrder = grouping.indexOf(groupingColumn) + 1;
    }
    if (!column.exportId) {
      return;
    }
    columns.push({
      id,
      type,
      order: columns.length,
      name: getColumnName(column),
      groupByOrder,
    });
  }

  buildRequestBody(title, grouping, getColumnName, ...columnsGroups) {
    const groups = [];
    let order = 0;
    each(columnsGroups, groupArray => {
      each(groupArray, group => {
        const columns = [];
        each(group.columns, (column) => { this.makeColumn(columns, group, column, getColumnName, grouping); });
        groups.push({
          columns,
          id: group.id,
          name: getColumnName(group),
          order,
        });
        order++;
      });
    });

    const reportName = `report-${ title }.xlsx`;
    return { groups, reportName };
  }
}


export function* saveReport() {
  while (true) {
    const action = yield take([
      BUDGET_DETAILS_REPORT_SUCCESS,
      BUDGET_DETAILS_ORIGIN_REPORT_SUCCESS,
    ]);
    FileSaver.saveAs(action.payload, action.options.reportName);
  }
}

