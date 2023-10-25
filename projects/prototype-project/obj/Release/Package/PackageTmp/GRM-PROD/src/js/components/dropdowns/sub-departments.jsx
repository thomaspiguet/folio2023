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
    id: 'entities.sub-departments.placeholder',
    defaultMessage: 'Select sub - departments...',
  },
  label: {
    id: 'entities.sub-departments.label',
    defaultMessage: 'Sub - departments:',
  },
});

export const SECTION = 'subDepartments';

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
export default class SubDepartments extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.sub-departments.placeholder',
    labelIntlId: 'entities.sub-departments.label',
    fullSearch: true,
    // serverSearch: true,
  };
}
