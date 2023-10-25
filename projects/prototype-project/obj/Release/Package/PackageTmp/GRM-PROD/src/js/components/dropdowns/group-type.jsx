import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import { getEntities } from '../../api/actions';
import { getEntitiesItems, getEntitiesIsLoading } from './reducers/entities';

import SimpleDropdown from './simple-dropdown';

defineMessages({
  placeholder: {
    id: 'entities.group-type.placeholder',
    defaultMessage: 'Select type...',
  },
  label: {
    id: 'entities.group-type.label',
    defaultMessage: 'Type:',
  },
});

const SECTION = 'groupTypes';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class GroupType extends SimpleDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.group-type.placeholder',
    labelIntlId: 'entities.group-type.label',
    itemValue: 'shortDescription',
  };
}

