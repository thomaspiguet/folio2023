import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';
import { find } from 'lodash';

import { getEntities } from '../../api/actions';
import { getEntitiesIsLoading, getEntitiesItems } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.calculation-base.placeholder',
    defaultMessage: 'Select calculation base...',
  },
  label: {
    id: 'entities.calculation-base.label',
    defaultMessage: 'Calculation base:',
  },
});

export const CALCULATION_BASE_YEAR_EN = 'Year';
export const CALCULATION_BASE_SECTION = 'calculationBase';

@connect(state => (
  {
    entities: getEntitiesItems(state, CALCULATION_BASE_SECTION),
    isLoading: getEntitiesIsLoading(state, CALCULATION_BASE_SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(CALCULATION_BASE_SECTION),
  }, dispatch))
export default class CalculationBase extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.calculation-base.placeholder',
    labelIntlId: 'entities.calculation-base.label',
    itemValue: 'longDescription',
  };
}

export function getDefaultCalculationBase(calculationBaseEntities) {
  return find(calculationBaseEntities, { codeDescription: CALCULATION_BASE_YEAR_EN });
}
