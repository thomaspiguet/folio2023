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

defineMessages({
  placeholder: {
    id: 'entities.references.placeholder',
    defaultMessage: 'Select reference...',
  },
  label: {
    id: 'entities.references.label',
    defaultMessage: 'References:',
  },
});

const SECTION = 'references';

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
export default class RequiredAttendanceReferences extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.references.placeholder',
    labelIntlId: 'entities.references.label',
    itemCode: 'reference',
    itemDescription: 'description',
    itemValue: 'reference',
    fullSearch: true,
  };
}
