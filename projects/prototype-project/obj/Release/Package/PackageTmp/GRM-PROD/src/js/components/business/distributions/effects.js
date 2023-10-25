import { put, take, select } from 'redux-saga/effects';

import { REQUEST_RECALCULATED_DISTRIBUTIONS } from './actions';
import {
  RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS,
  RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS,
} from './distributions';
import { scenarioSelector } from '../../../features/scenario/reducers/scenario';
import {
  getBudgetRequestDistributions,
  recalculateRevenueAndOtherExpensesHistoryAndDistributions,
} from '../../../api/actions';

export function convertBudgetRequestEntryForRecalculation(entry, financialYearId) {
  const { distributionType, totalValue, calculationBase, distributionModel } = entry;
  const requestParameters = {
    financialYearId,
    distributionType,
    totalValue,
  };
  if (calculationBase && calculationBase.id) {
    requestParameters.calculationBaseId = calculationBase.id;
  }
  if (distributionModel && distributionModel.id) {
    requestParameters.distributionModelId = distributionModel.id;
  } else {
    requestParameters.distributionModelId = 0;
  }
  return requestParameters;
}

export function convertRevenueAndOtherExpensesEntryForRecalculation(entry, financialYearId, scenarioId) {
  const { distributionType, distributionModel, totalAmount, calculationBase, amountToBeDistributed, financialYearGroup } = entry;
  const requestParameters = {
    financialYearId,
    scenarioId,
    amountToBeDistributed,
    distributionModel,
    distributionType,
    totalAmount,
    calculationBase,
    financialYearGroup,
  };
  if (distributionModel && !distributionModel.id) {
    requestParameters.distributionModel = null;
  }
  if (calculationBase && !calculationBase.id) {
    requestParameters.calculationBase = null;
  }
  if (financialYearGroup && !financialYearGroup.id) {
    requestParameters.financialYearGroup = null;
  }
  return requestParameters;
}


export function* getRecalculatedDistributions() {
  while (true) {
    const action = yield take(REQUEST_RECALCULATED_DISTRIBUTIONS);
    const { recalculationType, distributions } = action.payload;
    const { selectedScenario: { scenarioId, yearId: financialYearId } } = yield select(scenarioSelector);

    switch (recalculationType) {
      case RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS: {
        const requestParameters = convertBudgetRequestEntryForRecalculation(action.payload, financialYearId);
        yield put(getBudgetRequestDistributions(requestParameters, distributions));
        break;
      }

      case RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS: {
        const requestParameters = convertRevenueAndOtherExpensesEntryForRecalculation(action.payload, financialYearId, scenarioId);
        yield put(recalculateRevenueAndOtherExpensesHistoryAndDistributions(requestParameters, distributions));
        break;
      }

      default:
    }
  }
}
