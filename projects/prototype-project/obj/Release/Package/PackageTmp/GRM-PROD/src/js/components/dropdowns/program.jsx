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
    id: 'entities.program.placeholder',
    defaultMessage: 'Select programs...',
  },
  label: {
    id: 'entities.program.label',
    defaultMessage: 'Programs:',
  },
});

const SECTION = 'programs';

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
export default class Program extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.program.placeholder',
    labelIntlId: 'entities.program.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}
