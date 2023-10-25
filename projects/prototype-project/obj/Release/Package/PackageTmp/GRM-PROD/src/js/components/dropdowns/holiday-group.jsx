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
    id: 'entities.holiday-group.placeholder',
    defaultMessage: 'Select group...',
  },
  label: {
    id: 'entities.holiday-group.label',
    defaultMessage: 'Holiday group:',
  },
});

const SECTION = 'holiday-group';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class HolidayGroup extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.holiday-group.placeholder',
    labelIntlId: 'entities.holiday-group.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'description',
    fullSearch: true,
  };
}

