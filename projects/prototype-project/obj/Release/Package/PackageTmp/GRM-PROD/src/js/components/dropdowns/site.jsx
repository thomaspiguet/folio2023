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

import { entitiesQueryParametersSelector } from './selectors/entities-query-parameters';

defineMessages({
  placeholder: {
    id: 'entities.site.placeholder',
    defaultMessage: 'Select Sites...',
  },
  label: {
    id: 'entities.site.label',
    defaultMessage: 'Sites:',
  },
});

const SECTION = 'sites';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    parameters: entitiesQueryParametersSelector(state),
    entitiesParameters: getEntitiesParameters(state, SECTION),
    entitiesQueryParameters: getEntitiesQueryParameters(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class Site extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.site.placeholder',
    labelIntlId: 'entities.site.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}
