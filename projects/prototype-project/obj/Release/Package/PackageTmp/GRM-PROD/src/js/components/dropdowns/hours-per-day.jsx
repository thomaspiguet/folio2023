import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import { getEntitiesItems, getEntitiesIsLoading, getEntitiesParameters } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.hours-per-day.placeholder',
    defaultMessage: 'Select hours per day...',
  },
  label: {
    id: 'entities.hours-per-day.label',
    defaultMessage: 'Hours per day:',
  },
});

export const SECTION = 'hours-per-day';
export const HOURS_PER_DAY_RESULT_TYPE = 'HoursPerDay';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesParameters: getEntitiesParameters(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class HoursPerDay extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.hours-per-day.placeholder',
    labelIntlId: 'entities.hours-per-day.label',
    itemValue: 'value',
  };
}
