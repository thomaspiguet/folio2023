import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import DataGridFixed from '../../components/general/data-grid/data-grid-fixed';
import CustomizeColumns from '../../components/general/customize-columns/customize-columns';
import Button from '../../components/controls/button';
import {
  setDetailId,
  setGroups,
  applyColumnsCustomization,
  restoreDefaultColumns,
  setExpanded,
  expandAll,
  collapseAll,
  openFilter,
  setFilters,
  setSorting,
  loadBudgetDetails,
  setDefaultCustomizedColumns,
} from './actions';
import { getBudgetDetails, getBudgetDetailsReport } from '../../api/actions';
import { selectSideMenu } from '../../components/general/side-menu/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import {
  detailSelector,
} from './reducer';
import { getTitle, extractData } from './selectors';
import { GridExport } from '../app/effects/reports';
import { getDefaultCostomizedColumns } from '../../utils/utils';

import './salaries.scss';
import '../../../styles/content-gradient.scss';

defineMessages({
  expandAll: {
    id: 'button.expand-all',
    defaultMessage: 'EXPAND ALL',
  },
  collapseAll: {
    id: 'button.collapse-all',
    defaultMessage: 'COLLAPSE ALL',
  },
});

@connect(state => ({
  table: extractData(state),
  title: getTitle(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  sideMenuExpanded: state.sideMenu.menuExpanded,
  isLoading: state.salaries.isLoading,
  filterKey: state.filter.selectedDepartment,
  filterIDs: state.filter.selectedFilterElementsIds,

  groups: detailSelector(state).groups,
  data: detailSelector(state).data,
  dataGroups: detailSelector(state).dataGroups,
  paging: detailSelector(state).paging,
  lastDetailId: detailSelector(state).lastDetailId,
  filters: detailSelector(state).filter,
  sorting: detailSelector(state).sorting,
  columns: detailSelector(state).columns,
}), (dispatch) => bindActionCreators({
  getBudgetDetails,
  setDetailId,
  selectSideMenu,
  getBudgetDetailsReport,
  setGroups,
  applyColumnsCustomization,
  restoreDefaultColumns,
  setExpanded,
  expandAll,
  collapseAll,
  openFilter,
  setFilters,
  setSorting,
  loadBudgetDetails,
  setTitle,
  setDefaultCustomizedColumns,
}, dispatch))
class Salaries extends TrackablePage {
  static propTypes = {
    rows: PropTypes.array,
    detailId: PropTypes.string,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    intl: PropTypes.object,
    applyColumnsCustomization: PropTypes.func,
    restoreDefaultColumns: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentRow: 0,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props, true);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging: { pageNo, pageSize }, setTitle, title, table, columns, setDefaultCustomizedColumns } = props;
    if (columns === undefined) {
      setDefaultCustomizedColumns(getDefaultCostomizedColumns(table));
    }
    if (initial || title !== this.props.title) {
      setTitle(title);
    }
    this.load(props, pageNo, pageSize, initial);
  }

  load(props, pageNo, pageSize, force) {
    const { detailId, loadBudgetDetails, isLoading, sorting } = props;
    if (detailId && !isLoading) {
      loadBudgetDetails(detailId, pageNo, pageSize, sorting, force);
    }
  }

  @autobind
  onFetchData(tableState) {
    // this.load(this.props, tableState.page + 1, tableState.pageSize, true); // TODO: fix paging
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

  @autobind
  getColumnName(column) {
    if (column.intlId) {
      return this.props.intl.formatMessage({ id: column.intlId }, column.intlValues);
    }
    return column.id;
  }

  @autobind
  handleApplyColumnsCustomization(customizedColumns) {
    this.props.applyColumnsCustomization(customizedColumns);
  }

  @autobind
  handleRestoreDefaultColumns() {
    this.props.restoreDefaultColumns();
  }

  @autobind
  onExportExcel() {
    const gridExport = new GridExport();
    const body = gridExport.buildRequestBody(
      this.props.title,
      this.props.groups,
      this.getColumnName,
      this.props.table.columnsFixed,
      this.props.table.columnsScrolledExport);

    this.props.getBudgetDetailsReport(
      this.props.detailId,
      this.props.scenarioId,
      body,
      this.props.filterKey,
      this.props.filterIDs
    );
  }

  @autobind
  onExpandAll() {
    this.props.expandAll();
  }

  @autobind
  onCollapseAll() {
    this.props.collapseAll();
  }

  render() {
    const { table, isLoading, groups, setGroups, paging, setExpanded } = this.props;
    const customColumns = table.customColumns || [];
    const haveGroups = !!(groups && groups.length);
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
            openFilter={ this.props.openFilter }
            filters={ this.props.filters }
            setFilters={ this.props.setFilters }
            sorting={ this.props.sorting }
            setSorting={ this.props.setSorting }
            setExpanded={ setExpanded }
          >
            <div className='salaries__actions'>
              <div className='salaries__actions-left'>
                <div className='salaries__title'>
                  { this.props.title }
                </div>
              </div>
              <div className='salaries__actions-right'>
                { haveGroups && <Button
                  key='collapse-all-button'
                  classElementModifier='collapse-all'
                  labelIntlId='button.collapse-all'
                  onClick={ this.onCollapseAll }
                /> }
                { haveGroups && <Button
                  key='expand-all-button'
                  classElementModifier='expand-all'
                  labelIntlId='button.expand-all'
                  onClick={ this.onExpandAll }
                /> }
                <CustomizeColumns
                  columns={ customColumns }
                  onApplyColumnsChanges={ this.handleApplyColumnsCustomization }
                  onRestoreDefaultColumns={ this.handleRestoreDefaultColumns }
                />
                <Button
                  key='export-to-excel-button'
                  classElementModifier='export-to-excel--with-icon'
                  labelIntlId='base-list.action-export-to-excel'
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

export default injectIntl(Salaries);
