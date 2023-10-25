import React from 'react';
import { isUndefined } from 'lodash';

import RadioButton from '../../controls/radio-button';
import {
  DISTRIBUTION_TYPE_MODEL,
  DISTRIBUTION_TYPE_MANUALLY_ENTERED_RATES,
  DISTRIBUTION_TYPE_MANUALLY_ENTERED_VALUES,
  DISTRIBUTION_TYPE_BASED_ON_SOURCE_DATA,
  DISTRIBUTION_TYPE_PERIOD,
  DISTRIBUTION_TYPE_DAY,
} from '../../../entities/distribution';
import { RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS } from './distributions';


function isManuallyEnteredRatesGrayedOut(recalculationType, isNew, financialYearGroup, totalValue) {
  if (recalculationType === RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS && isNew) {
    return (financialYearGroup && financialYearGroup.description && financialYearGroup.valueType);
  }
  return ((financialYearGroup && financialYearGroup.description && financialYearGroup.valueType) || totalValue === 0);
}

function isManuallyEnteredValuesGrayedOut(recalculationType, financialYearGroup) {
  return (financialYearGroup && financialYearGroup.description && financialYearGroup.valueType);
}

function isBasedOnSourceDataGrayedOut(recalculationType, financialYearGroup) {
  return isUndefined(financialYearGroup) || (financialYearGroup && isUndefined(financialYearGroup.description) && isUndefined(financialYearGroup.valueType));
}

function isDistributionPeriodAndDayGrayedOut(recalculationType, isNew, totalValue) {
  if (recalculationType === RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS && isNew) {
    return false;
  }
  return totalValue === 0;
}

export default function DistributionType(props) {
  const {
    editMode,
    validator,
    onChange,
    distributionType,
    financialYearGroup,
    totalValue,
    recalculationType,
    isNew,
  } = props;

  return (
    <RadioButton
      value={ distributionType }
      labelIntlId='budget-request.radio-button-distributions-colon'
      values={ [
        {
          value: DISTRIBUTION_TYPE_MODEL,
          id: DISTRIBUTION_TYPE_MODEL,
          intlId: 'budget-request.radio-button-distribution-model',
          components: [],
        },
        {
          value: DISTRIBUTION_TYPE_MANUALLY_ENTERED_RATES,
          id: DISTRIBUTION_TYPE_MANUALLY_ENTERED_RATES,
          intlId: 'budget-request.radio-button-manually-entered-rates',
          grayedOut: isManuallyEnteredRatesGrayedOut(recalculationType, isNew, financialYearGroup, totalValue),
          components: [],
        },
        {
          value: DISTRIBUTION_TYPE_MANUALLY_ENTERED_VALUES,
          id: DISTRIBUTION_TYPE_MANUALLY_ENTERED_VALUES,
          intlId: 'budget-request.radio-button-manually-entered-values',
          grayedOut: isManuallyEnteredValuesGrayedOut(recalculationType, financialYearGroup),
          components: [],
        },
        {
          value: DISTRIBUTION_TYPE_BASED_ON_SOURCE_DATA,
          id: DISTRIBUTION_TYPE_BASED_ON_SOURCE_DATA,
          intlId: 'budget-request.radio-button-based-on-source-data',
          grayedOut: isBasedOnSourceDataGrayedOut(recalculationType, financialYearGroup),
          components: [],
        },
        {
          value: DISTRIBUTION_TYPE_PERIOD,
          id: DISTRIBUTION_TYPE_PERIOD,
          intlId: 'budget-request.radio-button-distribution-period',
          grayedOut: isDistributionPeriodAndDayGrayedOut(recalculationType, isNew, totalValue),
          components: [],
        },
        {
          value: DISTRIBUTION_TYPE_DAY,
          id: DISTRIBUTION_TYPE_DAY,
          intlId: 'budget-request.radio-button-distribution-day',
          grayedOut: isDistributionPeriodAndDayGrayedOut(recalculationType, isNew, totalValue),
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
