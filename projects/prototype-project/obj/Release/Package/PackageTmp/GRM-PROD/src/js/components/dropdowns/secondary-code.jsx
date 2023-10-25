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
    id: 'entities.secondary-code.placeholder',
    defaultMessage: 'Select secondary code...',
  },
  label: {
    id: 'entities.secondary-code.label',
    defaultMessage: 'Secondary code:',
  },
});

const SECTION = 'secondaryCode';

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
export default class SecondaryCode extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.secondary-code.placeholder',
    labelIntlId: 'entities.secondary-code.label',
    itemDescription: 'longDescription',
    itemCode: 'code',
    itemValue: 'code',
    fullSearch: true,
  };
}
