import { defineMessages } from 'react-intl';
import { get } from 'lodash';

import { historySchema, isEditableHistoryCell, canRemoveHistory } from '../../entities/history';
import { distributionOtherAccountSchema } from '../../entities/other-expenses';
import { financialYearGroupSchema } from '../../entities/financial-year-group';
import { calculationBaseSchema } from '../../entities/calculation-base';
import { numberSchema } from '../../entities/base';
import {
  DISTRIBUTION_TYPE_MODEL,
  distributionsSchema,
  isEditableDistributionAmountsCell,
  isEditableDistributionRatesCell,
} from '../../entities/distribution';

export const formOptions = {
  tabs: {
    details: {},
    distributions: {},
  },
  fields: {
    generalLedgerAccount: {
      path: ['generalLedgerAccount'],
      tabId: 'details',
      metadata: 'GeneralLedgerAccount',
      schema: distributionOtherAccountSchema,
      mandatory: true,
    },
    financialYearGroup: {
      path: ['financialYearGroup'],
      tabId: 'details',
      schema: financialYearGroupSchema,
      metadata: 'FinancialYearGroup',
    },
    amountToBeDistributed: {
      path: ['amountToBeDistributed'],
      tabId: 'details',
      schema: numberSchema,
      metadata: 'AmountToBeDistributed',
    },
    totalAmount: {
      path: ['totalAmount'],
      tabId: 'details',
      metadata: 'TotalAmount',
    },
    calculationBase: {
      path: ['calculationBase'],
      tabId: 'details',
      schema: calculationBaseSchema,
      metadata: 'CalculationBase',
      itemValue: 'longDescription',
    },
    history: {
      path: ['history'],
      tabId: 'details',
      schema: historySchema,
      confirmDeleteRow: true,
      canRemoveRow: (history) => {
        return canRemoveHistory(history);
      },
      metadata: 'History',
      columns: [
        {
          path: ['description'],
          id: 'description',
          metadata: 'Description',
          editable: isEditableHistoryCell,
        },
        {
          path: ['rateAmount'],
          id: 'rateAmount',
          metadata: 'RateAmount',
          editable: isEditableHistoryCell,
        },
        {
          path: ['adjustedAmount'],
          id: 'adjustedAmount',
          metadata: 'AdjustedAmount',
          editable: isEditableHistoryCell,
        },
        {
          path: ['totalAmount'],
          id: 'totalAmount',
          metadata: 'TotalAmount',
          editable: isEditableHistoryCell,
        },
      ],
    },
    distributions: {
      path: ['distributions'],
      tabId: 'distributions',
      schema: distributionsSchema,
      metadata: 'Distributions',
      columns: [
        {
          path: ['periods', 'period'],
          id: 'period',
          tabId: 'distributions',
        },
        {
          path: ['periods', 'rate'],
          id: 'rate',
          tabId: 'distributions',
          metadata: ['Periods', 'children', 'Rate'],
          editable: isEditableDistributionRatesCell,
        },
        {
          path: ['periods', 'amount'],
          id: 'amount',
          tabId: 'distributions',
          metadata: ['Periods', 'children', 'Amount'],
          editable: isEditableDistributionAmountsCell,
        },
      ],
    },
    distributionType: {
      path: ['distributionType'],
      tabId: 'distributions',
    },
    distributionTemplate: {
      path: ['distributionTemplate'],
      tabId: 'distributions',
      metadata: 'DistributionTemplate',
      mandatory: true,
      predicate: entry => get(entry, 'distributionType') === DISTRIBUTION_TYPE_MODEL,
    },
  },
};

defineMessages({
  title: {
    id: 'other-expenses.title',
    defaultMessage: 'Other expenses:',
  },
  itemTitle: {
    id: 'other-expenses.item-title',
    defaultMessage: 'Other expenses',
  },
  detailsTabTitle: {
    id: 'other-expenses.details',
    defaultMessage: 'Details',
  },
  historyTabTitle: {
    id: 'other-expenses.distributions',
    defaultMessage: 'Distributions',
  },
  year: {
    id: 'other-expenses.year',
    defaultMessage: 'Financial year:',
  },
  scenarioDescription: {
    id: 'other-expenses.scenario',
    defaultMessage: 'Scenario:',
  },
  account: {
    id: 'other-expenses.account',
    defaultMessage: 'Account:',
  },
  amountDistributed: {
    id: 'other-expenses.amount-distributed',
    defaultMessage: 'Amt to distribute:',
  },
  group: {
    id: 'other-expenses.group',
    defaultMessage: 'Group:',
  },
  calculationBase: {
    id: 'other-expenses.calculation-base',
    defaultMessage: 'Calculation base:',
  },
  totalAmount: {
    id: 'other-expenses.total-amount',
    defaultMessage: 'Total amount:',
  },
  distributions: {
    id: 'other-expenses.distributions',
    defaultMessage: 'Distributions',
  },
  historyTitle: {
    id: 'other-expenses.history-title',
    defaultMessage: 'History',
  },
  percentageDistributed: {
    id: 'other-expenses.percentage-distributed',
    defaultMessage: 'Percentage:',
  },
  otherExpensesDelete: {
    id: 'other-expenses.delete-confirmation',
    defaultMessage: 'Are you sure you want to delete the budget defined for the account: {otherExpensesTitle}?',
  },
  otherExpensesDeletedAlert: {
    id: 'other-expenses.deleted-alert',
    defaultMessage: 'Budget defined for the account: {otherExpensesTitle} has been deleted.',
  },
  addIndexation: {
    id: 'other-expenses.indexation',
    defaultMessage: 'INDEXATION',
  },
  addAdjustment: {
    id: 'other-expenses.adjustment',
    defaultMessage: 'ADJUSTMENT',
  },

});
