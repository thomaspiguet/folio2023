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
    id: 'entities.job-title.placeholder',
    defaultMessage: 'Select job title...',
  },
  label: {
    id: 'entities.job-title.label',
    defaultMessage: 'Job title:',
  },
});

const SECTION = 'jobTitle';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class JobTitle extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.job-title.placeholder',
    labelIntlId: 'entities.job-title.label',
    itemDescription: 'description',
    itemCode: 'notaryEmploymentCode',
    itemValue: 'notaryEmploymentCode',
    fullSearch: true,
  };
}

