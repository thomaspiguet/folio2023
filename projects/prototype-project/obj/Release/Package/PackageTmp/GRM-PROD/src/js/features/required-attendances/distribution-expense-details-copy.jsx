import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import { FormValidator } from '../../utils/components/form-validator';
import { copyRun, copyCancel, copySetEntry } from './actions/distribution-expense';
import { ScrollBox } from '../../components/general/scroll-box';
import { popupOpen } from '../../components/general/popup/actions';

import Form from '../../components/general/form/form';
import FunctionalCenter from '../../components/dropdowns/functional-center';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import DistributionExpenseType from '../../components/dropdowns/distribution-expense-type';
import DistributionExpensesReferences from '../../components/dropdowns/distribution-expenses-references';
import FinancialStructure from '../../components/business/financial-structure/financial-structure';

import { getDigit2Options } from '../../utils/selectors/currency';
import { isZeroId, removeLastPath } from '../../utils/utils';

import { getDefaultDistributionExpenseTypeToCopy } from '../../api/actions';

const formOptions = {
  tabs: {
  },
  fields: {
    targetFunctionalCenter: {
      path: ['targetFunctionalCenter'],
      metadata: ['CopyTo', 'children', 'FunctionalCenterIds'],
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
    primaryCodeGroups: {
      path: ['primaryCodeGroups'],
      metadata: ['CopyTo', 'children', 'PrimaryCodeGroupsIds'],
    },
    sourceIds: {
      path: ['sourceIds'],
      metadata: ['CopyTo', 'children', 'SourceIds'],
    },
    targetDistributionExpenses: {
      path: ['targetDistributionExpenses'],
      metadata: ['CopyFrom', 'children', 'DistributionExpenseIds'],
    },
    isIncludeAttachment: {
      path: ['isIncludeAttachment'],
    },
  },
};

defineMessages({
  title: {
    id: 'distribution-expense-copy.title',
    defaultMessage: 'Copy: distribution',
  },
  toBeCopied: {
    id: 'distribution-expense-copy.distribution-expense-to-be-copied',
    defaultMessage: 'Specific distributions to be copied',
  },
  newDistributionExpense: {
    id: 'distribution-expense-copy.new-distribution-expense',
    defaultMessage: 'New distribution expense',
  },
  functionalCenter: {
    id: 'distribution-expense-copy.functional-center',
    defaultMessage: 'Functional center:',
  },
  functionalCenters: {
    id: 'distribution-expense-copy.functional-centers',
    defaultMessage: 'Functional centers:',
  },
  functionalCenterPlaceholder: {
    id: 'distribution-expense-copy.functional-center-placeholder',
    defaultMessage: 'Select functional centers...',
  },
  detailExpenses: {
    id: 'distribution-expense-copy.detail-expenses',
    defaultMessage: 'Expenses:',
  },
  attachedDocuments: {
    id: 'distribution-expense-copy.attached-documents',
    defaultMessage: 'Attached documents',
  },
  detailReference: {
    id: 'distribution-expense-copy.detail-reference',
    defaultMessage: 'Reference:',
  },
  detailReferences: {
    id: 'distribution-expense-copy.detail-references',
    defaultMessage: 'References:',
  },
  detailDepartments: {
    id: 'distribution-expense-copy.departments',
    defaultMessage: 'Departments:',
  },
  detailSubDepartments: {
    id: 'distribution-expense-copy.sub-departments',
    defaultMessage: 'Sub - departments:',
  },
  detailPrograms: {
    id: 'distribution-expense-copy.programs',
    defaultMessage: 'Programs:',
  },
  detailSubPrograms: {
    id: 'distribution-expense-copy.sub-programs',
    defaultMessage: 'Sub - programs:',
  },
  detailResponseCentersLevel1: {
    id: 'distribution-expense-copy.response-centers-level-1',
    defaultMessage: 'Respons. centers Level 1:',
  },
  detailResponseCentersLevel2: {
    id: 'distribution-expense-copy.response-centers-level-2',
    defaultMessage: 'Respons. centers Level 2:',
  },
  detailResponseCentersLevel3: {
    id: 'distribution-expense-copy.response-centers-level-3',
    defaultMessage: 'Respons. centers Level 3:',
  },
  detailSites: {
    id: 'distribution-expense-copy.sites',
    defaultMessage: 'Sites:',
  },
  detailPrimaryCodeGroups: {
    id: 'distribution-expense-copy.primary-code-groups',
    defaultMessage: 'Primary code groups:',
  },
  copyAlert: {
    id: 'distribution-expense-copy.copy-alert',
    defaultMessage: 'The distributions have been copied.',
  },
});

@connect(state => ({
  baseEntry: state.requiredAttendances.entry,
  entry: state.distributionExpenseCopy.entry,
  isLoading: state.distributionExpenseCopy.isLoading,
  validationErrors: state.distributionExpenseCopy.validationErrors,
  metadata: state.distributionExpenseCopy.metadata,
  editMode: state.distributionExpenseCopy.editMode,
  digit2Options: getDigit2Options(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
}), (dispatch) => bindActionCreators({
  copyRun,
  popupOpen,
  setEntry: copySetEntry,
  getDefaultDistributionExpenseTypeToCopy,
}, dispatch))
class DistributionExpenseCopy extends Component {
  static propTypes = {
    entry: PropTypes.object,
    baseEntry: PropTypes.object,
    isLoading: PropTypes.bool,
    editMode: PropTypes.bool,
    metadata: PropTypes.object,
    validationErrors: PropTypes.object,
    digit2Options: PropTypes.object,
    scenarioId: PropTypes.number,
    requiredAttendanceId: PropTypes.any,
    copyRun: PropTypes.func,
    popupOpen: PropTypes.func,
    setEntry: PropTypes.func,
    getDefaultDistributionExpenseTypeToCopy: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
    if (isZeroId(props.baseEntry.id)) {
      props.history.push(removeLastPath(window.location.pathname));
    } else {
      props.getDefaultDistributionExpenseTypeToCopy(props.baseEntry.id, props.entry.id);
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

  render() {
    const { entry, editMode, isLoading, baseEntry, scenarioId } = this.props;
    const {
      sourceIds,
      targetFunctionalCenter,
      targetDistributionExpenses,

      isIncludeAttachment,
    } = entry;
    const { code, functionalCenter, id: sourceId } = baseEntry;
    const { invalid, fields } = this.validator;
    const { flashErrors } = this.state;

    return (
      <div className='required-attendance' ref={ (node) => { this.formNode = node; } }>
        <div className='required-attendance__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='required-attendance__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title intlId='distribution-expense-copy.title' />
                </Form.ActionsLeft>
              </Form.Actions>
              <Form.Section intlId='distribution-expense-copy.distribution-expense-to-be-copied'>
                <Form.Row>
                  <Form.Column>
                    <FunctionalCenter
                      editMode={ false }
                      disabled
                      value={ functionalCenter }
                      labelIntlId='distribution-expense-copy.functional-center'
                      placeholderIntlId='distribution-expense-copy.functional-center-placeholder'
                    />
                  </Form.Column>
                  <Form.Column><Field.Info value={ functionalCenter && functionalCenter.longDescription } /></Form.Column>
                  <Form.Column>
                    <Field.Input
                      value={ code }
                      editMode={ false }
                      disabled
                      labelIntlId='distribution-expense-copy.detail-reference'
                    />
                  </Form.Column>
                  <Form.Column>
                    <DistributionExpenseType
                      editMode={ editMode }
                      validator={ fields.targetDistributionExpenses }
                      value={ targetDistributionExpenses }
                      queryParameters={ { sourceId } }
                      multiple
                      labelIntlId='distribution-expense-copy.detail-expenses'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column>
                </Form.Row>
              </Form.Section>
              <Form.Section intlId='distribution-expense-copy.new-distribution-expense'>
                <FinancialStructure
                  editMode={ editMode }
                  entry={ entry }
                  validator={ this.validator }
                />
                <Form.Separator />
                <Form.Row>
                  <Form.Column>
                    <DistributionExpensesReferences
                      editMode={ editMode }
                      validator={ fields.sourceIds }
                      queryParameters={ {
                        FunctionalCenterIds: map(targetFunctionalCenter, item => item.id),
                        ScenarioId: scenarioId,
                        PageNo: 1,
                        PageSize: 100,
                      } }
                      value={ sourceIds }
                      multiple
                      labelIntlId='distribution-expense-copy.detail-references'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column>
                  <Form.Column>
                    <Checkbox
                      validator={ fields.isIncludeAttachment }
                      editMode
                      value={ isIncludeAttachment }
                      labelIntlId='distribution-expense-copy.attached-documents'
                    />
                  </Form.Column>
                  <Form.Column2 />
                </Form.Row>
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

export default injectIntl(DistributionExpenseCopy);
