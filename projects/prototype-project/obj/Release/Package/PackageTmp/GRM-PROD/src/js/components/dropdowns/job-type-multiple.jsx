import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import {
  getEntitiesItems,
  getEntitiesIsLoading,
  getEntitiesMetadata,
} from './reducers/entities';

import CodeDescriptionDropdown from './code-description-dropdown';

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
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class JobTypeMultiple extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.job-type.placeholder',
    labelIntlId: 'entities.job-type.label',
    // itemDescription: 'shortDescription',
    itemValue: 'shortDescription',
    fullSearch: true,
  };
}

