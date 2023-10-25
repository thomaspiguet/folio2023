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
    id: 'entities.job-status.placeholder',
    defaultMessage: 'Select job status...',
  },
  label: {
    id: 'entities.job-status.label',
    defaultMessage: 'Job status:',
  },
});

const SECTION = 'jobStatus';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class JobStatus extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.job-status.placeholder',
    labelIntlId: 'entities.job-status.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'longDescription',
    fullSearch: true,
  };
}

