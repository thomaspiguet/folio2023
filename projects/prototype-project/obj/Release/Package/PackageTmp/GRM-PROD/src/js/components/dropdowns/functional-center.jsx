import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFunctionalCenters } from '../../api/actions';

import CodeDescriptionDropdown from './code-description-dropdown';
import { entitiesQueryParametersSelector } from './selectors/entities-query-parameters';


function getFunctionalCentersEntities(metadata, parameters, queryParameters, filterKeyword = '') {
  return getFunctionalCenters(metadata, parameters, queryParameters, filterKeyword);
}

@connect(state => ({
  entities: state.entities.functionalCenters.items,
  isLoading: state.entities.functionalCenters.isLoading,
  parameters: entitiesQueryParametersSelector(state),
  entitiesParameters: state.entities.functionalCenters.parameters,
  entitiesQueryParameters: state.entities.functionalCenters.queryParameters,
  entitiesMetadata: state.entities.functionalCenters.metadata,
}),
  (dispatch) => bindActionCreators({
    getEntities: getFunctionalCentersEntities,
  }, dispatch))
export default class FunctionalCenter extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'scenario.administrative-units-placeholder',
    labelIntlId: 'scenario.administrative-units-title',
    fullSearch: true,
    // TODO: fix combination of paging and filtering
    // serverSearch: true,
  };
}

