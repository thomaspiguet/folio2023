import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { FormattedMessage, defineMessages } from 'react-intl';
import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';

import { extractScenarios } from './selectors/scenario';
import * as scenarioActions from './actions/scenario';

import Form from '../../components/general/form/form';
import TrackablePage from '../../components/general/trackable-page/trackable-page';
import DataGridScrollable from '../../components/general/data-grid/data-grid-scorllable';
import StyledDropdown from '../../components/controls/styled-dropdown';
import SearchInput from '../../components/controls/search-input';
import ThreeStateOption from '../../components/controls/three-state-option';

import './scenario.scss';

defineMessages({
  organization: {
    id: 'scenario.organization-title',
    defaultMessage: 'Organizations:',
  },
  organizationPlaceholder: {
    id: 'scenario.organization-placeholder',
    defaultMessage: 'Select Organizations...',
  },
  financialYear: {
    id: 'scenario.financial-year-title',
    defaultMessage: 'Financial years:',
  },
  financialYearPlaceholder: {
    id: 'scenario.financial-year-placeholder',
    defaultMessage: 'Select Financial years...',
  },
  responsible: {
    id: 'scenario.responsible-title',
    defaultMessage: 'Managers:',
  },
  responsiblePlaceholder: {
    id: 'scenario.responsible-placeholder',
    defaultMessage: 'Select managers...',
  },
  administrativeUnits: {
    id: 'scenario.administrative-units-title',
    defaultMessage: 'Functional centers:',
  },
  administrativeUnitsPlaceholder: {
    id: 'scenario.administrative-units-placeholder',
    defaultMessage: 'Select functional centers...',
  },
  searchScenario: {
    id: 'scenario.table-keyword',
    defaultMessage: 'Search',
  },
  secondary: {
    id: 'scenario.secondary-scenario-title',
    defaultMessage: 'Secondary:',
  },
  followUpReport: {
    id: 'scenario.followup-report-title',
    defaultMessage: 'Follow Up Report:',
  },
  complete: {
    id: 'scenario.complete-title',
    defaultMessage: 'Complete:',
  },
});

function DashboardLink(props) {
  const { selectedRow, scenarioId } = props;
  if (selectedRow !== null && selectedRow >= 0 && scenarioId) {
    return (
      <Link className='scenario__button' to={`/${scenarioId}/dashboard`}>
        <span className='scenario__button-text'>
          <FormattedMessage
            id='scenario.go-to-dashboard'
            defaultMessage='Go to dashboard'
          />
        </span>
        <i className="material-icons small-btn-icons">arrow_forward</i>
      </Link>
    );
  }
  return (
    <div className='scenario__button scenario__button--grayed'>
      <span className='scenario__button-text--grayed'>
        <FormattedMessage
          id='scenario.go-to-dashboard'
          defaultMessage='Go to dashboard'
        />
      </span>
      <i className
        ="material-icons small-btn-icons">arrow_forward</i>
    </div>
  );
}


@connect(state => ({
  filter: state.app.filter,
  selectedOrganizations: state.scenario.selectedOrganizations,
  filteredOrganizations: state.scenario.filteredOrganizations,
  selectedYears: state.scenario.selectedYears,
  filteredYears: state.scenario.filteredYears,
  selectedResponsible: state.scenario.selectedResponsible,
  filteredResponsible: state.scenario.filteredResponsible,
  selectedFunctionalCenters: state.scenario.selectedFunctionalCenters,
  filteredFunctionalCenters: state.scenario.filteredFunctionalCenters,
  searchCriteria: state.scenario.criteria,
  previouslySelectedOptions: state.scenario.previouslySelectedOptions,
  tableData: extractScenarios(state),
  isLoadingTable: state.scenario.isLoadingTable,
  data: state.scenario.data,
  checkedSecondary: state.scenario.checkedSecondary,
  checkedFollowUpReport: state.scenario.checkedFollowUpReport,
  checkedComplete: state.scenario.checkedComplete,
  paging: state.scenario.paging,
  scenarioId: state.scenario.selectedScenario.scenarioId,
}),
  (dispatch) => bindActionCreators({
    selectOrganization: scenarioActions.selectOrganization,
    deselectOrganization: scenarioActions.deselectOrganization,
    clearSelectedOrganizations: scenarioActions.clearSelectedOrganizations,
    filterOrganizations: scenarioActions.filterOrganizations,
    selectYear: scenarioActions.selectYear,
    deselectYear: scenarioActions.deselectYear,
    clearSelectedYears: scenarioActions.clearSelectedYears,
    filterYears: scenarioActions.filterYears,
    selectResponsible: scenarioActions.selectResponsible,
    deselectResponsible: scenarioActions.deselectResponsible,
    clearSelectedResponsible: scenarioActions.clearSelectedResponsible,
    filterResponsible: scenarioActions.filterResponsible,
    selectFunctionalCenter: scenarioActions.selectFunctionalCenter,
    deselectFunctionalCenter: scenarioActions.deselectFunctionalCenter,
    clearSelectedFunctionalCenter: scenarioActions.clearSelectedFunctionalCenter,
    filterFunctionalCenter: scenarioActions.filterFunctionalCenter,
    filterSearchByKeyword: scenarioActions.filterSearchByKeyword,
    clearSearchByKeyword: scenarioActions.clearSearchByKeyword,
    scenarioGetData: scenarioActions.scenarioGetData,
    selectScenario: scenarioActions.selectScenario,
    toggleSecondary: scenarioActions.toggleSecondary,
    toggleFollowUpReport: scenarioActions.toggleFollowUpReport,
    toggleComplete: scenarioActions.toggleComplete,
  }, dispatch))
export default class Scenario extends TrackablePage {
  static propTypes = {
    pageName: PropTypes.string,
    filter: PropTypes.object,
    selectedOrganizations: PropTypes.array,
    filteredOrganizations: PropTypes.object,
    selectedYears: PropTypes.array,
    filteredYears: PropTypes.object,
    selectedResponsible: PropTypes.array,
    filteredResponsible: PropTypes.object,
    selectedFunctionalCenters: PropTypes.array,
    filteredFunctionalCenters: PropTypes.object,
    selectOrganization: PropTypes.func,
    deselectOrganization: PropTypes.func,
    clearSelectedOrganizations: PropTypes.func,
    filterOrganizations: PropTypes.func,
    selectYear: PropTypes.func,
    deselectYear: PropTypes.func,
    clearSelectedYears: PropTypes.func,
    filterYears: PropTypes.func,
    selectResponsible: PropTypes.func,
    deselectResponsible: PropTypes.func,
    clearSelectedResponsible: PropTypes.func,
    filterResponsible: PropTypes.func,
    selectFunctionalCenter: PropTypes.func,
    deselectFunctionalCenter: PropTypes.func,
    clearSelectedFunctionalCenter: PropTypes.func,
    filterFunctionalCenter: PropTypes.func,
    filterSearchByKeyword: PropTypes.func,
    clearSearchByKeyword: PropTypes.func,
    previouslySelectedOptions: PropTypes.object,
    tableData: PropTypes.array,
    scenarioGetData: PropTypes.func,
    selectScenario: PropTypes.func,
    isLoadingTable: PropTypes.bool,
    editMode: PropTypes.bool,
    toggleSecondary: PropTypes.func,
    checkedSecondary: PropTypes.bool,
    toggleFollowUpReport: PropTypes.func,
    checkedFollowUpReport: PropTypes.bool,
    toggleComplete: PropTypes.func,
    checkedComplete: PropTypes.bool,
    paging: PropTypes.object,
    scenarioId: PropTypes.number,
  };

  static defaultProps = {
    editMode: false,
  };

  constructor(props) {
    super(props);
    if (!props.data.length) {
      this.props.scenarioGetData(true);
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
    const {
      selectedOrganizations,
      selectedYears,
      selectedResponsible,
      selectedFunctionalCenters,
      searchCriteria,
      paging,
      previouslySelectedOptions,
    } = this.props;

    const newQuery = { selectedOrganizations, selectedYears, selectedResponsible, selectedFunctionalCenters, searchCriteria };
    const oldQuery = {
      selectedOrganizations: previouslySelectedOptions.selectedOrganizations,
      selectedYears: previouslySelectedOptions.selectedYears,
      selectedResponsible: previouslySelectedOptions.selectedResponsible,
      selectedFunctionalCenters: previouslySelectedOptions.selectedFunctionalCenters,
      searchCriteria: previouslySelectedOptions.searchCriteria,
    };
    if (!isEqual(newQuery, oldQuery)) {
      this.load(props, paging.pageNo, paging.pageSize);
    }
  }

  load(props, pageNo, pageSize) {
    const { isLoadingTable, paging, data } = this.props;

    const newQuery = { pageNo, pageSize };
    const oldQuery = { pageNo: paging.pageNo, pageSize: paging.pageSize };
    if ((data || isLoadingTable) && isEqual(newQuery, oldQuery)) {
      return;
    }
    props.scenarioGetData(false, pageNo, pageSize);
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

  handleClearOrganizationsSelection = () => {
    this.props.clearSelectedOrganizations();
    this.props.filterOrganizations('');
  };

  handleClearYearsSelection = () => {
    this.props.clearSelectedYears();
    this.props.filterYears('');
  };

  handleClearResponsibleSelection = () => {
    this.props.clearSelectedResponsible();
    this.props.filterResponsible('');
  };

  handleClearFunctionalCenterSelection = () => {
    this.props.clearSelectedFunctionalCenter();
    this.props.filterFunctionalCenter('');
  };

  handleChangeSelectedRow = (index, originalRow) => {
    this.props.selectScenario(originalRow);
  };

  @autobind
  onRowClick(originalRow) {
    // this function only needed to set cursor type to pointer on data-grid table
  }

  render() {
    return (
      <div className='scenario'>
        <div className='scenario__table'>
          <DataGridScrollable
            rows={this.props.tableData.rows}
            columns={this.props.tableData.columns}
            components={this.props.tableData.components}
            selectedRow={this.props.tableData.selectedRow}
            isLoading={this.props.isLoadingTable}
            isFullWidth={false}
            onChangeSelectedRow={this.handleChangeSelectedRow}
            onRowClick={this.onRowClick}
            manual={true}
            pages={this.props.paging.pageCount}
            page={this.props.paging.pageNo - 1}
            pageSize={this.props.paging.pageSize}
            onFetchData={this.onFetchData}
            setPageSize={this.setPageSize}
            onPageChange={this.onPageChange}
            Footer={<DashboardLink selectedRow={this.props.tableData.selectedRow} scenarioId={this.props.scenarioId} />}
            footerOffset={150}
          >
            <div className='scenario__title'>
              <FormattedMessage id='scenario.title' defaultMessage='Select scenario' />
            </div>
            <div className='scenario__tabs' />
            <div className='scenario__delimiter' />
            <Form.Row>
              <Form.Column2>
                <StyledDropdown
                  itemDescription={'description'}
                  items={this.props.filteredOrganizations}
                  labelIntlId='scenario.organization-title'
                  placeholderIntlId='scenario.organization-placeholder'
                  selectedItems={this.props.selectedOrganizations}
                  single={true}
                  onClearSelectedItems={this.handleClearOrganizationsSelection}
                  onDeselectItem={this.props.deselectOrganization}
                  onFilterItems={this.props.filterOrganizations}
                  onSelectItem={this.props.selectOrganization}
                />
              </Form.Column2>
              <Form.Column2>
                <StyledDropdown
                  items={this.props.filteredYears}
                  labelIntlId='scenario.financial-year-title'
                  placeholderIntlId='scenario.financial-year-placeholder'
                  selectedItems={this.props.selectedYears}
                  showDescriptionColumn={false}
                  single={true}
                  sortDescending={true}
                  onClearSelectedItems={this.handleClearYearsSelection}
                  onDeselectItem={this.props.deselectYear}
                  onFilterItems={this.props.filterYears}
                  onSelectItem={this.props.selectYear}
                />
              </Form.Column2>
            </Form.Row>
            <div className='scenario__options'>
              <div className='scenario__option scenario__option--first'>
                <ThreeStateOption
                  value={this.props.checkedSecondary}
                  labelIntlId='scenario.secondary-scenario-title'
                  onChange={this.props.toggleSecondary}
                />
              </div>
              <div className='scenario__option scenario__option--second'>
                <ThreeStateOption
                  value={this.props.checkedFollowUpReport}
                  labelIntlId='scenario.followup-report-title'
                  onChange={this.props.toggleFollowUpReport}
                />
              </div>
              <div className='scenario__option scenario__option--third'>
                <ThreeStateOption
                  value={this.props.checkedComplete}
                  labelIntlId='scenario.complete-title'
                  onChange={this.props.toggleComplete}
                />
              </div>
            </div>
            <Form.Row>
              <Form.Column2>
                <StyledDropdown
                  itemCode={'userName'}
                  itemDescription={'displayName'}
                  items={this.props.filteredResponsible}
                  labelIntlId='scenario.responsible-title'
                  placeholderIntlId='scenario.responsible-placeholder'
                  selectedItems={this.props.selectedResponsible}
                  single={true}
                  onClearSelectedItems={this.handleClearResponsibleSelection}
                  onDeselectItem={this.props.deselectResponsible}
                  onFilterItems={this.props.filterResponsible}
                  onSelectItem={this.props.selectResponsible}
                />
              </Form.Column2>
              <Form.Column2>
                <StyledDropdown
                  itemDescription={'longDescription'}
                  items={this.props.filteredFunctionalCenters}
                  labelIntlId='scenario.administrative-units-title'
                  placeholderIntlId='scenario.administrative-units-placeholder'
                  selectedItems={this.props.selectedFunctionalCenters}
                  single={true}
                  onClearSelectedItems={this.handleClearFunctionalCenterSelection}
                  onDeselectItem={this.props.deselectFunctionalCenter}
                  onFilterItems={this.props.filterFunctionalCenter}
                  onSelectItem={this.props.selectFunctionalCenter}
                />
              </Form.Column2>
            </Form.Row>
            <div className='scenario__delimiter' />
            {this.renderSearchKeyword()}
          </DataGridScrollable>
        </div>
      </div>
    );
  }

  renderSearchKeyword() {
    return (
      <div className='scenario__keywords'>
        <div className='scenario__table-title'>
          <FormattedMessage id='scenario.table-title' defaultMessage='Scenarios' />
        </div>
        <SearchInput
          placeholderIntlId='scenario.table-keyword'
          onChangeKeyWord={this.props.filterSearchByKeyword}
          onClearKeyWord={this.props.clearSearchByKeyword}
          keyWord={this.props.searchCriteria}
        />
      </div>
    );
  }

}
