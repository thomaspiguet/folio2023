import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import { getEntitiesItems, getEntitiesIsLoading } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.job-type.placeholder',
    defaultMessage: 'Select job type...',
  },
  label: {
    id: 'entities.job-type.label',
    defaultMessage: 'Job type:',
  },
});

const SECTION = 'jobType';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class JobType extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.job-type.placeholder',
    labelIntlId: 'entities.job-type.label',
    itemValue: 'shortDescription',
  };
}

