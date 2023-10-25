import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';

import {
  setDepartment,
  selectDepartmentFilter,
  deselectDepartmentFilter,
  clearSelectedDepartmentFilters,
  filterDepartmentFilter,
} from '../filter-dropdown/actions';

import Dropdown from '../../controls/dropdown';
import FilterDropdown from '../filter-dropdown/filter-dropdown';
import RoutesDropDown, {
  BUTTON_TOP_MENU_OPTIONS_LIST_VERTICAL_SHIFT,
  BUTTON_TOP_MENU_OPTIONS_LIST_HORIZONTAL_SHIFT,
} from '../../controls/routes-dropdown';

import './top-menu.scss';
import { makeSearchString } from '../../../utils/utils';


@connect(state => ({
  editMode: state.app.editMode,
  filter: state.app.filter,
  filterKeyword: state.filter.criteria,
  organizations: state.scenario.organizations,
  years: state.app.years,
  budgets: state.app.budgets,
  selectedScenario: state.scenario.selectedScenario,
  departments: state.filter.departments,
  selectedDepartment: state.filter.selectedDepartment,
  departmentFilters: state.filter.departmentFilters,
  selectedDepartmentFilters: state.filter.selectedDepartmentFilters,
  filteredDepartmentFilters: state.filter.filteredDepartmentFilters,
  departmentFilterEnabled: state.filter.departmentFilterEnabled,
  selectDepartmentEnabled: state.filter.selectDepartmentEnabled,
  topMenuButtonsValues: state.app.topMenuButtons,
}), (dispatch) => bindActionCreators({
  setDepartment,
  selectDepartmentFilter,
  deselectDepartmentFilter,
  clearSelectedDepartmentFilters,
  filterDepartmentFilter,
}, dispatch))
export default class TopMenu extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    pageName: PropTypes.string,
    filterKeyword: PropTypes.string,
    selectedScenario: PropTypes.object,
    departments: PropTypes.array,
    selectedDepartment: PropTypes.string,
    filterItems: PropTypes.array,
    selectedDepartmentFilters: PropTypes.array,
    filteredDepartmentFilters: PropTypes.array,
    setDepartment: PropTypes.func,
    selectDepartmentFilter: PropTypes.func,
    deselectDepartmentFilter: PropTypes.func,
    clearSelectedDepartmentFilters: PropTypes.func,
    filterDepartmentFilter: PropTypes.func,
    topMenuButtonsValues: PropTypes.object,
  };

  static defaultProps = {
    pageName: 'top menu filter',
  };

  @autobind
  handleSelectDepartment(index) {
    if (this.props.selectedDepartment !== this.props.departments[index].code) {
      this.props.setDepartment(this.props.departments[index]);
    }
  }

  @autobind
  handleSelectFilterElement(item) {
    this.props.selectDepartmentFilter(item, this.props.pageName);
  }

  @autobind
  handleDeselectFilterElement(item) {
    this.props.deselectDepartmentFilter(item, this.props.pageName);
  }

  @autobind
  handleClearFilterElementSelection() {
    this.props.clearSelectedDepartmentFilters(this.props.pageName);
    this.props.filterDepartmentFilter('', this.props.pageName);
  }

  @autobind
  handleFilterFilterElement(keyword) {
    const { filterKeyword } = this.props;
    if (this.props.selectedDepartment === 'UNITEADMIN') {
      keyword = makeSearchString(keyword);
    }
    if (filterKeyword !== keyword) {
      this.props.filterDepartmentFilter(keyword, this.props.pageName);
    }
  }

  render() {
    const { selectedScenario } = this.props;
    return (
      <div className='top-menu'>
        <div className='top-menu__scenario'>
          <div className='top-menu__info'>
            <div className='top-menu__info-top'>
              <span>{ selectedScenario.year ? selectedScenario.year : '' }</span>
              <span className='top-menu__info-delim'>/</span>
              <span>{ selectedScenario.organization ? selectedScenario.organization : '' }</span>
            </div>
            <div className='top-menu__info-scenario'>
              { selectedScenario.scenarioDescription ? selectedScenario.scenarioDescription : '' }
            </div>
          </div>

          <Link className='top-menu__button' to='/modal/scenario'>
            <span className='top-menu__button-text'>
              <FormattedMessage id='top-menu.change-scenario' defaultMessage='Change scenario' />
              <i className="material-icons small-btn-icons">find_replace</i>
            </span>
          </Link>
        </div>
        { this.renderTopMenuRight(selectedScenario) }
      </div>
    );
  }

  renderTopMenuRight(selectedScenario) {
    return (
      <div className='top-menu__right'>
        { this.renderStatus(selectedScenario) }
        { this.renderApprovedBy(selectedScenario) }
        { this.renderApprovalDate(selectedScenario) }
        <div className='top-menu__delim--hide' />
        <div className='top-menu__field'>
          <div className='top-menu__field-name'>
            <FormattedMessage id='top-menu.filter-by' defaultMessage='FILTER BY' />
          </div>
          <div className='top-menu__field-value'>
            <Dropdown
              classNameModifier='filter-dropdown__modifier'
              values={ this.props.departments }
              value={ this.props.selectedDepartment }
              onChange={ this.handleSelectDepartment }
              disabled={ !this.props.selectDepartmentEnabled }
            />
          </div>
        </div>

        <div className='top-menu__field'>
          <div className='top-menu__field-name'>
            <FormattedMessage id='top-menu.selection' defaultMessage='SELECTION' />
          </div>
          <div className='top-menu__field-value'>
            <FilterDropdown
              items={ this.props.filteredDepartmentFilters || [] }
              itemDescription='longDescription'
              selectedItems={ this.props.selectedDepartmentFilters }
              onSelectItem={ this.handleSelectFilterElement }
              onDeselectItem={ this.handleDeselectFilterElement }
              onClearSelectedItems={ this.handleClearFilterElementSelection }
              onFilterItems={ this.handleFilterFilterElement }
              selectedDepartment={ this.props.selectedDepartment }
              enabled={ this.props.departmentFilterEnabled }
            />
          </div>
        </div>
        { this.renderSubMenu() }
      </div>
    );
  }

  renderStatus(selectedScenario) {
    return (
      <div className='top-menu__field--hide'>
        <div className='top-menu__field-name'>
          <FormattedMessage id='top-menu.status' defaultMessage='STATUS' />
        </div>
        <div className='top-menu__field-value top-menu__field-value--status-active'>
          { selectedScenario.status }
        </div>
      </div>
    );
  }

  renderApprovedBy(selectedScenario) {
    return (
      <div className='top-menu__field--hide'>
        <div className='top-menu__field-name'>
          <FormattedMessage id='top-menu.approved-by' defaultMessage='APPROVED BY' />
        </div>
        <div className='top-menu__field-value'>
          { selectedScenario.approvedBy }
        </div>
      </div>
    );
  }

  renderApprovalDate(selectedScenario) {
    return (
      <div className='top-menu__field--hide'>
        <div className='top-menu__field-name'>
          <FormattedMessage id='top-menu.approval-date' defaultMessage='APPROVAL DATE' />
        </div>
        <div className='top-menu__field-value'>
          { selectedScenario.approvalDate }
        </div>
      </div>
    );
  }

  renderSubMenu() {
    const { editMode, topMenuButtonsValues } = this.props;
    return (
      <div className='top-menu__field'>
        <RoutesDropDown
          editMode={ editMode }
          values={ topMenuButtonsValues }
          optionsListVerticalShift={ BUTTON_TOP_MENU_OPTIONS_LIST_VERTICAL_SHIFT }
          optionsListHorizontalShift={ BUTTON_TOP_MENU_OPTIONS_LIST_HORIZONTAL_SHIFT }
        />
      </div>
    );
  }
}
