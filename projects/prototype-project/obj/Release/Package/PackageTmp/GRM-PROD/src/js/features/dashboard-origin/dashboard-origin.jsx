import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { isEqual, map } from 'lodash';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import DataGridFixed from '../../components/general/data-grid/data-grid-fixed';
import CustomizeColumns from '../../components/general/customize-columns/customize-columns';
import Button from '../../components/controls/button';
import {
  setContext,
  setGroups,
  applyColumnsCustomization,
  restoreDefaultColumns,
} from './origins-actions';
import { getBudgetDetailsOrigin, getBudgetDetailsOriginReport } from '../../api/actions';
import { selectSideMenu } from '../../components/general/side-menu/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { extractData } from './origins-selectors';
import { getDataKey, getGroupKey } from './origins-reducer';
import { GridExport } from '../app/effects/reports';
import { isEmptyObject, removeLastOccurrence } from '../../utils/utils';

import '../salaries/salaries.scss';
import '../../../styles/content-gradient.scss';

defineMessages({
  globalParametersTitle: {
    id: 'salaries.action-add',
    defaultMessage: 'ADD',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  sideMenuExpanded: state.sideMenu.menuExpanded,
  isLoading: state.origins.isLoading,
  lastContext: state.origins.context,
  pageSize: state.origins.pageSize,
  functionalCenters: state.salaries.functionalCenters,
  positions: state.salaries.positions,
  origins: state.origins,
  groups: state.origins[getGroupKey(state.origins.context)],
  paging: state.origins.paging,
  filterKey: state.filter.selectedDepartment,
  filterIDs: state.filter.selectedFilterElementsIds,
}), (dispatch) => bindActionCreators({
  getBudgetDetailsOrigin,
  setContext,
  selectSideMenu,
  setGroups,
  getBudgetDetailsOriginReport,
  applyColumnsCustomization,
  restoreDefaultColumns,
  setTitle,
}, dispatch))
class DashboardOrigin extends TrackablePage {
  static propTypes = {
    rows: PropTypes.array,
    detailId: PropTypes.string,
    originId: PropTypes.string,
    functionalCenterId: PropTypes.string,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    applyColumnsCustomization: PropTypes.func,
    restoreDefaultColumns: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentRow: 0,
    };
    if (isEmptyObject(props.lastContext)) {
      props.history.push(removeLastOccurrence(window.location.pathname, '/origin'));
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { scenarioId, detailId, originId, functionalCenterId, lastContext, filterKey, filterIDs, paging, setTitle } = props;
    setTitle(this.getTitle(props));
    this.props.selectSideMenu('dashboard', detailId);

    const context = { scenarioId, detailId, originId, functionalCenterId, filterKey, filterIDs };
    if (isEqual(context, lastContext)) {
      return;
    }
    props.setContext(context);

    const dataKey = getDataKey(context);
    if (props.origins[dataKey]) {
      return;
    }
    this.load(props, paging.pageNo, paging.pageSize);
  }

  load(props, pageNo, pageSize) {
    const { detailId, scenarioId, filterKey, filterIDs, paging, isLoading, originId, functionalCenterId } = props;
    const newQuery = { pageNo, pageSize };
    const oldQuery = { pageNo: paging.pageNo, pageSize: paging.pageSize };
    const context = { scenarioId, detailId, originId, functionalCenterId, filterKey, filterIDs };

    const dataKey = getDataKey(context);
    if ((props.origins[dataKey] || isLoading) && isEqual(newQuery, oldQuery)) {
      return;
    }
    props.getBudgetDetailsOrigin(detailId, scenarioId, originId, +functionalCenterId, filterKey, filterIDs, pageNo, pageSize);
  }

  @autobind
  onFetchData(tableState) {
    // this.load(this.props, tableState.page + 1, tableState.pageSize);
  }

  @autobind
  setPageSize(pageSize) {
    const { paging } = this.props;
    this.load(this.props, paging.pageNo, pageSize);
  }

  @autobind
  onPageChange(page) {
    const { paging } = this.props;
    this.load(this.props, page + 1, paging.pageSize);
  }

  getTitle(props) {
    return `${ props.functionalCenters[props.functionalCenterId] } ${ props.positions[props.originId] }`;
  }

  @autobind
  getColumnName(column) {
    if (column.intlId) {
      return this.props.intl.formatMessage({ id: column.intlId }, column.intlValues);
    }
    return column.id;
  }

  @autobind
  onExportExcel() {
    const gridExport = new GridExport();
    const body = gridExport.buildRequestBody(
      this.getTitle(this.props),
      this.props.groups,
      this.getColumnName,
      this.props.table.columnsFixed,
      this.props.table.columnsScrolled);

    this.props.getBudgetDetailsOriginReport(
      this.props.detailId,
      this.props.scenarioId,
      this.props.originId,
      this.props.functionalCenterId,
      body,
      this.props.filterKey,
      this.props.filterIDs
    );
  }

  @autobind
  onAdd() {
    console.log('onAdd', 'not implemented yet'); // eslint-disable-line no-console
  }

  render() {
    const { table, isLoading, groups, setGroups, paging,
      applyColumnsCustomization, restoreDefaultColumns } = this.props;
    const customColumns = table.customColumns || [];
    return (
      <div className='salaries'>
        <div className='salaries__gradient content-gradient' />
        <div className={ classNames('salaries__table', { 'salaries__table--collapsed-sidebar': !this.props.sideMenuExpanded }) }>
          <DataGridFixed
            rows={ table.rows }
            columnsFixed={ table.columnsFixed }
            columnsScrolled={ table.columnsScrolled }
            isLoading={ isLoading }
            groups={ groups }
            setGroups={ setGroups }
            manual={ true }
            pages={ paging.pageCount }
            page={ paging.pageNo - 1 }
            pageSize={ paging.pageSize }
            onFetchData={ this.onFetchData }
            setPageSize={ this.setPageSize }
            onPageChange={ this.onPageChange }
            pivotBy={ map(groups, column => column.id) }
          >
            <div className='salaries__actions'>
              <div className='salaries__actions-left'>
                <div className='salaries__title'>
                  { this.getTitle(this.props) }
                </div>
              </div>
              <div className='salaries__actions-right'>
                <CustomizeColumns
                  columns={ customColumns }
                  onApplyColumnsChanges={ applyColumnsCustomization }
                  onRestoreDefaultColumns={ restoreDefaultColumns }
                />
                <Button
                  key='add-origin-button'
                  classElementModifier='add-origin'
                  labelIntlId='salaries.action-add'
                  onClick={ this.onAdd }
                />
                <Button
                  key='export-to-excel-button'
                  classElementModifier='export-to-excel--with-icon'
                  onClick={ this.onExportExcel }
                />
              </div>
            </div>
          </DataGridFixed>
        </div>
      </div>
    );
  }
}

export default injectIntl(DashboardOrigin);
