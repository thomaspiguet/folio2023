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
    id: 'entities.responsible-center-level-two.placeholder',
    defaultMessage: 'Select Respons. centers Level 2...',
  },
  label: {
    id: 'entities.responsible-center-level-two.label',
    defaultMessage: 'Respons. centers Level 2:',
  },
});

const SECTION = 'responsibilityCentersLevel2';

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
export default class ResponsibleCenterLevelTwo extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.responsible-center-level-two.placeholder',
    labelIntlId: 'entities.responsible-center-level-two.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}
