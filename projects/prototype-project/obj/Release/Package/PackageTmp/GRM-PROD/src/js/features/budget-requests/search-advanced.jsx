import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';

import FunctionalCenter from '../../components/dropdowns/functional-center';
import BudgetRequestType from '../../components/dropdowns/budget-request-type';
import NatureOfExpense from '../../components/dropdowns/nature-of-expense';
import SecondaryCode from '../../components/dropdowns/secondary-code';
import JobTitle from '../../components/dropdowns/job-title';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import ThreeStateOption from '../../components/controls/three-state-option';
import Checkbox from '../../components/controls/checkbox';
import Union from '../../components/dropdowns/union';

import SearchAdvanced from '../../components/general/search/search-advanced';

import { setSearchEntry, applyAdvancedSearch, clearAdvancedSearch } from './actions';
import { FormValidator } from '../../utils/components/form-validator';
import { popupOpen } from '../../components/general/popup/actions';
import { getDigit2Options } from '../../utils/selectors/currency';

const formOptions = {
  tabs: {
  },
  fields: {
    functionalCenter: {
      path: ['functionalCenter'],
      metadata: 'FunctionalCenterIds',
    },
    requestType: {
      path: ['requestType'],
      metadata: 'RequestTypeIds',
    },
    natureOfExpense: {
      path: ['natureOfExpense'],
      metadata: 'NatureOfExpenseIds',
    },
    secondaryCode: {
      path: ['secondaryCode'],
      metadata: 'SecondaryCodeIds',
    },
    description: {
      path: ['description'],
      metadata: 'description',
    },
    jobTitle: {
      path: ['jobTitle'],
      metadata: 'JobTitleIds',
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
      metadata: 'JobTitleGroupIds',
    },
    isSpecificRequest: {
      path: ['isSpecificRequest'],
      metadata: 'IsSpecificRequest',
    },
    isAmountToDistribute: {
      path: ['isAmountToDistribute'],
      metadata: 'IsAmountToDistribute',
    },
    forThisScenario: {
      path: ['forThisScenario'],
      metadata: 'forThisScenario',
    },
    union: {
      path: ['union'],
      metadata: 'UnionIds',
    },
  },
};

defineMessages({
  request: {
    id: 'budget-request.search.request',
    defaultMessage: 'Request:',
  },
  requestGenerated: {
    id: 'budget-request.search.request-generated',
    defaultMessage: 'Generated',
  },
  requestCustomized: {
    id: 'budget-request.search.request-customized',
    defaultMessage: 'Customized',
  },
  toBeDistributed: {
    id: 'budget-request.search.value-to-be-distritubed',
    defaultMessage: 'Value to be distributed:',
  },
  distributeHours: {
    id: 'budget-request.search.distribute-hours',
    defaultMessage: 'Hours',
  },
  distributeAmount: {
    id: 'budget-request.search.distribute-amount',
    defaultMessage: 'Amount',
  },
});

@connect(state => ({
  entry: state.budgetRequests.advancedSearch,
  show: state.budgetRequests.showAdvancedSearch,
  metadata: state.budgetRequests.listMetadata,
  digit2Options: getDigit2Options(state),
}), (dispatch) => bindActionCreators({
  popupOpen,
  setEntry: setSearchEntry,
  apply: applyAdvancedSearch,
  clear: clearAdvancedSearch,
}, dispatch))
class SearchAdvancedBudgetRequests extends PureComponent {
  static propTypes = {
    entry: PropTypes.object,
    editMode: PropTypes.bool,
    show: PropTypes.bool,
    metadata: PropTypes.object,
    digit2Options: PropTypes.object,
    validationErrors: PropTypes.object,
    apply: PropTypes.func,
    clear: PropTypes.func,
    popupOpen: PropTypes.func,
  };

  static defaultProps = {
    editMode: true,
    validationErrors: undefined,
    shiftedActions: true,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { editMode, metadata, validationErrors, entry } = props;
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
  }

  render() {
    const { fields } = this.validator;
    const {
      show,
      clear,
      apply,
      entry,
      metadata,
      shiftedActions,
    } = this.props;
    const {
      functionalCenter,
      requestType,
      natureOfExpense,
      secondaryCode,
      description,
      jobTitle,
      jobTitleGroup,
      isSpecificRequest,
      isAmountToDistribute,
      forThisScenario,
      union,
    } = entry;
    const isChamMode = metadata && metadata.isChamMode;
    return (
      <SearchAdvanced { ...{ show, clear, apply, shiftedActions } } >
        <Form.Row>
          <Form.Column>
            <FunctionalCenter
              editMode
              value={ functionalCenter }
              validator={ fields.functionalCenter }
              multiple
              labelIntlId='required-attendance.functional-center-code'
              placeholderIntlId='required-attendance.functional-center-placeholder'
            />
          </Form.Column>
          <Form.Column>
            <BudgetRequestType
              editMode
              validator={ fields.requestType }
              multiple
              value={ requestType }
              labelIntlId='budget-request.request-type'
            />
          </Form.Column>
          <Form.Column>
            { isChamMode ?
              <NatureOfExpense
                editMode
                validator={ fields.natureOfExpense }
                multiple
                value={ natureOfExpense }
              />
              :
              <SecondaryCode
                editMode
                validator={ fields.secondaryCode }
                multiple
                value={ secondaryCode }
              />
            }
          </Form.Column>
          <Form.Column>
            <Union
              editMode
              validator={ fields.union }
              multiple
              value={ union }
            />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <JobTitle
              editMode
              validator={ fields.jobTitle }
              multiple
              value={ jobTitle }
            />
          </Form.Column>
          <Form.Column>
            <JobTitleGroup
              editMode
              validator={ fields.jobTitleGroup }
              multiple
              value={ jobTitleGroup }
            />
          </Form.Column>
          <Form.Column2>
            <Field.Input
              editMode
              validator={ fields.description }
              value={ description }
              labelIntlId='budget-request.request-description'
              placeholderIntlId='budget-request.description-placeholder'
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <ThreeStateOption
              value={ isSpecificRequest }
              validator={ fields.isSpecificRequest }
              labelIntlId='budget-request.search.request'
              labelIntlIdYes='budget-request.search.request-generated'
              labelIntlIdNo='budget-request.search.request-customized'
            />
          </Form.Column>
          <Form.Column>
            <ThreeStateOption
              value={ isAmountToDistribute }
              validator={ fields.isAmountToDistribute }
              labelIntlId='budget-request.search.value-to-be-distritubed'
              labelIntlIdYes='budget-request.search.distribute-hours'
              labelIntlIdNo='budget-request.search.distribute-amount'
            />
          </Form.Column>
          <Form.Column>
            <Checkbox
              value={ forThisScenario }
              editMode
              labelIntlId='budget-request.for-this-scenario'
              validator={ fields.forThisScenario }
            />
          </Form.Column>
        </Form.Row>
      </SearchAdvanced>
    );
  }
}

export default injectIntl(SearchAdvancedBudgetRequests);
