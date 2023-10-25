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
    id: 'entities.premiums.placeholder',
    defaultMessage: 'Select premium...',
  },
  label: {
    id: 'entities.premiums.label',
    defaultMessage: 'Premium:',
  },
});

const SECTION = 'premiums';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class Premium extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.premiums.placeholder',
    labelIntlId: 'entities.premiums.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'description',
    fullSearch: true,
  };
}

