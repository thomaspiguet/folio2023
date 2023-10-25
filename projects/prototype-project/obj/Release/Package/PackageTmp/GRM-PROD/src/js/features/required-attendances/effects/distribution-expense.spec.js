import '../../../test/mock-appinsight';

import { put, select, take } from 'redux-saga/effects';
import {
  distributionExpenseCreateStart,
  distributionExpenseCreateSuccess,
  distributionExpenseEditSave
} from './distribution-expense';
import {
  createDistributionExpense as createDistributionExpenseApi,
  DISTRIBUTION_EXPENSE_CREATE_SUCCESS,
  DISTRIBUTION_EXPENSE_METADATA_SUCCESS, DISTRIBUTION_EXPENSE_SAVE_SUCCESS, getDistributionExpense,
  getDistributionExpenseDefault,
  getDistributionExpenseMetadata,
  getDistributionsList, REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS,
  saveDistributionExpense,
} from '../../../api/actions';
import {
  createDistributionExpense,
  DISTRIBUTION_EXPENSE_CREATE_START,
  DISTRIBUTION_EXPENSE_EDIT_SAVE,
  editSave,
} from '../actions/distribution-expense';
import { distributionExpenseSelector } from '../reducers/distribution-expense';
import { distributionExpenseConvertToSave } from '../../../entities/distribution';
import { requiredAttendancesSelector } from '../../required-attendances/reducers/required-attendances';

describe('distribution expense', () => {
  describe('create', () => {
    it('should fetch metadata and then default value', () => {
      const gen = distributionExpenseCreateStart();
      const id = 1;
      expect(gen.next().value).toEqual(take(DISTRIBUTION_EXPENSE_CREATE_START));
      expect(gen.next(createDistributionExpense(id)).value).toEqual(put(getDistributionExpenseMetadata(0)));
      expect(gen.next().value).toEqual(take(DISTRIBUTION_EXPENSE_METADATA_SUCCESS));
      expect(gen.next({type: DISTRIBUTION_EXPENSE_METADATA_SUCCESS}).value).toEqual(put(getDistributionExpenseDefault(id)));
    });
  });
  describe('save', () => {
    it('should save entity for non-zero id', () => {
      const gen = distributionExpenseEditSave();
      const id = 1;
      const entry = {};
      expect(gen.next().value).toEqual(take(DISTRIBUTION_EXPENSE_EDIT_SAVE));
      expect(gen.next(editSave(id, entry)).value).toEqual(select(distributionExpenseSelector));
      expect(gen.next({ entry }).value).toEqual(put(saveDistributionExpense(id, distributionExpenseConvertToSave(entry))));
    });
    it('should create entity for zero id', () => {
      const gen = distributionExpenseEditSave();
      const id = 0;
      const requiredAttendanceId = 42;
      const entry = {};
      expect(gen.next().value).toEqual(take(DISTRIBUTION_EXPENSE_EDIT_SAVE));
      expect(gen.next(editSave(id, entry)).value).toEqual(select(distributionExpenseSelector));
      expect(gen.next({ entry }).value).toEqual(select(requiredAttendancesSelector));
      expect(gen.next({ requiredAttendanceId }).value).toEqual(
        put(createDistributionExpenseApi(requiredAttendanceId, distributionExpenseConvertToSave(entry)))
      );
    });
  });
  describe('create success', () => {
    it('should update distributions list', () => {
      const gen = distributionExpenseCreateSuccess();
      const id = 1;
      const requiredAttendanceId = 42;
      const scenarioId = 11;

      expect(gen.next().value).toEqual(take([DISTRIBUTION_EXPENSE_CREATE_SUCCESS, DISTRIBUTION_EXPENSE_SAVE_SUCCESS]));
      expect(gen.next({type: DISTRIBUTION_EXPENSE_CREATE_SUCCESS, payload: { id } }).value).toEqual(select());
      expect(gen.next({
        requiredAttendances: { requiredAttendanceId },
        scenario: { selectedScenario: { scenarioId } },
      }).value).toEqual(put(getDistributionsList(requiredAttendanceId, scenarioId)));
      expect(gen.next().value).toEqual(take(REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS));
      expect(gen.next({type: REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS}).value).toEqual(put(getDistributionExpense(id)));
    });
  });
});
