import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import { isEqual, filter } from 'lodash';

import { panelClose } from '../../general/popup/actions';
import Form from '../../general/form/form';
import Field from '../../controls/field';

import BaseList from '../../general/base-list/base-list';
import { setSelected } from './actions/group-level';
import { getGroupLevel } from '../../../api/actions';
import { extractData } from './selectors/group-level';

import './other-rates.scss';

defineMessages({
  groupTitle: {
    id: 'group-level.group-title',
    defaultMessage: 'Group:',
  },
  groupPlaceholder: {
    id: 'group-level.group-placeholder',
    defaultMessage: 'Type to search...',
  },
  levelTitle: {
    id: 'group-level.level-title',
    defaultMessage: 'Level:',
  },
  levelPlaceholder: {
    id: 'group-level.level-placeholder',
    defaultMessage: 'Type to search...',
  },
});


@connect(state => ({
  table: extractData(state),
  financialYearId: state.scenario.selectedScenario.yearId,
  isLoading: state.groupLevel.isLoading,
  data: state.groupLevel.data,
  previousFinancialYearId: state.groupLevel.options.financialYearId,
  previousJobTitleId: state.groupLevel.options.jobTitleId,
  paging: state.groupLevel.paging,
}), (dispatch) => bindActionCreators({
  getGroupLevel,
  panelClose,
  setSelected,
}, dispatch))
export default class GroupLevel extends Component {
  static defaultProps = {
    pageName: 'Group level',
    paging: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      group: '',
      level: '',
    };
  }

  componentDidMount() {
    this.init(this.props);
    this.props.setSelected();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { financialYearId, paging, previousFinancialYearId, jobTitle: { id: jobTitleId },
      previousJobTitleId, isLoading } = props;

    if (!isEqual(
      { financialYearId, jobTitleId },
      { financialYearId: previousFinancialYearId, jobTitleId: previousJobTitleId })) {
      this.load(props, paging.pageNo, paging.pageSize, !isLoading);
    }
  }

  load(props, pageNo, pageSize, force) {
    const { financialYearId, paging, isLoading, data, getGroupLevel, jobTitle: { id: jobTitleId } } = props;
    const newQuery = { pageNo, pageSize };
    const oldQuery = { pageNo: paging.pageNo, pageSize: paging.pageSize };
    if ((data || isLoading) && (isEqual(newQuery, oldQuery) && !force)) {
      return;
    }
    getGroupLevel(financialYearId, jobTitleId, pageNo, pageSize);
  }

  @autobind
  onFetchData(tableState) {
    this.load(this.props, tableState.page + 1, tableState.pageSize);
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
    const { onSelect, setSelected } = this.props;
    const { group, level, hourlyRate } = originalRow;
    setSelected(group, level, hourlyRate);
    if (onSelect) {
      onSelect(originalRow);
    }
  }

  @autobind
  onChangeFunctionalCenter(items) {
    this.props.setFilterCenters(items);
  }

  @autobind
  onChangeGroup(event) {
    const { target: { value } } = event;
    this.setState({ group: value });
  }

  @autobind
  onChangeLevel(event) {
    const { target: { value } } = event;
    this.setState({ level: value });
  }

  getRows() {
    const { table: { rows } } = this.props;
    const { group, level } = this.state;
    if (!group && !level) {
      return rows;
    }
    const groups = group.split(/[ ,]+/).filter(val => val);
    const levels = level.split(/[ ,]+/).filter(val => val);

    return filter(rows, (row) => {
      let matchGroup = !groups.length;
      let matchLevel = !levels.length;
      for (let ind = 0; ind < groups.length; ind++) {
        if (row.group.indexOf(groups[ind]) >= 0) {
          matchGroup = true;
          break;
        }
      }
      for (let ind = 0; ind < levels.length; ind++) {
        if (row.level.indexOf(levels[ind]) >= 0) {
          matchLevel = true;
          break;
        }
      }
      return matchGroup && matchLevel;
    });

  }

  render() {
    const { table, isLoading, pageName } = this.props;
    const { jobTitle: { notaryEmploymentCode: code, description } } = this.props;
    const location = { pathname: window.location.pathname };
    const { group, level } = this.state;
    return (
      <div className='other-rates'>
        <div className='other-rates__title'>
          <FormattedMessage
            id='group-level.title'
            defaultMessage='Salary level'
          />
        </div>
        <div className='other-rates__header'>
          <Form>
            <Form.Row>
              <Form.Column2>
                <Field value={ code } labelIntlId='entities.job-title.label' />
              </Form.Column2>
              <Form.Column2>
                <Field.Info value={ description } />
              </Form.Column2>
            </Form.Row>
            <Form.Row>
              <Form.Column2>
                <Field.Input
                  value={ group }
                  editMode
                  labelIntlId='group-level.group-title'
                  placeholderIntlId='group-level.group-placeholder'
                  onChange={ this.onChangeGroup }
                />
              </Form.Column2>
              <Form.Column2>
                <Field.Input
                  value={ level }
                  editMode
                  labelIntlId='group-level.level-title'
                  placeholderIntlId='group-level.level-placeholder'
                  onChange={ this.onChangeLevel }
                />
              </Form.Column2>
            </Form.Row>
            <Form.Separator />
          </Form>
        </div>
        <div className='other-rates__grid'>
          <BaseList
            pageName={ pageName }
            location={ location }
            rows={ this.getRows() }
            columns={ table.columns }
            selectedRow={ table.selectedRow }
            isLoading={ isLoading }
            manual={ true }
            // pages={ paging.pageCount }
            // page={ paging.pageNo - 1 }
            // pageSize={ paging.pageSize }
            // onFetchData={ this.onFetchData }
            // setPageSize={ this.setPageSize }
            // onPageChange={ this.onPageChange }
            onRowClick={ this.onRowClick }
            standalone
            noPaging
          />
        </div>
      </div>
    );
  }
}
