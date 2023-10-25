import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';
import { routes } from '../app/app';

import BaseList from '../../components/general/base-list/base-list';
import { setImportsGroups, getImportsList } from './actions/imports';
import { extractData } from './selectors/imports';
import { addScenarioIdToRoute } from '../../utils/utils';

import '../../../styles/content-gradient.scss';
import './imports.scss';

defineMessages({
  title: {
    id: 'imports.title',
    defaultMessage: 'Imports',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.imports.isLoading,
  groups: state.imports.groups,
  paging: state.imports.paging,
}), (dispatch) => bindActionCreators({
  getImportsList,
  setImportsGroups,
}, dispatch))
export default class Imports extends PureComponent {
  static propTypes = {
    scenarioId: PropTypes.number,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    getImportsList: PropTypes.func,
    setImportsGroups: PropTypes.func,
  };

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging } = props;
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { isLoading, getImportsList } = props;
    if (!isLoading) {
      getImportsList(pageNo, pageSize, force);
    }
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
  onRowClick(originalRow) {
    const { id, active } = originalRow;
    const { scenarioId } = this.props;
    if (active) {
      this.props.history.push(addScenarioIdToRoute(`${ routes.IMPORTS.path }/${ id }`, scenarioId));
    }
  }

  render() {
    const { table, isLoading, groups, setImportsGroups, paging, pageName, location } = this.props;
    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='imports.title'
        titleIcon='employees'
        isLoading={ isLoading }
        groups={ groups }
        setGroups={ setImportsGroups }
        menuItemId='budget-detail'
        menuSubitemId='imports'
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        onRowClick={ this.onRowClick }
        fieldToDisableRowCursor='active'
        noGroups
        noCustomizeColumns
      />
    );
  }
}
