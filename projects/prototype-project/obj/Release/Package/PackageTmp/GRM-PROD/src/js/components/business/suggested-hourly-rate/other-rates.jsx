import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { isEqual, map } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';

import { panelClose } from '../../general/popup/actions';
import FunctionalCenter from '../../dropdowns/functional-center';
import Form from '../../general/form/form';
import Field from '../../controls/field';

import BaseList from '../../general/base-list/base-list';
import { setFilterCenters, setSelected } from './actions/other-rates';
import { getOtherRates } from '../../../api/actions';
import { extractData } from './selectors/other-rates';

import './other-rates.scss';
import { codeDescriptionSchema } from '../../../entities/code-description';

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.otherRates.isLoading,
  data: state.otherRates.data,
  previousScenarioId: state.otherRates.options.scenarioId,
  previousJobTitleId: state.otherRates.options.jobTitleId,
  previousFunctionalCenterIds: state.otherRates.options.functionalCenterIds,
  filterCenters: state.otherRates.filterCenters,
  paging: state.otherRates.paging,
}), (dispatch) => bindActionCreators({
  getOtherRates,
  panelClose,
  setFilterCenters,
  setSelected,
}, dispatch))
export default class OtherRates extends Component {
  static defaultProps = {
    pageName: 'other rates',
  };

  constructor(props) {
    super(props);
    this.state = {
      functionalCenter: fillDefaults({}, codeDescriptionSchema),
    };
  }

  componentDidMount() {
    this.init(this.props);
    this.props.setFilterCenters([]);
    this.props.setSelected();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { scenarioId, paging, previousScenarioId, jobTitle: { id: jobTitleId },
      previousJobTitleId, previousFunctionalCenterIds, filterCenters, isLoading } = props;
    const functionalCenterIds = map(filterCenters, item => item.id);

    if (!isEqual(
      { scenarioId, jobTitleId, functionalCenterIds },
      { scenarioId: previousScenarioId, jobTitleId: previousJobTitleId, functionalCenterIds: previousFunctionalCenterIds })) {
      this.load(props, paging.pageNo, paging.pageSize, !isLoading);
    }
  }

  load(props, pageNo, pageSize, force) {
    const { scenarioId, paging, isLoading, data, getOtherRates, jobTitle: { id: jobTitleId }, filterCenters } = props;
    const functionalCenterIds = map(filterCenters, item => item.id);
    const newQuery = { pageNo, pageSize };
    const oldQuery = { pageNo: paging.pageNo, pageSize: paging.pageSize };
    if ((data || isLoading) && (isEqual(newQuery, oldQuery) && !force)) {
      return;
    }
    getOtherRates(scenarioId, jobTitleId, functionalCenterIds, pageNo, pageSize);
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
    setSelected(originalRow.functionalCenter, originalRow.hourlyRate);
    onSelect(originalRow);
  }

  @autobind
  onChangeFunctionalCenter(items) {
    this.props.setFilterCenters(items);
  }

  render() {
    const { table, isLoading, paging, pageName } = this.props;
    const { jobTitle: { notaryEmploymentCode: code, description }, filterCenters } = this.props;
    const location = { pathname: window.location.pathname };
    return (
      <div className='other-rates'>
        <div className='other-rates__title'>
          <FormattedMessage
            id='other-rates.title'
            defaultMessage='Other suggested hourly rates'
          />
        </div>
        <div className='other-rates__header'>
          <Form>
            <Form.Row>
              <Form.Column4>
                <FunctionalCenter
                  editMode={ true }
                  onChange={ this.onChangeFunctionalCenter }
                  value={ filterCenters }
                  multiple
                  labelIntlId='required-attendance.functional-center-code'
                  placeholderIntlId='required-attendance.functional-center-placeholder'
                />
              </Form.Column4>
            </Form.Row>
            <Form.Row>
              <Form.Column2>
                <Field value={ code } labelIntlId='entities.job-title.label' />
              </Form.Column2>
              <Form.Column2>
                <Field.Info value={ description } />
              </Form.Column2>
            </Form.Row>
            <Form.Separator />
          </Form>
        </div>
        <div className='other-rates__grid'>
          <BaseList
            pageName={ pageName }
            location={ location }
            rows={ table.rows }
            columns={ table.columns }
            selectedRow={ table.selectedRow }
            isLoading={ isLoading }
            manual={ true }
            pages={ paging.pageCount }
            page={ paging.pageNo - 1 }
            pageSize={ paging.pageSize }
            onFetchData={ this.onFetchData }
            setPageSize={ this.setPageSize }
            onPageChange={ this.onPageChange }
            onRowClick={ this.onRowClick }
            standalone
          />
        </div>
      </div>
    );
  }
}
