import React from 'react';
import { defineMessages } from 'react-intl';

import RadioButton from '../../components/controls/radio-button';
import {
  ADJUSTMENT_DISTRIBUTION_TYPE_MODEL,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR,
  ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT,
  ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD,
  ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE,
} from '../../entities/distribution';

defineMessages({
  distributionModel: {
    id: 'other-expenses.history.distribution-model',
    defaultMessage: 'Distribution model',
  },
  ratesEntered: {
    id: 'other-expenses.history.rates-entered',
    defaultMessage: 'Enter rates manually',
  },
  prevYear: {
    id: 'other-expenses.history.rate-based-on-previous-year',
    defaultMessage: 'Calculate distribution based on previous year',
  },
  otherAccount: {
    id: 'other-expenses.history.based-on-other-account',
    defaultMessage: 'Use distribution of another account',
  },
  period: {
    id: 'other-expenses.history.divided-by-number-period',
    defaultMessage: 'Value divided by the number of days in periods',
  },
  amountEntered: {
    id: 'other-expenses.history.amounts-entered',
    defaultMessage: 'Enter amounts manually',
  },
  prevYearMinusOne: {
    id: 'other-expenses.history.rate-based-on-previous-year-minus-one',
    defaultMessage: 'Calculate distribution based on previous year - 1',
  },
  distributionMethod: {
    id: 'other-expenses.history.distribution-method',
    defaultMessage: 'Distribution method:',
  },
});

export default function AdjustmentDistributionType(props) {
  const {
    editMode,
    validator,
    onChange,
    distributionType,
  } = props;

  return (
    <RadioButton
      value={ distributionType }
      labelIntlId='other-expenses.history.distribution-method'
      values={ [
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_MODEL,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_MODEL,
          intlId: 'other-expenses.history.distribution-model',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED,
          intlId: 'other-expenses.history.rates-entered',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR,
          intlId: 'other-expenses.history.rate-based-on-previous-year',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE,
          intlId: 'other-expenses.history.rate-based-on-previous-year-minus-one',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT,
          intlId: 'other-expenses.history.based-on-other-account',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD,
          intlId: 'other-expenses.history.divided-by-number-period',
          components: [],
        },
        {
          value: ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED,
          id: ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED,
          intlId: 'other-expenses.history.amounts-entered',
          components: [],
        },
      ] }
      editMode={ editMode }
      validator={ validator }
      onChange={ onChange }
      verticalAligned
    />
  );
}
