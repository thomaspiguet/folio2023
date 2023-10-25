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
import { entitiesQueryParametersSelector } from './selectors/entities-query-parameters';

import CodeDescriptionDropdown from './code-description-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.departments.placeholder',
    defaultMessage: 'Select departments...',
  },
  label: {
    id: 'entities.departments.label',
    defaultMessage: 'Departments:',
  },
});

export const SECTION = 'departments';

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
export default class Departments extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.departments.placeholder',
    labelIntlId: 'entities.departments.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
    // serverSearch: true,
  };
}
