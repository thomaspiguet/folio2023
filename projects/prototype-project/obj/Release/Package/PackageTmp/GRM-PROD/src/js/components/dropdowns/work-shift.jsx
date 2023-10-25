import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import { getEntitiesItems, getEntitiesIsLoading } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.work-shift.placeholder',
    defaultMessage: 'Select work shift...',
  },
  label: {
    id: 'entities.work-shift.label',
    defaultMessage: 'Work shift:',
  },
});

const SECTION = 'work-shift';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class WorkShift extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.work-shift.placeholder',
    // labelIntlId: 'entities.work-shift.label',
    itemValue: 'longDescription',
  };
}

