import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';
import { routes } from '../app/app';

import BaseList from '../../components/general/base-list/base-list';
import SearchSimple from './search-simple';
import SearchAction from './search-action';
import SearchAdvanced from './search-advanced';
import { getRequiredAttendanceList, setRequiredAttendanceGroups } from './actions/required-attendances';
import {
  getRequiredAttendanceDefault,
  getRequiredAttendanceListMetadata,
  REQUIRED_ATTENDANCES_REQUEST,
} from '../../api/actions';
import { extractData } from './selectors/required-attendances';
import { addScenarioIdToRoute } from '../../utils/utils';

import '../../../styles/content-gradient.scss';
import './required-attendances.scss';

defineMessages({
  title: {
    id: 'required-attendance.list-title',
    defaultMessage: 'Required Attendance',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.requiredAttendances.isLoading,
  groups: state.requiredAttendances.groups,
  listMetadata: state.requiredAttendances.listMetadata,
  listMetadataLoading: state.requiredAttendances.listMetadataLoading,
  paging: state.requiredAttendances.paging,
  reference: state.requiredAttendances.referenceSearchKeyWord,
  search: state.requiredAttendances.search,
}), (dispatch) => bindActionCreators({
  getRequiredAttendanceList,
  setRequiredAttendanceGroups,
  getRequiredAttendanceDefault,
  getRequiredAttendanceListMetadata,
}, dispatch))
export default class RequiredAttendances extends PureComponent {
  static propTypes = {
    scenarioId: PropTypes.number,
    rows: PropTypes.array,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    reference: PropTypes.string,
    search: PropTypes.object,
    getRequiredAttendanceList: PropTypes.func,
    setRequiredAttendanceGroups: PropTypes.func,
    getRequiredAttendanceDefault: PropTypes.func,
    getRequiredAttendanceListMetadata: PropTypes.func,
  };

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging, listMetadata, listMetadataLoading, getRequiredAttendanceListMetadata } = props;
    if (!listMetadata && !listMetadataLoading) {
      getRequiredAttendanceListMetadata();
    }
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { isLoading, getRequiredAttendanceList } = props;
    if (!isLoading) {
      getRequiredAttendanceList(REQUIRED_ATTENDANCES_REQUEST, pageNo, pageSize, force);
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
    const { requiredAttendanceId } = originalRow;
    const { scenarioId } = this.props;
    this.props.history.push(addScenarioIdToRoute(`${ routes.REQUIRED_ATTENDANCES.path }/${ requiredAttendanceId }`, scenarioId));
  }

  @autobind
  onAdd() {
    const { getRequiredAttendanceDefault, scenarioId } = this.props;
    getRequiredAttendanceDefault(scenarioId);
  }

  render() {
    const { table, isLoading, groups, setRequiredAttendanceGroups, paging, pageName, location } = this.props;
    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='required-attendance.list-title'
        titleIcon='employees'
        isLoading={ isLoading }
        groups={ groups }
        setGroups={ setRequiredAttendanceGroups }
        menuItemId='budget-detail'
        menuSubitemId='required-attendance'
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        onRowClick={ this.onRowClick }
        onAdd={ this.onAdd }
        SearchSimple={ SearchSimple }
        SearchAction={ SearchAction }
        SearchAdvanced={ SearchAdvanced }
        noPadding
        noGroups
        noCustomizeColumns
      />
    );
  }
}
