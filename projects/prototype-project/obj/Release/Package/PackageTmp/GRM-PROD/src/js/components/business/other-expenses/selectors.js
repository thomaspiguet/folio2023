import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { getCurrencyOptions, formatDashesNumber } from '../../../utils/selectors/currency';

defineMessages({
  benefitsTitle: {
    id: 'summary-details.period',
    defaultMessage: 'PERIOD',
  },
  benefitsTableTitle: {
    id: 'summary-details.distribution',
    defaultMessage: 'DISTRIBUTION',
  },
  benefitsTableKeyword: {
    id: 'summary-details.amount',
    defaultMessage: 'AMOUNT',
  },
});

export const extractDistributions = createSelector(
  [
    (state) => state.otherExpensesDetails.summaryDetails.periods,
    (state) => getCurrencyOptions(state),
  ],
  (periods, currencyOptions) => {
    const columns = [
      {
        id: 'period',
        accessor: 'period',
        intlId: 'summary-details.period',
        width: 90,
        sortable: false,
      },
      {
        id: 'distribution',
        accessor: 'distribution',
        intlId: 'summary-details.distribution',
        isNumber: true,
        sortable: false,
      },
      {
        id: 'amount',
        accessor: 'amount',
        intlId: 'summary-details.amount',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = [];

    periods.forEach((period, idx) => {
      rows.push({
        period: `${ ++idx }`,
        distribution: formatDashesNumber(period.rate, currencyOptions),
        amount: formatDashesNumber(period.amount, currencyOptions),
      });
    });

    return {
      rows,
      columns,
    };
  }
);
