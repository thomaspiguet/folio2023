import {
  buildExpenseDescription,
  isHourlyFactorEditable,
  isLongTermLeaveEditable,
  isValueToBeDistributedEditable,
  isCalculationCheckboxEditable,
  isTotalToBeDistributedDisabled,
  DISTRIBUTION_EXPENSE_CODE_SICK_DAY,
  DISTRIBUTION_EXPENSE_TYPE_MODEL,
  DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE,
  DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE,
  DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE,
  DISTRIBUTION_EXPENSE_CODE_PAT_MAT,
  DISTRIBUTION_EXPENSE_CODE_VACATION,
  DISTRIBUTION_EXPENSE_CODE_HOLIDAY,
  DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY,
  resetDistributions,
} from './distribution';
import { fakeIntl } from './fake-intl';

describe('distribution expense', () => {
  describe('build description', () => {
    const options = {
      isBenefitPercentage: true,
      valueToBeDistributed: DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY,
      expenseCodeDescription: DISTRIBUTION_EXPENSE_CODE_SICK_DAY,
      expenseLongDescription: 'Sick',
    };
    it('should be without addition for benefits non-percentages', () => {
      const str = buildExpenseDescription(fakeIntl, {
        ...options,
        isBenefitPercentage: false,
      });
      expect(str).toBe(options.expenseLongDescription);
    });
    it('should be with addition for benefits percentages', () => {
      const str = buildExpenseDescription(fakeIntl, {
        ...options,
      });
      expect(str).toBe(
        `${ options.expenseLongDescription } (${ 'distribution-expense.absence-for' })`
      );
    });
  });
  describe('distributions', () => {
    it('should reset distributions', () => {
      let distributions = {
        periods: [
          { period: 1, rate: 0, amount: 0 },
          { period: 2, rate: 0, amount: 0 },
          { period: 3, rate: 0, amount: 0 },
          { period: 4, rate: 0, amount: 0 },
          { period: 5, rate: 11.11, amount: 0.11 },
          { period: 6, rate: 11.11, amount: 0.11 },
          { period: 7, rate: 11.11, amount: 0.11 },
          { period: 8, rate: 11.11, amount: 0.11 },
          { period: 9, rate: 11.11, amount: 0.11 },
          { period: 10, rate: 11.11, amount: 0.11 },
          { period: 11, rate: 11.11, amount: 0.11 },
          { period: 12, rate: 11.11, amount: 0.11 },
          { period: 13, rate: 11.12, amount: 0.12 },
        ],
        totalAmount: 1,
        totalRate: 100,
      };

      const expectedResult = {
        periods: [
          { period: 1, rate: 0, amount: 0 },
          { period: 2, rate: 0, amount: 0 },
          { period: 3, rate: 0, amount: 0 },
          { period: 4, rate: 0, amount: 0 },
          { period: 5, rate: 0, amount: 0 },
          { period: 6, rate: 0, amount: 0 },
          { period: 7, rate: 0, amount: 0 },
          { period: 8, rate: 0, amount: 0 },
          { period: 9, rate: 0, amount: 0 },
          { period: 10, rate: 0, amount: 0 },
          { period: 11, rate: 0, amount: 0 },
          { period: 12, rate: 0, amount: 0 },
          { period: 13, rate: 0, amount: 0 },
        ],
        totalAmount: 0,
        totalRate: 0,
      };

      resetDistributions(distributions);

      expect(distributions).toEqual(expectedResult);
    });
  });
  describe('editable fields', () => {
    it('hourlyFactor should not be editable for non-applicable distribution type', () => {
      const result = isHourlyFactorEditable(DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
      expect(result).toBe(false);
    });
    it('hourlyFactor should be editable for non non-applicable distribution type', () => {
      const result = isHourlyFactorEditable(DISTRIBUTION_EXPENSE_TYPE_MODEL);
      expect(result).toBe(true);
    });
    it('valueToBeDistributed should not be editable for benefit days and sick day distribution type', () => {
      const result = isValueToBeDistributedEditable(false, DISTRIBUTION_EXPENSE_CODE_SICK_DAY);
      expect(result).toBe(false);
    });
    it('valueToBeDistributed should not be editable for psychiatric leave distribution type', () => {
      const result = isValueToBeDistributedEditable(true, DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE);
      expect(result).toBe(false);
    });
    it('valueToBeDistributed should be editable for benefit days and salary insurance distribution type', () => {
      const result = isValueToBeDistributedEditable(false, DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE);
      expect(result).toBe(true);
    });
    it('hourlyFactor should be editable for benefit percentage and non psychiatric leave distribution type', () => {
      const result = isValueToBeDistributedEditable(true, DISTRIBUTION_EXPENSE_CODE_SICK_DAY);
      expect(result).toBe(true);
    });
    it('LT leave should be editable if expense code is SalaryInsurance', () => {
      const result = isLongTermLeaveEditable(DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE);
      expect(result).toBe(true);
    });
    it('LT leave should be editable if expense code is PaternityMaternityLeave', () => {
      const result = isLongTermLeaveEditable(DISTRIBUTION_EXPENSE_CODE_PAT_MAT);
      expect(result).toBe(true);
    });
    it('Calculation checkboxes should NOT be editable if expense code is Vacation', () => {
      const result = isCalculationCheckboxEditable(DISTRIBUTION_EXPENSE_CODE_VACATION);
      expect(result).toBe(false);
    });
    it('Calculation checkboxes should NOT be editable if expense code is Holiday', () => {
      const result = isCalculationCheckboxEditable(DISTRIBUTION_EXPENSE_CODE_HOLIDAY);
      expect(result).toBe(false);
    });
    it('Calculation checkboxes should NOT be editable if expense code is SickDay', () => {
      const result = isCalculationCheckboxEditable(DISTRIBUTION_EXPENSE_CODE_SICK_DAY);
      expect(result).toBe(false);
    });
  });
  describe('total to be distributed', () => {
    it('should be disabled for non-applicable type', () => {
      const result = isTotalToBeDistributedDisabled(DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE, DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
      expect(result).toBe(true);
    });
    it('should not be disabled for non non-applicable type', () => {
      const result = isTotalToBeDistributedDisabled(DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE, DISTRIBUTION_EXPENSE_TYPE_MODEL);
      expect(result).toBe(false);
    });
  });
});

