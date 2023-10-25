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
    id: 'entities.payroll-deduction.placeholder',
    defaultMessage: 'Select payroll deduction...',
  },
  label: {
    id: 'entities.payroll-deduction.label',
    defaultMessage: 'Payroll deduction:',
  },
});

const SECTION = 'PayrollDeduction';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class PayrollDeduction extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.payroll-deduction.placeholder',
    labelIntlId: 'entities.payroll-deduction.label',
    itemValue: 'code',
    itemDescription: 'description',
    fullSearch: true,
  };
}

