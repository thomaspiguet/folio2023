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
    id: 'entities.responsible-center-level-three.placeholder',
    defaultMessage: 'Select Respons. centers Level 3...',
  },
  label: {
    id: 'entities.responsible-center-level-three.label',
    defaultMessage: 'Respons. centers Level 3:',
  },
});

const SECTION = 'responsibilityCentersLevel3';

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
export default class ResponsibleCenterLevelThree extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.responsible-center-level-three.placeholder',
    labelIntlId: 'entities.responsible-center-level-three.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}
