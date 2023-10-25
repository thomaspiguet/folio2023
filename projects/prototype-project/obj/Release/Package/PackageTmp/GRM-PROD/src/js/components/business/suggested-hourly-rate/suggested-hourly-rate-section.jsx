import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';

import { formatNumber } from '../../../utils/selectors/currency';

import Form from '../../general/form/form';
import Field from '../../controls/field';
import RadioButton from '../../controls/radio-button';

import {
  fillSuggestedHourlyRate,
  getRateOriginDescription,
  getRateOriginFuncCode,
  isRateOriginUnknown,
  SuggestedHourlyRate,
} from './suggested-hourly-rate';

class SuggestedHourlyRateSection extends PureComponent {

  @autobind
  handleSuggestedHourlyRateEllipsisClick() {
    const { toggleSuggestedHourlyRateExpand, suggestedHourlyRate: { rateOriginType } } = this.props;
    if (!isRateOriginUnknown(rateOriginType)) {
      toggleSuggestedHourlyRateExpand();
    }
  }

  @autobind
  handleSuggestedSpecificRadioButtonChange(value) {
    const { calculateSuggestedHourlyRate, suggestedHourlyRate, onChangeSuggestedSpecific } = this.props;
    const newSuggetedHourlyRate = fillSuggestedHourlyRate(suggestedHourlyRate, value, calculateSuggestedHourlyRate);
    onChangeSuggestedSpecific(newSuggetedHourlyRate, value);
  }

  @autobind
  onChangeRateOriginType(value, jobGroupType, jobLevelType, rateOriginFunctionalCenterP) {
    const { calculateSuggestedHourlyRate } = this.props;
    calculateSuggestedHourlyRate(value, jobGroupType, jobLevelType, rateOriginFunctionalCenterP);
  }

  render() {
    const {
      fieldsSuggestedHourlyRate,
      flashErrors,
      wide,

      toggleSuggestedHourlyRateExpand,

      editMode,
      isSuggestedHourlyRateExpanded,
      calculatedSuggestedHourlyRate,
      digit2Options,
      intl,
      suggestedHourlyRate: {
        suggestedHourlyRate,
        specificHourlyRate,
        rateOriginType,
        rateOriginFunctionalCenter,
        jobGroupType,
        jobLevelType,
      },
      jobTitle,
      functionalCenter,
      formNode,
    } = this.props;

    const rateOriginFuncCode = getRateOriginFuncCode(rateOriginType, rateOriginFunctionalCenter, functionalCenter);
    const rateOriginDescription = getRateOriginDescription(rateOriginType, intl);

    const hourlyRateSuggestedSelected = !isRateOriginUnknown(rateOriginType);

    const FullComponent = wide ? Form.Column4 : Form.Column2;
    const HalfComponent = wide ? Form.Column2 : Form.Column;
    const PadComponent = wide ? 'div' : Form.Column2;

    return (
      <div className='suggested-hourly-rate__section'>
        <Form.Row>
          <FullComponent>
            <RadioButton
              value={ hourlyRateSuggestedSelected }
              labelIntlId='budget-request.hourly-rate-colon'
              values={ [
                { value: true, id: 'suggested', intlId: 'budget-request.hourly-rate-suggested' },
                { value: false, id: 'specific', intlId: 'budget-request.hourly-rate-specific' },
              ] }
              editMode={ editMode }
              onChange={ this.handleSuggestedSpecificRadioButtonChange }
              twoColumnsWidth
              flashErrors={ flashErrors }
            />
          </FullComponent>
          <PadComponent />
        </Form.Row>
        <Form.Row>
          <HalfComponent>
            <Field.Ellipsis
              editMode={ editMode }
              value={ hourlyRateSuggestedSelected ? formatNumber(suggestedHourlyRate, digit2Options) : undefined }
              disabled={ editMode && !hourlyRateSuggestedSelected }
              onClick={ this.handleSuggestedHourlyRateEllipsisClick }
              hideTitle
              validator={ fieldsSuggestedHourlyRate.columns.rateOriginType }
              flashErrors={ flashErrors }
            />
          </HalfComponent>
          <HalfComponent>
            <Field.Number2
              editMode={ editMode && !hourlyRateSuggestedSelected }
              disabled={ editMode && hourlyRateSuggestedSelected }
              validator={ fieldsSuggestedHourlyRate.columns.specificHourlyRate }
              value={ hourlyRateSuggestedSelected ? undefined : specificHourlyRate }
              hideTitle
              flashErrors={ flashErrors }
            />

          </HalfComponent>
          <PadComponent />
        </Form.Row>
        <SuggestedHourlyRate
          expand={ isSuggestedHourlyRateExpanded }
          toggleExpand={ toggleSuggestedHourlyRateExpand }
          editMode={ editMode }
          wide={ wide }
          rateOriginType={ rateOriginType }
          suggestedHourlyRate={ suggestedHourlyRate }
          calculatedSuggestedHourlyRate={ calculatedSuggestedHourlyRate }
          rateOriginFunctionalCenter={ rateOriginFunctionalCenter }
          validator={ fieldsSuggestedHourlyRate.columns.rateOriginType }
          onChange={ this.onChangeRateOriginType }
          rateValidator={ fieldsSuggestedHourlyRate.columns.suggestedHourlyRate }
          functionalCenterValidator={ fieldsSuggestedHourlyRate.columns.rateOriginFunctionalCenter }
          jobGroupValidator={ fieldsSuggestedHourlyRate.columns.jobGroupType }
          jobLevelValidator={ fieldsSuggestedHourlyRate.columns.jobLevelType }
          jobGroupType={ jobGroupType }
          jobLevelType={ jobLevelType }
          jobTitle={ jobTitle }
          formNode={ formNode }
          flashErrors={ flashErrors }
        />
        <Form.Row>
          <HalfComponent>
            <Field
              value={ rateOriginDescription }
              disabled={ editMode }
              labelIntlId='budget-request.rate-origin'
            />
          </HalfComponent>
          <HalfComponent>
            <Field
              value={ rateOriginFuncCode }
              disabled={ editMode }
              labelIntlId='budget-request.functional-center-code'
            />
          </HalfComponent>
          <PadComponent />
        </Form.Row>
      </div>
    );
  }
}

export default injectIntl(SuggestedHourlyRateSection);
