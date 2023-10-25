import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import {
  getEntitiesIsLoading,
  getEntitiesItems,
  getEntitiesMetadata,
  getEntitiesParameters,
  getEntitiesQueryParameters,
} from './reducers/entities';

import CodeDescriptionDropdown from './code-description-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.distribution-expense-types.placeholder',
    defaultMessage: 'Select expense...',
  },
  label: {
    id: 'entities.distribution-expense-types.label',
    defaultMessage: 'Expense:',
  },
});

export const SECTION = 'targetDistributionExpenses';
export const DISTRIBUTION_EXPENSE_RESULT_TYPE = 'DistributionExpense';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesParameters: getEntitiesParameters(state, SECTION),
    entitiesQueryParameters: getEntitiesQueryParameters(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class DistributionExpenseType extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.distribution-expense-types.placeholder',
    labelIntlId: 'entities.distribution-expense-types.label',
    itemCode: 'code',
    uniqCode: 'id',
    itemValue: 'code',
    tagValue: 'longDescription',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}

