import {
  DASHBOARD_SET_BUDGETS,
  DASHBOARD_GET_DATA,
  DASHBOARD_GOT_DATA,
  DASHBOARD_SET_PERIOD,
  DASHBOARD_GOT_PERIOD,
  DASHBOARD_SET_YEAR,
  DASHBOARD_GOT_YEAR,
  DASHBOARD_SET_YEAR_AND_PERIOD,
  DASHBOARD_EXPAND_CHART,
  DASHBOARD_SET_PAGE_SIZE,
} from './actions';
import {
  BUDGET_SELECTED_SUCCESS,
  BUDGET_OPTIONS_SUCCESS,
  BUDGET_ACTUAL_YEAR_SUCCESS,
  BUDGET_ACTUAL_PERIOD_SUCCESS,
  BUDGET_OTHER_SUCCESS,
} from '../../api/actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';

const initialData = [
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 202, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'FEB', description: 'Test - tous code sec', FTE: 200.0, Amounts: 302.0, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'MAR', description: 'Test - tous code sec', FTE: 100.0, Amounts: 402.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'APR', description: 'Temps supplementaire', FTE: 200.0, Amounts: 502.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'MAY', description: 'M.O.I', FTE: 300.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'JUN', description: 'Salaries', FTE: 200.0, Amounts: 502.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'JUL', description: 'M.O.I', FTE: 300.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'AUG', description: 'Test - tous code sec', FTE: 200.0, Amounts: 702.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'SEP', description: 'Temps supplementaire', FTE: 400.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'OCT', description: 'Salaries', FTE: 200.0, Amounts: 82, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'NOV', description: 'Salaries', FTE: 500.0, Amounts: 104.0, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'DEC', description: 'Temps supplementaire', FTE: 200.0, Amounts: 40.0, HOURS: 20 },

  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'FEB', description: 'M.O.I', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'MAR', description: 'Temps supplementaire', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'APR', description: 'Temps supplementaire', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'MAY', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'JUN', description: 'Temps supplementaire', FTE: 730.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'JUL', description: 'M.O.I', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'AUG', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'SEP', description: 'Temps supplementaire', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'OCT', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'NOV', description: 'Test - tous code sec', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o1', year: 2017, month: 'DEC', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },

  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'JAN', description: 'Test - tous code sec', FTE: 100.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'FEB', description: 'Salaries', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'MAR', description: 'Temps supplementaire', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'APR', description: 'M.O.I', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'MAY', description: 'Salaries', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'JUN', description: 'M.O.I', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'JUL', description: 'Test - tous code sec', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'AUG', description: 'Temps supplementaire', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'SEP', description: 'Salaries', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'OCT', description: 'Salaries', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'NOV', description: 'Temps supplementaire', FTE: 96.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's3', organization: 'o1', year: 2017, month: 'DEC', description: 'Salaries', FTE: 96.0, Amounts: 202.0, HOURS: 20 },

  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'FEB', description: 'Temps supplementaire', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'MAR', description: 'Salaries', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'APR', description: 'Salaries', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'MAY', description: 'M.O.I', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'JUN', description: 'Temps supplementaire', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'JUL', description: 'Test - tous code sec', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'AUG', description: 'Temps supplementaire', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'SEP', description: 'Temps supplementaire', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'OCT', description: 'M.O.I', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'NOV', description: 'Test - tous code sec', FTE: 200.0, Amounts: 182.01, HOURS: 20 },
  { budget: 'b2', section: 's1', organization: 'o1', year: 2017, month: 'DEC', description: 'Temps supplementaire', FTE: 200.0, Amounts: 182.01, HOURS: 20 },

  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'JAN', description: 'Test - tous code sec', FTE: 100.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'FEB', description: 'Salaries', FTE: 30.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'MAR', description: 'M.O.I', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'APR', description: 'Test - tous code sec', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'MAY', description: 'M.O.I', FTE: 30.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'JUN', description: 'Temps supplementaire', FTE: 30.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'JUL', description: 'Salaries', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'AUG', description: 'Salaries', FTE: 30.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'SEP', description: 'Temps supplementaire', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'OCT', description: 'Salaries', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'NOV', description: 'Temps supplementaire', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'DEC', description: 'Salaries', FTE: 130.0, Amounts: 182.0, HOURS: 20 },

  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'JAN', description: 'Test - tous code sec', FTE: 100.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'FEB', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'MAR', description: 'Temps supplementaire', FTE: 96.0, Amounts: 282.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'APR', description: 'Salaries', FTE: 96.0, Amounts: 582.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'MAY', description: 'Temps supplementaire', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'JUN', description: 'Temps supplementaire', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'JUL', description: 'Salaries', FTE: 96.0, Amounts: 682.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'AUG', description: 'M.O.I', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'SEP', description: 'Test - tous code sec', FTE: 96.0, Amounts: 82.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'OCT', description: 'M.O.I', FTE: 96.0, Amounts: 82.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'NOV', description: 'Salaries', FTE: 96.0, Amounts: 782.0, HOURS: 20 },
  { budget: 'b2', section: 's3', organization: 'o1', year: 2017, month: 'DEC', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },

  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 202, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'FEB', description: 'Salaries', FTE: 200.0, Amounts: 302.0, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'MAR', description: 'Salaries', FTE: 100.0, Amounts: 402.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'APR', description: 'Salaries', FTE: 200.0, Amounts: 502.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'MAY', description: 'Salaries', FTE: 300.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'JUN', description: 'Salaries', FTE: 200.0, Amounts: 502.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'JUL', description: 'Salaries', FTE: 300.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'AUG', description: 'Salaries', FTE: 200.0, Amounts: 702.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'SEP', description: 'Salaries', FTE: 400.0, Amounts: 202.34, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'OCT', description: 'Salaries', FTE: 200.0, Amounts: 82, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'NOV', description: 'Salaries', FTE: 500.0, Amounts: 104.0, HOURS: 20 },
  { budget: 'b1', section: 's1', organization: 'o2', year: 2017, month: 'DEC', description: 'Salaries', FTE: 200.0, Amounts: 40.0, HOURS: 20 },

  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'FEB', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'MAR', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'APR', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'MAY', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'JUN', description: 'Salaries', FTE: 730.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'JUL', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'AUG', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'SEP', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'OCT', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'NOV', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },
  { budget: 'b1', section: 's2', organization: 'o2', year: 2017, month: 'DEC', description: 'Salaries', FTE: 130.0, Amounts: 202.0, HOURS: 20 },

  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'FEB', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'MAR', description: 'Salaries', FTE: 96.0, Amounts: 282.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'APR', description: 'Salaries', FTE: 96.0, Amounts: 582.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'MAY', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'JUN', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'JUL', description: 'Salaries', FTE: 96.0, Amounts: 682.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'AUG', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'SEP', description: 'Salaries', FTE: 96.0, Amounts: 82.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'OCT', description: 'Salaries', FTE: 96.0, Amounts: 82.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'NOV', description: 'Salaries', FTE: 96.0, Amounts: 782.0, HOURS: 20 },
  { budget: 'b3', section: 's3', organization: 'o1', year: 2017, month: 'DEC', description: 'Salaries', FTE: 96.0, Amounts: 182.0, HOURS: 20 },
];

const initialState = {
  sections: {
    's1': { title: 'Total lignes a 1-5' },
    's2': { title: 'Total du budget' },
    's3': { title: 'Ligne 20-Ind. Perf' },
  },
  currency: {
    'FTE': { symbol: '$', format: '%s%v %c', code: 'USD' },
    'Amounts': { symbol: '$', format: '%s%v %c', code: 'USD' },
  },
  budgets: {
    'b1': { title: 'Current Budget', color: '#ffb915' },
    'b2': { title: 'Budget-SGA_2017_ORI', color: '#00bdd5' },
  },
  data: initialData,
  budgetOptions: [
    // { 'id': 1, section: 1, 'description': 'Salaires', 'order': 1, 'type': 1 },
    // { 'id': 2, section: 1, 'description': 'Temps supplémentaire', 'order': 2, 'type': 1 },
    // { 'id': 3, section: 1, 'description': 'M.O.I.', 'order': 3, 'type': 1 },
    // { 'id': 4, section: 1, 'description': 'Primes', 'order': 4, 'type': 1 },
    // { 'id': 5, section: 1, 'description': 'Autres', 'order': 5, 'type': 1 },
    // { 'id': 6, section: 1, 'description': 'Total rémunéré', 'order': 6, 'type': 0 },
    // { 'id': 8, section: 2, 'description': 'Autres dépenses', 'order': 7, 'type': 1 },
    // { 'id': 9, section: 2, 'description': 'Revenus', 'order': 8, 'type': 1 },
    // { 'id': 10, section: 2, 'description': 'Total du budget', 'order': 9, 'type': 0 },
    // { 'id': 11, section: 3, 'description': 'Cible', 'order': 10, 'type': 0 },
    // { 'id': 12, section: 3, 'description': 'Écart', 'order': 11, 'type': 0 },
    // { 'id': 7, section: 4, 'description': 'À déterminer', 'order': 12, 'type': 2 },
    // { 'id': 13, section: 4, 'description': 'Unité de mesure A', 'order': 13, 'type': 2 },
    // { 'id': 14, section: 4, 'description': 'Unité de mesure B', 'order': 14, 'type': 2 },
    // { 'id': 15, section: 4, 'description': 'Unité de mesure C', 'order': 15, 'type': 2 },
    // { 'id': 16, section: 4, 'description': 'Av. soc. gén.', 'order': 16, 'type': 1 },
    // { 'id': 17, section: 4, 'description': 'Fournitures', 'order': 17, 'type': 1 },
    // { 'id': 18, section: 4, 'description': 'Av. soc. part.', 'order': 18, 'type': 1 },
    // { 'id': 19, section: 4, 'description': 'Anastasiya', 'order': 19, 'type': 1 },
    // { 'id': 20, section: 4, 'description': 'Charges sociales', 'order': 20, 'type': 1 },
  ],
  budgetSelected: [
    // { 'fte': 0.0, 'rowOptionId': 6, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'fte': 0.0, 'rowOptionId': 9, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'fte': 0.0, 'rowOptionId': 10, 'amount': '17837100', 'hours': 0.0, 'isTotalRow': false },
    // { 'fte': 0.0, 'rowOptionId': 11, 'amount': '-17837100', 'hours': 0.0, 'isTotalRow': false },
  ],
  budgetActualPeriod: 3, // 1-13
  budgetActualPeriodLoading: false,
  budgetActualByPeriod: [
    // { 'rowOptionId': 6, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'rowOptionId': 9, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'rowOptionId': 10, 'amount': '412', 'hours': 1.0, 'isTotalRow': false },
    // { 'rowOptionId': 11, 'amount': '423432', 'hours': 4.0, 'isTotalRow': false },
  ],
  budgetActualYear: 2017,
  budgetActualYearLoading: false,
  budgetActualByYear: [
    // { 'rowOptionId': 6, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'rowOptionId': 9, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
    // { 'rowOptionId': 10, 'amount': '412', 'hours': 1.0, 'isTotalRow': false },
    // { 'rowOptionId': 11, 'amount': '423432', 'hours': 4.0, 'isTotalRow': false },
  ],
  budgetOther: [],
  isLoadingTable: false,
  chartExpanded: false,
  pageSize: 100,
};

function convertBudgetOptions(data) {
  return data;
}

function convertBudgetSelected(data) {
  return data;
}

function convertBudgetActual(data) {
  return data;
}

function convertBudgetOther(data) {
  return data;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_SET_PAGE_SIZE: {
      return {
        ...state,
        pageSize: action.payload,
      };
    }

    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
        pageSize: state.pageSize,
        isLoadingTable: true,
      };
    }

    case DASHBOARD_EXPAND_CHART: {
      return {
        ...state,
        chartExpanded: !state.chartExpanded,
      };
    }

    case BUDGET_OPTIONS_SUCCESS: {
      return {
        ...state,
        budgetOptions: convertBudgetOptions(action.payload),
      };
    }

    case BUDGET_SELECTED_SUCCESS: {
      return {
        ...state,
        budgetSelected: convertBudgetSelected(action.payload),
      };
    }

    case BUDGET_OTHER_SUCCESS: {
      return {
        ...state,
        budgetOther: convertBudgetOther(action.payload),
      };
    }

    case BUDGET_ACTUAL_PERIOD_SUCCESS: {
      return {
        ...state,
        budgetActualByPeriod: convertBudgetActual(action.payload),
        budgetActualPeriodLoading: false,
      };
    }

    case BUDGET_ACTUAL_YEAR_SUCCESS: {
      return {
        ...state,
        budgetActualByYear: convertBudgetActual(action.payload),
        budgetActualYearLoading: false,
      };
    }

    case DASHBOARD_SET_PERIOD:
      return {
        ...state,
        budgetActualPeriod: action.period,
        budgetActualPeriodLoading: true,
      };

    case DASHBOARD_GOT_PERIOD:
      return {
        ...state,
        budgetActualPeriodLoading: false,
      };

    case DASHBOARD_SET_YEAR:
      return {
        ...state,
        budgetActualYear: action.year,
        budgetActualYearLoading: true,
      };

    case DASHBOARD_GOT_YEAR:
      return {
        ...state,
        budgetActualYearLoading: false,
      };

    case DASHBOARD_SET_YEAR_AND_PERIOD:
      return {
        ...state,
        budgetActualYear: action.year,
        budgetActualPeriod: action.period,
      };

    case DASHBOARD_SET_BUDGETS:
      return {
        ...state,
        budgets: action.budgets,
      };

    case DASHBOARD_GET_DATA:
      return {
        ...state,
        isLoadingTable: true,
      };

    case DASHBOARD_GOT_DATA:
      return {
        ...state,
        isLoadingTable: false,
      };

    default:
      return state;
  }
}
