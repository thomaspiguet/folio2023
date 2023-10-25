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
    id: 'entities.long-term-leave.placeholder',
    defaultMessage: 'Select LT leave...',
  },
  label: {
    id: 'entities.long-term-leave.label',
    defaultMessage: 'LT leave expense:',
  },
});

const SECTION = 'longTermLeave';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class LongTermLeave extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.long-term-leave.placeholder',
    labelIntlId: 'entities.long-term-leave.label',
    itemCode: 'code',
    itemValue: 'code',
    itemDescription: 'description',
    fullSearch: true,
  };
}

