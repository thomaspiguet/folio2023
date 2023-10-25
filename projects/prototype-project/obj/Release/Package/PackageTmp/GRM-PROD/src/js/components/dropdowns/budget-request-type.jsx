import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import {
  getEntitiesItems,
  getEntitiesIsLoading,
  getEntitiesParameters,
  getEntitiesMetadata,
} from './reducers/entities';

import CodeDescriptionDropdown from './code-description-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.budget-request-type.placeholder',
    defaultMessage: 'Select request type...',
  },
  label: {
    id: 'entities.budget-request-type.label',
    defaultMessage: 'Request type:',
  },
});

const SECTION = 'budgetRequestType';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesParameters: getEntitiesParameters(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class BudgetRequestType extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.budget-request-type.placeholder',
    labelIntlId: 'entities.budget-request-type.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}

