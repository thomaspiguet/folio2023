import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';

import './scenario-copy.scss';

import { FormValidator } from '../../utils/components/form-validator';
import { copyRun, copyInit, copyCancel, setEntry } from './actions/scenario-copy';
import { ScrollBox } from '../../components/general/scroll-box';
import { popupOpen } from '../../components/general/popup/actions';

import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Switch from '../../components/controls/switch';

import { getDigit2Options } from '../../utils/selectors/currency';
import { isZeroId } from '../../utils/utils';
import { routes } from '../app/app';

const formOptions = {
  tabs: {
  },
  fields: {
    targetScenarioName: {
      path: ['targetScenarioName'],
      mandatory: true,
      metadata: ['ToUpdateInCopy', 'children', 'ScenarioCode'],
      metadataDefault: {
        maxLength: 12,
      },
    },
    targetScenarioDescription: {
      path: ['targetScenarioDescription'],
      mandatory: true,
      metadata: ['ToUpdateInCopy', 'children', 'ScenarioDescription'],
      metadataDefault: {
        maxLength: 30,
      },
    },
    isIncludePositionsForThisScenario: {
      path: ['isIncludePositionsForThisScenario'],
    },
    isIncludePositionsByJobTitleForThisScenario: {
      path: ['isIncludePositionsByJobTitleForThisScenario'],
    },
    isIncludeRequiredAttendanceForThisScenario: {
      path: ['isIncludeRequiredAttendanceForThisScenario'],
    },
    isIncludeRequestsForThisScenario: {
      path: ['isIncludeRequestsForThisScenario'],
    },
    isIncludeInactivePositions: {
      path: ['isIncludeInactivePositions'],
    },
    isIncludeBudgetsForOtherExpenses: {
      path: ['isIncludeBudgetsForOtherExpenses'],
    },
    isImplementationScenario: {
      path: ['isImplementationScenario'],
    },
    isCopyJobTitleIndexationRates: {
      path: ['isCopyJobTitleIndexationRates'],
    },
    isCopyAttachedDocuments: {
      path: ['isCopyAttachedDocuments'],
    },
  },
};

defineMessages({
  title: {
    id: 'scenario-copy.title',
    defaultMessage: 'Copy: budget scenario',
  },
  toBeCopied: {
    id: 'scenario-copy.to-be-copied',
    defaultMessage: 'Scenario to be copied',
  },
  organization: {
    id: 'scenario-copy.organization',
    defaultMessage: 'Organization:',
  },
  financialYear: {
    id: 'scenario-copy.financial-year',
    defaultMessage: 'Financial year:',
  },
  scenario: {
    id: 'scenario-copy.scenario',
    defaultMessage: 'Scenario:',
  },
  scenarioPlaceholder: {
    id: 'scenario-copy.scenario-placeholder',
    defaultMessage: 'Type scenario title here...',
  },
  description: {
    id: 'scenario-copy.description',
    defaultMessage: 'Description:',
  },
  descriptionPlaceholder: {
    id: 'scenario-copy.description-placeholder',
    defaultMessage: 'Type description here...',
  },
  newScenario: {
    id: 'scenario-copy.new-scenario',
    defaultMessage: 'New scenario',
  },
  createSecondary: {
    id: 'scenario-copy.create-secondary-scenario',
    defaultMessage: 'Create secondary scenarios:',
  },
  copySuccess: {
    id: 'scenario-copy.copy-success',
    defaultMessage: 'The budget scenario has been copied',
  },
  infoToBeCopied: {
    id: 'scenario-copy.information-to-be-copied',
    defaultMessage: 'Information to be copied',
  },
  positionsForThisScenario: {
    id: 'scenario-copy.positions-for-this-scenario',
    defaultMessage: 'Positions for this scenario',
  },
  positionsByJobTitleForThisScenario: {
    id: 'scenario-copy.positions-by-job-title-for-this-scenario',
    defaultMessage: 'Positions by job title for this scenario',
  },
  requiredAttendanceForThisScenario: {
    id: 'scenario-copy.required-attendance-for-this-scenario',
    defaultMessage: 'Required attendance for this scenario',
  },
  requestsForThisScenario: {
    id: 'scenario-copy.requests-for-this-scenario',
    defaultMessage: 'Requests for this scenario',
  },
  inactivePositionsForThisScenario: {
    id: 'scenario-copy.inactive-positions-for-this-scenario',
    defaultMessage: 'Inactive positions',
  },
  budgetsForOtherExpenses: {
    id: 'scenario-copy.budgets-for-other-expenses',
    defaultMessage: 'Budgets for other expenses',
  },
  copyAsImplementation: {
    id: 'scenario-copy.copy-as-implementation-scenario',
    defaultMessage: 'Copy as implementation scenario',
  },
  copyIndexationRates: {
    id: 'scenario-copy.copy-job-title-indexation-rates',
    defaultMessage: 'The salary scale indexation rates',
  },
  copyAttachedDocuments: {
    id: 'scenario-copy.attach-documents',
    defaultMessage: 'Attach documents',
  },
});

@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  selectedScenario: state.scenario.selectedScenario,
  entry: state.scenarioCopy.entry,
  isLoading: state.scenarioCopy.isLoading,
  targetExpanded: state.scenarioCopy.targetExpanded,
  validationErrors: state.scenarioCopy.validationErrors,
  metadata: state.scenarioCopy.metadata,
  editMode: state.scenarioCopy.editMode,
  digit2Options: getDigit2Options(state),
  filterElementKey: state.filter.selectedDepartment,
  filterElementsIds: state.filter.selectedFilterElementsIds,
}), (dispatch) => bindActionCreators({
  copyRun,
  copyInit,
  popupOpen,
  setEntry,
}, dispatch))
class ScenarioCopy extends Component {
  static propTypes = {
    scenarioId: PropTypes.number,
    entry: PropTypes.object,
    isLoading: PropTypes.any,
    editMode: PropTypes.bool,
    validationErrors: PropTypes.object,
    metadata: PropTypes.object,
    digit2Options: PropTypes.object,
    paging: PropTypes.object,
    filterElementKey: PropTypes.string,
    filterElementsIds: PropTypes.array,

    copyRun: PropTypes.func,
    copyInit: PropTypes.func,
    popupOpen: PropTypes.func,
    setEntry: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    const { intl, popupOpen, digit2Options, scenarioId, history } = props;
    this.validator = new FormValidator(this, formOptions, intl, popupOpen, digit2Options);
    if (isZeroId(scenarioId)) {
      history.push(routes.SCENARIO.path);
    }
  }

  componentDidMount() {
    this.init(this.props, true);
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
    this.validator.onCancel(copyCancel());
  }

  @autobind
  onRun() {
    const { copyRun } = this.props;
    if (this.validator.onSave(this)) {
      copyRun();
    }
  }

  init(props, initial) {
    const { editMode, metadata, validationErrors, entry } = props;
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
    const { copyInit, selectedScenario } = props;
    if (initial) {
      copyInit(selectedScenario);
    }
  }

  render() {
    const {
      entry,
      editMode,
      isLoading,
    } = this.props;
    const {
      organization,
      financialYear,
      createSecondaryScenarios,
      targetFinancialYear,
      targetScenarioName,
      targetScenarioDescription,
      scenario: {
        scenarioCode,
        isImplementation,
        haveJobTitleIndexationRates,
      },
      isIncludePositionsForThisScenario,
      isIncludePositionsByJobTitleForThisScenario,
      isIncludeRequiredAttendanceForThisScenario,
      isIncludeRequestsForThisScenario,
      isIncludeInactivePositions,
      isIncludeBudgetsForOtherExpenses,
      isImplementationScenario,
      isCopyJobTitleIndexationRates,
      isCopyAttachedDocuments,
    } = entry;
    const { invalid, fields } = this.validator;
    const { flashErrors } = this.state;

    return (
      <div className='scenario-copy' ref={ (node) => { this.formNode = node; } }>
        <div className='scenario-copy__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='scenario-copy__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title intlId='scenario-copy.title' />
                </Form.ActionsLeft>
              </Form.Actions>
              <Form.Section intlId='scenario-copy.to-be-copied'>
                <Form.Row>
                  <Form.Column>
                    <Field value={ organization } disabled labelIntlId='scenario-copy.organization' />
                  </Form.Column>
                  <Form.Column>
                    <Field value={ financialYear } disabled labelIntlId='scenario-copy.financial-year' />
                  </Form.Column>
                  <Form.Column>
                    <Field value={ scenarioCode } disabled labelIntlId='scenario-copy.scenario' />
                  </Form.Column>
                  <Form.Column>
                    <Switch
                      value={ createSecondaryScenarios }
                      labelIntlId='scenario-copy.create-secondary-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column>
                </Form.Row>
                <Form.Separator />
                <Form.SectionTitle intlId='scenario-copy.information-to-be-copied' />
                <Form.Row>
                  <Form.Column2 >
                    <Switch
                      value={ isIncludeBudgetsForOtherExpenses }
                      validator={ fields.isIncludeBudgetsForOtherExpenses }
                      editMode
                      intlId='scenario-copy.budgets-for-other-expenses'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                  <Form.Column2>
                    <Switch
                      value={ isIncludePositionsForThisScenario }
                      validator={ fields.isIncludePositionsForThisScenario }
                      editMode
                      intlId='scenario-copy.positions-for-this-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column2 />
                  <Form.Column2>
                    <Switch
                      value={ isIncludePositionsByJobTitleForThisScenario }
                      validator={ fields.isIncludePositionsByJobTitleForThisScenario }
                      editMode
                      intlId='scenario-copy.positions-by-job-title-for-this-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column2 >
                    <Switch
                      value={ isImplementationScenario }
                      validator={ fields.isImplementationScenario }
                      available={ isImplementation }
                      editMode
                      intlId='scenario-copy.copy-as-implementation-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                  <Form.Column2>
                    <Switch
                      value={ isIncludeRequiredAttendanceForThisScenario }
                      validator={ fields.isIncludeRequiredAttendanceForThisScenario }
                      editMode
                      intlId='scenario-copy.required-attendance-for-this-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column2>
                    <Switch
                      value={ isCopyJobTitleIndexationRates }
                      validator={ fields.isCopyJobTitleIndexationRates }
                      available={ haveJobTitleIndexationRates }
                      editMode
                      intlId='scenario-copy.copy-job-title-indexation-rates'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                  <Form.Column2>
                    <Switch
                      value={ isIncludeRequestsForThisScenario }
                      validator={ fields.isIncludeRequestsForThisScenario }
                      editMode
                      intlId='scenario-copy.requests-for-this-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column2>
                    <Switch
                      value={ isIncludeInactivePositions }
                      validator={ fields.isIncludeInactivePositions }
                      editMode
                      intlId='scenario-copy.inactive-positions-for-this-scenario'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column2>
                  <Form.Column2 />
                </Form.Row>
              </Form.Section>
              <Form.Section intlId='scenario-copy.new-scenario'>
                <Form.Row>
                  <Form.Column>
                    <Field.Input
                      editMode={ editMode }
                      value={ targetFinancialYear.value }
                      disabled
                      labelIntlId='scenario-copy.financial-year'
                    />
                  </Form.Column>
                  <Form.Column>
                    <Field.Input
                      editMode={ editMode }
                      value={ targetScenarioName }
                      validator={ fields.targetScenarioName }
                      labelIntlId='scenario-copy.scenario'
                      placeholderIntlId='scenario-copy.scenario-placeholder'
                    />
                  </Form.Column>
                  <Form.Column2>
                    <Field.Input
                      editMode={ editMode }
                      value={ targetScenarioDescription }
                      validator={ fields.targetScenarioDescription }
                      labelIntlId='scenario-copy.description'
                      placeholderIntlId='scenario-copy.description-placeholder'
                    />
                  </Form.Column2>
                </Form.Row>
                <Form.Separator />
                <Form.Row>
                  <Form.Column>
                    <Switch
                      value={ isCopyAttachedDocuments }
                      validator={ fields.isCopyAttachedDocuments }
                      editMode
                      intlId='scenario-copy.attach-documents'
                      flashErrors={ flashErrors }
                    />
                  </Form.Column>
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

export default injectIntl(ScenarioCopy);
