import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import { getEntitiesIsLoading, getEntitiesItems } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.financial-year-group.placeholder',
    defaultMessage: 'Select group...',
  },
  label: {
    id: 'entities.financial-year-group.label',
    defaultMessage: 'Group:',
  },
});

const SECTION = 'financialYearGroup';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class FinancialYearGroup extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.financial-year-group.placeholder',
    labelIntlId: 'entities.financial-year-group.label',
    itemValue: 'description',
  };
}

export const FINANCIAL_YEAR_GROUP_VALUE_TYPE_AMOUNT = 'Amount';
export const FINANCIAL_YEAR_GROUP_VALUE_TYPE_PERCENTAGE = 'Percentage';

export function getDefaultValuesToDistribute(newGroup) {
  const { isValueFixed, valueType, fixedAmountValue, fixedValueInPercentages } = newGroup || {};
  let updatedValuesToDistribute;
  if (isValueFixed) {
    if (valueType === FINANCIAL_YEAR_GROUP_VALUE_TYPE_AMOUNT) {
      updatedValuesToDistribute = fixedAmountValue;
    }
    if (valueType === FINANCIAL_YEAR_GROUP_VALUE_TYPE_PERCENTAGE) {
      updatedValuesToDistribute = fixedValueInPercentages;
    }
  } else {
    updatedValuesToDistribute = 0;
  }
  return updatedValuesToDistribute;
}

export function isFinancialGroupPercentage(financialYearGroup) {
  return financialYearGroup && financialYearGroup.valueType === FINANCIAL_YEAR_GROUP_VALUE_TYPE_PERCENTAGE;
}

