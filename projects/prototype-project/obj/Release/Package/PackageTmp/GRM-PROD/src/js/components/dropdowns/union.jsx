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
    id: 'entities.union.placeholder',
    defaultMessage: 'Select union...',
  },
  label: {
    id: 'entities.union.label',
    defaultMessage: 'Union:',
  },
});

const SECTION = 'union';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class Union extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.union.placeholder',
    labelIntlId: 'entities.union.label',
    itemValue: 'code',
    fullSearch: true,
  };
}

