import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';

import BaseList from '../../components/general/base-list/base-list';
import { setGroups, getParametersByStructureList } from './actions';
import { extractData } from './selectors';
import { routes } from '../app/app';
import { addScenarioIdToRoute } from '../../utils/utils';

import '../../../styles/content-gradient.scss';
import './parameters-by-structure.scss';

defineMessages({
  title: {
    id: 'parameters-by-structure.title',
    defaultMessage: 'Parameters by structure',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.parametersByStructure.isLoading,
  groups: state.parametersByStructure.groups,
  paging: state.parametersByStructure.paging,
}), (dispatch) => bindActionCreators({
  getParametersByStructureList,
  setGroups,
}, dispatch))
export default class ParametersByStructure extends PureComponent {
  static propTypes = {
    scenarioId: PropTypes.number,
    rows: PropTypes.array,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    getParametersByStructureList: PropTypes.func,
    setGroups: PropTypes.func,
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
    const { isLoading, getParametersByStructureList } = props;
    if (!isLoading) {
      getParametersByStructureList(pageNo, pageSize, force);
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
    const { id } = originalRow;
    const { scenarioId } = this.props;
    this.props.history.push(addScenarioIdToRoute(`${ routes.PARAMETERS_BY_STRUCTURE.path }/${ id }`, scenarioId));
  }

  render() {
    const { table, isLoading, groups, setGroups, paging, pageName, location } = this.props;
    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='parameters-by-structure.title'
        titleIcon='employees'
        isLoading={ isLoading }
        groups={ groups }
        setGroups={ setGroups }
        menuItemId='budget-detail'
        menuSubitemId='parameters-by-structure'
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        onRowClick={ this.onRowClick }
        noGroups
        noCustomizeColumns
      />
    );
  }
}
