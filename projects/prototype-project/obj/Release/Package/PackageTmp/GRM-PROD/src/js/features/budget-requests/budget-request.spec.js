import '../../test/mock-appinsight';

import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'intl';

import { shallowWithIntl } from '../../test/intl-enzyme-test-helper';
import fillDefaults from 'json-schema-fill-defaults';
import { BudgetRequestBase } from './budget-request';
import { budgetRequestSchema } from "../../entities/budget-request";

Enzyme.configure({ adapter: new Adapter() });

describe('budget request', () => {
  const entry = fillDefaults({}, budgetRequestSchema);
  const setTitle = () => {};
  const getBudgetRequest = () => {};
  const history = { push() {} };
  const props = { entry, setTitle, getBudgetRequest, history };
  const wrapper = shallowWithIntl(<BudgetRequestBase {...props} />);
  const component = wrapper.instance();

  describe('hourly factor', () => {
    it('should be disabled if request type code 180', () => {
      const type = { code: '180' }
      expect(component.hourlyFactorDisabled(type)).toBe(true);
    });
    it('should be enabled if request type code is not 180', () => {
      const type = { code: '150' }
      expect(component.hourlyFactorDisabled(type)).toBe(false);
    });
    it('should be disabled if attributeCode type code 40', () => {
      const type = { code: '150', attributeCode: '40' }
      expect(component.hourlyFactorDisabled(type)).toBe(true);
    });
    it('should be disabled if attributeCode type code 50', () => {
      const type = { code: '150', attributeCode: '50' }
      expect(component.hourlyFactorDisabled(type)).toBe(true);
    });
    it('should be enabled if attributeCode type code 30', () => {
      const type = { code: '150', attributeCode: '30' }
      expect(component.hourlyFactorDisabled(type)).toBe(false);
    });
  });
});
