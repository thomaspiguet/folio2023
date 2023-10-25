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
    id: 'entities.global-payroll-deduction.placeholder',
    defaultMessage: 'Select global payroll deduction...',
  },
  label: {
    id: 'entities.global-payroll-deduction.label',
    defaultMessage: 'Global payroll deduction:',
  },
});

const SECTION = 'GlobalPayrollDeduction';

@connect(state => (
  {
    entities: getEntitiesItems(state, SECTION),
    isLoading: getEntitiesIsLoading(state, SECTION),
    entitiesMetadata: getEntitiesMetadata(state, SECTION),
  }),
  (dispatch) => bindActionCreators({
    getEntities: getEntities(SECTION),
  }, dispatch))
export default class GlobalPayrollDeduction extends CodeDescriptionDropdown {
  static defaultProps = {
    placeholderIntlId: 'entities.global-payroll-deduction.placeholder',
    labelIntlId: 'entities.global-payroll-deduction.label',
    itemValue: 'code',
    itemDescription: 'description',
    fullSearch: true,
  };
}

