import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import {
  getEntitiesItems,
  getEntitiesIsLoading,
  getEntitiesParameters,
  getEntitiesQueryParameters,
  getEntitiesMetadata,
} from './reducers/entities';

import CodeDescriptionDropdown from './code-description-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.nature-of-expense.placeholder',
    defaultMessage: 'Select nature of expense...',
  },
  label: {
    id: 'entities.nature-of-expense.label',
    defaultMessage: 'Nature of expense:',
  },
});

const SECTION = 'natureOfExpense';

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
export default class NatureOfExpense extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.nature-of-expense.placeholder',
    labelIntlId: 'entities.nature-of-expense.label',
    itemDescription: 'longDescription',
    itemCode: 'code',
    itemValue: 'code',
    fullSearch: true,
  };
}
