import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import {
  getEntitiesItems,
  getEntitiesIsLoading,
  getEntitiesMetadata,
} from './reducers/entities';

import CodeDescriptionDropdown from './code-description-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.expense-types.placeholder',
    defaultMessage: 'Select type...',
  },
  label: {
    id: 'entities.expense-types.label',
    defaultMessage: 'Expense type:',
  },
});

const SECTION = 'expense-types';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class ExpenseType extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.expense-types.placeholder',
    labelIntlId: 'entities.expense-types.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'shortDescription',
    fullSearch: true,
  };
}

