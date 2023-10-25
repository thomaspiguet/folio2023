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
    id: 'entities.responsible-center-level-one.placeholder',
    defaultMessage: 'Select Respons. centers Level 1...',
  },
  label: {
    id: 'entities.responsible-center-level-one.label',
    defaultMessage: 'Respons. centers Level 1:',
  },
});

const SECTION = 'responsibilityCentersLevel1';

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
export default class ResponsibleCenterLevelOne extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.responsible-center-level-one.placeholder',
    labelIntlId: 'entities.responsible-center-level-one.label',
    itemCode: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}
