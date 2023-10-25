import React, { Component } from 'react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { get, each } from 'lodash';

import {
  getRequiredAttendanceDashboard,
  getRequiredAttendanceParameters,
} from '../../api/actions';
import {
  applyColumnsCustomization,
  resetColumnsCustomization,
  editStart,
  editCancel,
  editContinue,
  editSave,
  setEntry,
  getRequiredAttendanceDashboardList,
  recalculateRowTotal,
  initializeRequiredAttendances,
} from './actions/required-attendance-dashboard';
import { extractEntry } from './selectors/required-attendance-dashboard';
import DataGridFixed from '../../components/general/data-grid/data-grid-fixed';
import CustomizeColumns from '../../components/general/customize-columns/customize-columns';
import Form from '../../components/general/form/form';
import { FormValidator } from '../../utils/components/form-validator';
import { popupOpen } from '../../components/general/popup/actions';
import { getDigit2Options } from '../../utils/selectors/currency';
import { schedulePhases, scheduleDays } from './entities/required-attendance-dashboard';

defineMessages({
  generalInformation: {
    id: 'required-attendance-dashboard.title',
    defaultMessage: 'Required Attendance Dashboard',
  },
  initializeConfirm: {
    id: 'required-attendance-dashboard.initialize-confirm',
    defaultMessage: 'This action is irreversible. Do you still want to initialize all the required attendance schedules?',
  },
});

export function isEditableDashboardCell(entry, row, columnId) {
  return get(row, 'generalInformation.type') === 'Attendance';
}

const scheduleColumns = [];
each(scheduleDays, (day) => {
  each(schedulePhases, (phase) => {
    scheduleColumns.push({
      path: [day, `${ day }.${ phase }`],
      id: `${ day }.${ phase }`,
      editable: isEditableDashboardCell,
      metadataDefault: {
        maxValue: 9999.99,
        minValue: 0,
      },
    });
  });
});

const formOptions = {
  tabs: {
    detail: {},
  },
  fields: {
    table: {
      path: ['table'],
      tabId: 'detail',
      columns: scheduleColumns,
    },
  },
};

@connect(state => ({
  entry: extractEntry(state),
  isLoading: state.requiredAttendanceDashboard.isLoading,
  paging: state.requiredAttendanceDashboard.paging,
  parameters: state.requiredAttendanceDashboard.parameters,
  isParamsLoading: state.requiredAttendanceDashboard.isParamsLoading,
  editMode: state.requiredAttendanceDashboard.editMode,
  metadata: state.requiredAttendanceDashboard.metadata,
  validationErrors: state.requiredAttendanceDashboard.validationErrors,
  scenarioId: state.scenario.selectedScenario.scenarioId,
  sideMenuExpanded: state.sideMenu.menuExpanded,
  financialYearId: state.scenario.selectedScenario.yearId,
  digit2Options: getDigit2Options(state),
}), (dispatch) => bindActionCreators({
  getRequiredAttendanceDashboardList,
  getRequiredAttendanceDashboard,
  getRequiredAttendanceParameters,
  applyColumnsCustomization,
  resetColumnsCustomization,
  popupOpen,
  editStart,
  editSave,
  setEntry,
  recalculateRowTotal,
}, dispatch))
class RequiredAttendanceDashboard extends Component {

  static propTypes = {
    table: PropTypes.object,
    isLoading: PropTypes.bool,
    paging: PropTypes.object,
    parameters: PropTypes.object,
    isParamsLoading: PropTypes.bool,
    scenarioId: PropTypes.number,
    sideMenuExpanded: PropTypes.bool,
    financialYearId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  componentDidMount() {
    this.init(this.props, true);
  }

  init(props, initial) {
    const { paging, financialYearId, isParamsLoading, parameters, editMode, metadata, validationErrors, entry } = props;
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
    this.load(props, paging.pageNo, paging.pageSize, initial);

    if (financialYearId && !parameters && !isParamsLoading) {
      props.getRequiredAttendanceParameters(financialYearId);
    }
  }

  load(props, pageNo, pageSize, force = false) {
    const { getRequiredAttendanceDashboardList, isLoading } = props;
    if (!isLoading) {
      getRequiredAttendanceDashboardList(pageNo, pageSize, force);
    }
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

  @autobind
  onEdit() {
    const { editStart } = this.props;
    editStart();
    this.validator.onEdit(this);
  }

  @autobind
  onCancel() {
    this.validator.onCancel(editCancel(), editContinue());
  }

  @autobind
  onSave() {
    const { editSave } = this.props;
    if (this.validator.onSave(this)) {
      editSave();
    }
  }

  @autobind
  onInitialize() {
    const { popupOpen, intl } = this.props;
    popupOpen({
      style: 'confirm',
      message: intl.formatMessage({ id: 'required-attendance-dashboard.initialize-confirm' }),
      actions: [
        { kind: 'continue', action: initializeRequiredAttendances() },
        { kind: 'cancel' },
      ],
    });
  }

  @autobind
  onChangeCell(value, index) {
    const { recalculateRowTotal } = this.props;
    recalculateRowTotal(index);
  }

  render() {
    const { entry, isLoading, paging, setExpanded, isParamsLoading, sideMenuExpanded, editMode } = this.props;
    const { table } = entry;
    const { fields, tabs: { detail: { invalid } } } = this.validator;
    const { flashErrors } = this.state;
    const customColumns = table.customColumns || [];
    const formClass = classNames('salaries__table', {
      'salaries__table--collapsed-sidebar': !sideMenuExpanded,
      'salaries__table--with-footer': editMode,
    });
    return (
      <div className='salaries'>
        <div className='salaries__gradient content-gradient' />
        <Form
          invalid={ invalid }
          flashErrors={ flashErrors }
          editMode={ editMode }
          className={ formClass }
        >
          <DataGridFixed
            rows={ table.rows }
            columnsFixed={ table.columnsFixed }
            columnsScrolled={ table.columnsScrolled }
            isLoading={ isLoading || isParamsLoading }
            manual={ true }
            pages={ paging.pageCount }
            page={ paging.pageNo - 1 }
            pageSize={ paging.pageSize }
            onFetchData={ this.onFetchData }
            setPageSize={ this.setPageSize }
            onPageChange={ this.onPageChange }
            setExpanded={ setExpanded }
            editMode={ editMode }
            validator={ fields.table }
            flashErrors={ flashErrors }
            onChangeCell={ this.onChangeCell }
          >
            <div className='salaries__actions'>
              <div className='salaries__actions-left'>
                <div className='salaries__title'>
                  <FormattedMessage id='required-attendance-dashboard.title' />
                </div>
              </div>
              <div className='salaries__actions-right'>
                { !editMode && <Form.Action type='edit' intlId='action.edit' onClick={ this.onEdit } /> }
                <CustomizeColumns
                  columns={ customColumns }
                  onApplyColumnsChanges={ this.props.applyColumnsCustomization }
                  onRestoreDefaultColumns={ this.props.resetColumnsCustomization }
                />
              </div>
            </div>
          </DataGridFixed>
          { editMode &&
          <Form.FooterActions className='salaries__footer'>
            <Form.Action type='restore' intlId='action.restore' disabled={ isLoading } onClick={ this.onInitialize } />
            <Form.Action type='cancel' intlId='action.cancel' disabled={ isLoading } onClick={ this.onCancel } />
            <Form.Action type='save' intlId='action.save' disabled={ isLoading } onClick={ this.onSave } isLast />
          </Form.FooterActions>
            }
        </Form>
      </div>
    );
  }
}

export default injectIntl(RequiredAttendanceDashboard);
