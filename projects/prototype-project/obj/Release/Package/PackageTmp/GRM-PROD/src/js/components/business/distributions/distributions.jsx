import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { panelClose, panelOpen } from '../../general/popup/actions';
import { PopupActionKind } from '../../general/popup/constants';

import { requestRecalculatedDistributions } from './actions';

import Form from '../../general/form/form';
import Field from '../../controls/field';
import BenefitsModel from '../benefits-model/benefits-model';
import DistributionType from './distribution-type';
import { DISTRIBUTION_TYPE_MODEL } from '../../../entities/distribution';
import { increaseStateVersion } from '../../../utils/utils';

export const RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS = 'RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS';
export const RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS = 'RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS';


@connect(state => ({
  selectedModelRow: state.benefitsModel.selectedRow,
}), (dispatch) => bindActionCreators({
  panelOpen,
  requestRecalculatedDistributions,
}, dispatch))
export class Distributions extends Component {
  static propTypes = {
    entry: PropTypes.object,
    distributions: PropTypes.object,
    tableDistributions: PropTypes.object,
    distributionType: PropTypes.string,
    distributionTemplate: PropTypes.object,
    financialYearGroup: PropTypes.object,
    calculationBase: PropTypes.object,
    totalValue: PropTypes.number,
    selectedModelRow: PropTypes.object,
    intl: PropTypes.object,
    editMode: PropTypes.bool,
    isLoading: PropTypes.bool,
    validator: PropTypes.object,
    panelOpen: PropTypes.func,
    noModel: PropTypes.bool,
    recalculationType: PropTypes.string,
    requestRecalculatedDistributions: PropTypes.func,
    isNew: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      version: 0,
    };
  }

  @autobind
  handleDistributionTemplateOkClick() {
    const { selectedModelRow, validator, onChange, index, financialYearGroup, entry } = this.props;
    const { recalculationType, requestRecalculatedDistributions, distributions, distributionType, totalValue, calculationBase } = this.props;
    const { amountToBeDistributed } = entry;
    const { id, number, name } = selectedModelRow;
    if (validator && validator.fields && validator.fields.distributionTemplate) {
      validator.fields.distributionTemplate.onChange({ id, number, name }, index, undefined, () => {
        if (onChange) {
          onChange({ id, number, name });
        }
        if (requestRecalculatedDistributions) {
          requestRecalculatedDistributions(recalculationType, {
            distributions, distributionModel: { id, number, name }, distributionType, totalValue, calculationBase, amountToBeDistributed, financialYearGroup,
          });
        }
      });
    } else if (onChange) {
      onChange({ id, number, name });
    }
  }

  @autobind
  handleDistributionTemplateChange() {
    const { panelOpen } = this.props;
    panelOpen({
      Body: <BenefitsModel />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose },
        { kind: PopupActionKind.ok, func: this.handleDistributionTemplateOkClick },
      ],
    });
  }

  @autobind
  handleDistributionTemplateClear() {
    const { validator, onChange, index } = this.props;
    if (validator && validator.fields && validator.fields.distributionTemplate) {
      validator.fields.distributionTemplate.onClear(index, {}, () => {
        if (onChange) {
          onChange('');
        }
      });
    } else if (onChange) {
      onChange('');
    }
  }

  @autobind
  handleDistributionsTypeChange() {
    increaseStateVersion(this);
    this.handleDistributionsChange();
  }

  @autobind
  handleDistributionsChange() {
    const {
      requestRecalculatedDistributions,
      financialYearGroup,
      distributions,
      distributionType,
      totalValue,
      calculationBase,
      entry,
      recalculationType,
    } = this.props;
    const { distributionTemplate, amountToBeDistributed } = entry;

    requestRecalculatedDistributions(recalculationType, {
      distributions, distributionModel: distributionTemplate, distributionType, totalValue, calculationBase, amountToBeDistributed, financialYearGroup,
    });
  }

  render() {
    const { tableDistributions, editMode, intl, validator: { fields }, isLoading, entry,
      noModel, isNew, validationErrors } = this.props;
    const { distributionType, distributionTemplate, financialYearGroup, totalValue, recalculationType } = this.props;
    const { version } = this.state;

    const distributionsTitle = distributionTemplate && distributionTemplate.name ?
      intl.formatMessage({ id: 'budget-request.distributions-years' }, { years: `${ distributionTemplate.name }` }) : '';

    return (
      <Form.Row>
        <Form.Column>
          <DistributionType
            distributionType={ distributionType }
            financialYearGroup={ financialYearGroup }
            totalValue={ totalValue }
            editMode={ editMode }
            validator={ fields.distributionType }
            onChange={ this.handleDistributionsTypeChange }
            recalculationType={ recalculationType }
            isNew={ isNew }
          />
        </Form.Column>
        <Form.Column3>
          { !noModel && distributionType === DISTRIBUTION_TYPE_MODEL &&
            <Form.Column noLeftPadding>
              <div className='budget-request__column-header--bold'>{ distributionsTitle }</div>
              <Field.InputSearch
                editMode={ editMode }
                value={ distributionTemplate && distributionTemplate.number }
                validator={ fields.distributionTemplate }
                fieldName='distributionTemplate'
                onClick={ editMode ? this.handleDistributionTemplateChange : null }
                onClear={ editMode ? this.handleDistributionTemplateClear : null }
                labelIntlId='budget-request.distributions-model'
                rowMargins
              />
            </Form.Column>
          }
          <Form.Grid
            entry={ entry }
            editMode={ editMode }
            rows={ tableDistributions.rows }
            columns={ tableDistributions.columns }
            validator={ fields.distributions }
            isLoading={ isLoading }
            canRemoveRow={ false }
            canAddRow={ false }
            onChange={ this.handleDistributionsChange }
            version={ version }
            validationErrors={ validationErrors }
          />
        </Form.Column3>
      </Form.Row>
    );
  }

}
