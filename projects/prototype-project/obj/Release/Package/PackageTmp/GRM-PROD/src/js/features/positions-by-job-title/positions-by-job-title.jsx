import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';

import BaseList from '../../components/general/base-list/base-list';
import { setGroups, getPositionsByJobTitleList } from './actions';
import { extractData } from './selectors';
import { routes } from '../app/app';
import { addScenarioIdToRoute } from '../../utils/utils';

import '../../../styles/content-gradient.scss';
import './position-by-job-title.scss';

defineMessages({
  title: {
    id: 'positions-by-job-title.title',
    defaultMessage: 'Positions by Job Title',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.positionsByJobTitle.isLoading,
  groups: state.positionsByJobTitle.groups,
  paging: state.positionsByJobTitle.paging,
}), (dispatch) => bindActionCreators({
  getPositionsByJobTitleList,
  setGroups,
}, dispatch))
export default class PositionsByJobTitle extends PureComponent {
  static propTypes = {
    scenarioId: PropTypes.number,
    rows: PropTypes.array,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    setGroups: PropTypes.func,
    getPositionsByJobTitleList: PropTypes.func,
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
    const { isLoading, getPositionsByJobTitleList } = props;
    if (!isLoading) {
      getPositionsByJobTitleList(pageNo, pageSize, force);
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
    const { positionId } = originalRow;
    const { scenarioId } = this.props;
    this.props.history.push(addScenarioIdToRoute(`${ routes.POSITIONS_BY_JOB_TITLE.path }/${ positionId }`, scenarioId));
  }

  render() {
    const { table, isLoading, groups, setGroups, paging, pageName, location } = this.props;
    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='positions-by-job-title.title'
        titleIcon='employees'
        isLoading={ isLoading }
        groups={ groups }
        setGroups={ setGroups }
        menuItemId='budget-detail'
        menuSubitemId='positions-by-job-title'
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
