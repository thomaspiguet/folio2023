import React, { Component } from 'react';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { fillSubEntry, FormValidator } from '../../utils/components/form-validator';
import { copyRun, copyCancel, copySetEntry, copyTargetToggle, copyOptionsToggle } from './actions/required-attendances';
import { ScrollBox } from '../../components/general/scroll-box';
import { popupOpen } from '../../components/general/popup/actions';

import Form from '../../components/general/form/form';
import FunctionalCenter from '../../components/dropdowns/functional-center';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import Switch from '../../components/controls/switch';
import GroupType from '../../components/dropdowns/group-type';
import JobTitle from '../../components/dropdowns/job-title';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import JobType from '../../components/dropdowns/job-type';
import JobStatus from '../../components/dropdowns/job-status';
import RequiredAttendanceReferences from '../../components/dropdowns/required-attendance-references';
import FinancialStructure from '../../components/business/financial-structure/financial-structure';

import { getDigit2Options } from '../../utils/selectors/currency';
import { isZeroId, removeLastPath } from '../../utils/utils';
import { isJobTitleType } from '../../entities/suggested-hourly-rate';

import {
  getRequiredAttendance,
  getRequiredAttendances,
  REQUIRED_ATTENDANCE_REFERENCES_REQUEST,
  REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_REQUEST,
} from '../../api/actions';

const formOptions = {
  tabs: {
  },
  fields: {
    targetFunctionalCenter: {
      path: ['targetFunctionalCenter'],
      metadata: ['CopyTo', 'children', 'FunctionalCenterIds'],
    },
    references: {
      path: ['references'],
      mandatory: true,
      metadata: ['CopyFrom', 'children', 'RequiredAttendanceIds'],
    },
    departments: {
      path: ['departments'],
      metadata: ['CopyTo', 'children', 'DepartmentIds'],
    },
    subDepartments: {
      path: ['subDepartments'],
      metadata: ['CopyTo', 'children', 'SubDepartmentIds'],
    },
    programs: {
      path: ['programs'],
      metadata: ['CopyTo', 'children', 'ProgramsIds'],
    },
    subPrograms: {
      path: ['subPrograms'],
      metadata: ['CopyTo', 'children', 'SubProgramIds'],
    },
    primaryCodeGroups: {
      path: ['primaryCodeGroups'],
      metadata: ['CopyTo', 'children', 'PrimaryCodeGroupsIds'],
    },
    responsibilityCentersLevel1: {
      path: ['responsibilityCentersLevel1'],
      metadata: ['CopyTo', 'children', 'ResponsibilityCenterLevel1Ids'],
    },
    responsibilityCentersLevel2: {
      path: ['responsibilityCentersLevel2'],
      metadata: ['CopyTo', 'children', 'ResponsibilityCenterLevel2Ids'],
    },
    responsibilityCentersLevel3: {
      path: ['responsibilityCentersLevel3'],
      metadata: ['CopyTo', 'children', 'ResponsibilityCenterLevel3Ids'],
    },
    sites: {
      path: ['sites'],
      metadata: ['CopyTo', 'children', 'SiteIds'],
    },
    isIncludeSchedule: {
      path: ['isIncludeSchedule'],
    },
    isIncludeTemporaryClosure: {
      path: ['isIncludeTemporaryClosure'],
    },
    isIncludeBenefits: {
      path: ['isIncludeBenefits'],
    },
    isIncludeReplacements: {
      path: ['isIncludeReplacements'],
    },
    isIncludePremiums: {
      path: ['isIncludePremiums'],
    },
    isIncludePayrollDeductions: {
      path: ['isIncludePayrollDeductions'],
    },
    isIncludeSpecificDistribution: {
      path: ['isIncludeSpecificDistribution'],
    },
    type: {
      path: ['groupType'],
      metadata: ['ToUpdateInCopy', 'children', 'GroupType'],
      mandatory: true,
      predicate: entry => get(entry, 'references').length <= 1,
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
      metadata: ['ToUpdateInCopy', 'children', 'JobTitleGroup'],
      mandatory: true,
      predicate: entry => get(entry, 'groupType.code') === '1' && get(entry, 'references').length <= 1,
    },
    jobTitle: {
      path: ['jobTitle'],
      metadata: ['ToUpdateInCopy', 'children', 'JobTitle'],
      mandatory: true,
      predicate: entry => get(entry, 'groupType.code') === '0' && get(entry, 'references').length <= 1,
    },
    reference: {
      path: ['code'],
      mandatory: true,
      metadata: ['ToUpdateInCopy', 'children', 'Code'],
      predicate: entry => get(entry, 'references').length <= 1,
    },
    description: {
      path: ['description'],
      mandatory: true,
      metadata: ['ToUpdateInCopy', 'children', 'Description'],
      predicate: entry => get(entry, 'references').length <= 1,
    },
    jobType: {
      path: ['jobType'],
      metadata: ['ToUpdateInCopy', 'children', 'JobType'],
      mandatory: true,
      predicate: entry => get(entry, 'references').length <= 1,
    },
    jobStatus: {
      path: ['jobStatus'],
      metadata: ['ToUpdateInCopy', 'children', 'JobStatus'],
      mandatory: true,
      predicate: entry => get(entry, 'references').length <= 1,
    },
    isIncludeAttachment: {
      path: ['isIncludeAttachment'],
    },
    isIncludeNotes: {
      path: ['isIncludeNotes'],
    },
  },
};

defineMessages({
  title: {
    id: 'required-attendance-copy.title',
    defaultMessage: 'Copy: required attendance',
  },
  requiredAttendance: {
    id: 'required-attendance-copy.required-attendance',
    defaultMessage: 'Required attendance',
  },
  financialStructure: {
    id: 'required-attendance-copy.financial-structure',
    defaultMessage: 'Financial structure',
  },
  toBeCopied: {
    id: 'required-attendance-copy.required-attendance-to-be-copied',
    defaultMessage: 'Required attendance to be copied',
  },
  newRequiredAttendance: {
    id: 'required-attendance-copy.new-required-attendance',
    defaultMessage: 'New required attendance',
  },
  isIncludeSchedule: {
    id: 'required-attendance-copy.copy-schedule',
    defaultMessage: 'Schedule - Required attendance',
  },
  isIncludeTemporaryClosure: {
    id: 'required-attendance-copy.copy-temporary-closures',
    defaultMessage: 'Temporary closure',
  },
  isIncludeReplacements: {
    id: 'required-attendance-copy.copy-replacements',
    defaultMessage: 'Replacements',
  },
  isIncludePremiums: {
    id: 'required-attendance-copy.copy-premiums',
    defaultMessage: 'Premiums',
  },
  isIncludeBenefits: {
    id: 'required-attendance-copy.copy-benefits',
    defaultMessage: 'Benefits',
  },
  isIncludePayrollDeductions: {
    id: 'required-attendance-copy.copy-payroll-deductions',
    defaultMessage: 'Payroll deductions',
  },
  isIncludeSpecificDistribution: {
    id: 'required-attendance-copy.copy-specific-distributions',
    defaultMessage: 'Specific distributions',
  },
  functionalCenterCode: {
    id: 'required-attendance-copy.functional-center-code',
    defaultMessage: 'Functional centers:',
  },
  functionalCenterPlaceholder: {
    id: 'required-attendance-copy.functional-center-placeholder',
    defaultMessage: 'Select functional centers...',
  },
  primaryCodesPlaceholder: {
    id: 'required-attendance-copy.primary-code-groups.placeholder',
    defaultMessage: 'Select Primary code groups...',
  },
  primaryCodesLable: {
    id: 'required-attendance-copy.primary-code-groups.label',
    defaultMessage: 'Primary code groups:',
  },
  attachedDocuments: {
    id: 'required-attendance-copy.attached-documents',
    defaultMessage: 'Attach documents:',
  },
  attachedNotes: {
    id: 'required-attendance-copy.attached-notes',
    defaultMessage: 'Attach notes:',
  },
});

@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  baseEntry: state.requiredAttendances.entry,
  entry: state.requiredAttendancesCopy.entry,
  isLoading: state.requiredAttendancesCopy.isLoading,
  targetExpanded: state.requiredAttendancesCopy.targetExpanded,
  optionsExpanded: state.requiredAttendancesCopy.optionsExpanded,
  validationErrors: state.requiredAttendancesCopy.validationErrors,
  metadata: state.requiredAttendancesCopy.metadata,
  editMode: state.requiredAttendancesCopy.editMode,
  digit2Options: getDigit2Options(state),
  paging: state.requiredAttendances.paging,
  filterElementKey: state.filter.selectedDepartment,
  filterElementsIds: state.filter.selectedFilterElementsIds,
  reference: state.requiredAttendances.referenceSearchKeyWord,
  search: state.requiredAttendances.search,
}), (dispatch) => bindActionCreators({
  copyRun,
  popupOpen,
  setEntry: copySetEntry,
  copyTargetToggle,
  copyOptionsToggle,
  getRequiredAttendance,
  getRequiredAttendances,
}, dispatch))
class RequiredAttendancesCopy extends Component {
  static propTypes = {
    entry: PropTypes.object,
    baseEntry: PropTypes.object,
    isLoading: PropTypes.any,
    editMode: PropTypes.bool,
    targetExpanded: PropTypes.bool,
    optionsExpanded: PropTypes.bool,
    validationErrors: PropTypes.object,
    metadata: PropTypes.object,
    digit2Options: PropTypes.object,
    requiredAttendanceId: PropTypes.any,
    scenarioId: PropTypes.number,
    scenarioDescription: PropTypes.string,
    paging: PropTypes.object,
    filterElementKey: PropTypes.string,
    filterElementsIds: PropTypes.array,
    reference: PropTypes.string,
    search: PropTypes.object,
    copyTargetToggle: PropTypes.func,
    copyOptionsToggle: PropTypes.func,
    getRequiredAttendance: PropTypes.func,
    getRequiredAttendances: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
    if (isZeroId(props.baseEntry.id)) {
      props.history.push(removeLastPath(window.location.pathname));
    } else {
      const { scenarioId, filterElementKey, filterElementsIds, reference, search, paging: { pageNo, pageSize }, baseEntry: { id } } = props;
      props.getRequiredAttendances(
        { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, reference, search },
        { actionType: REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_REQUEST, id }
      );
    }
  }

  componentDidMount() {
    this.init(this.props);
    this.validator.onDidMount();
  }

  componentWillUnmount() {
    this.validator.onWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  @autobind
  onCancel() {
    const { requiredAttendanceId } = this.props;
    this.validator.onCancel(copyCancel(requiredAttendanceId));
  }

  @autobind
  onRun() {
    const { copyRun } = this.props;
    if (this.validator.onSave(this)) {
      copyRun();
    }
  }

  init(props) {
    const { editMode, metadata, validationErrors, entry } = props;
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
  }

  @autobind
  onChangeReference() {
    const { entry, entry: { references }, setEntry, getRequiredAttendance } = this.props;
    if (references) {
      if (references.length === 1 && references[0].id) {
        getRequiredAttendance(references[0].id, REQUIRED_ATTENDANCE_REFERENCES_REQUEST);
      } else {
        setEntry(fillSubEntry(entry, undefined, undefined, {
          groupType: {},
          jobTitle: {},
          jobTitleGroup: {},
          code: '',
          description: '',
          jobType: {},
          jobStatus: {},
        }));
      }
    }
  }

  render() {
    const {
      entry,
      editMode,
      isLoading,
      scenarioId,
      scenarioDescription,
      targetExpanded,
      optionsExpanded,
      copyTargetToggle,
      copyOptionsToggle,
    } = this.props;
    const {
      functionalCenter,
      references,
      code,
      description,
      jobType,
      groupType,
      jobTitle,
      jobTitleGroup,
      jobStatus,

      isIncludeSchedule,
      isIncludeTemporaryClosure,
      isIncludeBenefits,
      isIncludeReplacements,
      isIncludePremiums,
      isIncludePayrollDeductions,
      isIncludeSpecificDistribution,
      isIncludeAttachment,
      isIncludeNotes,
    } = entry;
    const { invalid, fields } = this.validator;
    const { flashErrors } = this.state;
    const useJobTitle = isJobTitleType(groupType);
    const isDisabledRequiredAttendanceFields = (references && references.length > 1);

    return (
      <div className='required-attendance' ref={ (node) => { this.formNode = node; } }>
        <div className='required-attendance__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='required-attendance__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title intlId='required-attendance-copy.title' />
                </Form.ActionsLeft>
              </Form.Actions>
              <Form.Section intlId='required-attendance-copy.required-attendance-to-be-copied'>
                <Form.Row>
                  <Form.Column>
                    <Field value={ scenarioDescription } disabled labelIntlId='required-attendance.selected-scenario' />
                  </Form.Column>
                  <Form.Column>
                    <FunctionalCenter
                      editMode={ false }
                      disabled
                      value={ functionalCenter }
                      labelIntlId='required-attendance.functional-center-code'
                      placeholderIntlId='required-attendance.functional-center-placeholder'
                    />
                  </Form.Column>
                  <Form.Column><Field.Info value={ functionalCenter && functionalCenter.longDescription } /></Form.Column>
                  <Form.Column>
                    <RequiredAttendanceReferences
                      editMode
                      value={ references }
                      validator={ fields.references }
                      queryParameters={ {
                        functionalCenterIds: (functionalCenter && functionalCenter.id ? [functionalCenter.id] : []),
                        scenarioId,
                      } }
                      onChange={ this.onChangeReference }
                      multiple
                      flashErrors={ flashErrors }
                    />
                  </Form.Column>
                </Form.Row>
              </Form.Section>
              <Form.Section intlId='required-attendance-copy.new-required-attendance'>
                <Form.Separator />
                <Form.Expandable
                  expand={ targetExpanded }
                  onToggle={ copyTargetToggle }
                  intlId='required-attendance-copy.financial-structure'
                >
                  <FinancialStructure
                    editMode={ editMode }
                    entry={ entry }
                    validator={ this.validator }
                  />
                </Form.Expandable>
                <Form.Separator />
                <Form.Expandable
                  expand={ optionsExpanded }
                  onToggle={ copyOptionsToggle }
                  intlId='required-attendance-copy.required-attendance'
                >
                  <div className='required-attendance__multicolumn'>
                    <div className='required-attendance__column3'>
                      <Form.Row>
                        <Form.Column33>
                          <GroupType
                            editMode
                            disabled={ isDisabledRequiredAttendanceFields }
                            validator={ fields.type }
                            value={ groupType }
                            labelIntlId='required-attendance.detail-type'
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                        <Form.Column33>
                          { useJobTitle
                            ?
                              <JobTitle
                                editMode
                                disabled={ isDisabledRequiredAttendanceFields }
                                validator={ fields.jobTitle }
                                value={ jobTitle }
                                labelIntlId={ null }
                                flashErrors={ flashErrors }
                              />
                            :
                              <JobTitleGroup
                                editMode
                                disabled={ isDisabledRequiredAttendanceFields }
                                validator={ fields.jobTitleGroup }
                                value={ jobTitleGroup }
                                labelIntlId={ null }
                                flashErrors={ flashErrors }
                              />
                          }
                        </Form.Column33>
                        <Form.Column33>
                          {useJobTitle
                            ? <Field.Info value={ jobTitle && jobTitle.description } />
                            : <Field.Info value={ jobTitleGroup && jobTitleGroup.longDescription } />
                          }

                        </Form.Column33>
                        <Form.Column />
                      </Form.Row>
                      <Form.Row>
                        <Form.Column33>
                          <Field.Input
                            editMode={ true }
                            disabled={ isDisabledRequiredAttendanceFields }
                            validator={ fields.reference }
                            value={ code }
                            labelIntlId='required-attendance.detail-reference'
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                        <Form.Column66>
                          <Field.Input
                            editMode={ true }
                            disabled={ isDisabledRequiredAttendanceFields }
                            validator={ fields.description }
                            value={ description }
                            labelIntlId='required-attendance.detail-reference-description'
                            flashErrors={ flashErrors }
                          />
                        </Form.Column66>
                        <Form.Column33 />
                      </Form.Row>
                      <Form.Row>
                        <Form.Column33>
                          <JobType
                            editMode
                            disabled={ isDisabledRequiredAttendanceFields }
                            validator={ fields.jobType }
                            value={ jobType }
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                        <Form.Column33><Field.Info value={ jobType && jobType.longDescription } /></Form.Column33>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column33>
                          <JobStatus
                            editMode
                            disabled={ isDisabledRequiredAttendanceFields }
                            validator={ fields.jobStatus }
                            value={ jobStatus }
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                        <Form.Column33><Field.Info value={ jobStatus && jobStatus.longDescription } /></Form.Column33>
                      </Form.Row>
                      <Form.Separator />
                      <Form.Row>
                        <Form.Column33>
                          <Switch
                            editMode
                            validator={ fields.isIncludeAttachment }
                            value={ isIncludeAttachment }
                            single
                            labelIntlId='required-attendance-copy.attached-documents'
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                        <Form.Column33>
                          <Switch
                            editMode
                            validator={ fields.isIncludeNotes }
                            value={ isIncludeNotes }
                            single
                            labelIntlId='required-attendance-copy.attached-notes'
                            flashErrors={ flashErrors }
                          />
                        </Form.Column33>
                      </Form.Row>
                    </div>
                    <div className='required-attendance__column1' >
                      <div className='required-attendance__column-header required-attendance__column-header--single'>
                        <FormattedMessage id='required-attendance-copy.info-copy' defaultMessage='Information to be copied' />
                      </div>
                      <Checkbox
                        value={ isIncludeSchedule }
                        editMode
                        labelIntlId='required-attendance-copy.copy-schedule'
                        validator={ fields.isIncludeSchedule }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludeTemporaryClosure }
                        editMode
                        labelIntlId='required-attendance-copy.copy-temporary-closures'
                        validator={ fields.isIncludeTemporaryClosure }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludeBenefits }
                        editMode
                        labelIntlId='required-attendance-copy.copy-benefits'
                        validator={ fields.isIncludeBenefits }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludePremiums }
                        editMode
                        labelIntlId='required-attendance-copy.copy-premiums'
                        validator={ fields.isIncludePremiums }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludeReplacements }
                        editMode
                        labelIntlId='required-attendance-copy.copy-replacements'
                        validator={ fields.isIncludeReplacements }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludePayrollDeductions }
                        editMode
                        labelIntlId='required-attendance-copy.copy-payroll-deductions'
                        validator={ fields.isIncludePayrollDeductions }
                        vertical
                        single
                      />
                      <Checkbox
                        value={ isIncludeSpecificDistribution }
                        editMode
                        labelIntlId='required-attendance-copy.copy-specific-distributions'
                        validator={ fields.isIncludeSpecificDistribution }
                        vertical
                        single
                      />
                    </div>
                  </div>
                </Form.Expandable>
              </Form.Section>
              <Form.FooterActions>
                <Form.Action type='cancel' intlId='action.cancel' disabled={ isLoading } onClick={ this.onCancel } />
                <Form.Action type='ok' intlId='action.ok' disabled={ isLoading } onClick={ this.onRun } validator={ this.validator } isLast />
              </Form.FooterActions>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(RequiredAttendancesCopy);
