import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import CodeDescriptionDropdown from './code-description-dropdown';

import { getEntities } from '../../api/actions';
import {
  getEntitiesItems,
  getEntitiesIsLoading,
  getEntitiesParameters,
  getEntitiesQueryParameters,
  getEntitiesMetadata,
} from './reducers/entities';
import { entitiesQueryParametersSelector } from './selectors/entities-query-parameters';

defineMessages({
  placeholder: {
    id: 'entities.primary-code.placeholder',
    defaultMessage: 'Select primary code...',
  },
  label: {
    id: 'entities.primary-code.label',
    defaultMessage: 'Primary code:',
  },
});

const SECTION = 'primaryCode';

@connect(state => ({
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
export default class PrimaryCodeGroup extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.primary-code.placeholder',
    labelIntlId: 'entities.primary-code.label',
    fullSearch: true,
    // serverSearch: true,
  };
}
