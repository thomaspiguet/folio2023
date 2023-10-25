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
    id: 'entities.job-title-group.placeholder',
    defaultMessage: 'Select job title group...',
  },
  label: {
    id: 'entities.job-title-group.label',
    defaultMessage: 'Job title group:',
  },
});

const SECTION = 'jobTitleGroup';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class JobTitleGroup extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.job-title-group.placeholder',
    labelIntlId: 'entities.job-title-group.label',
    itemDescription: 'shortDescription',
    fullSearch: true,
  };
}

