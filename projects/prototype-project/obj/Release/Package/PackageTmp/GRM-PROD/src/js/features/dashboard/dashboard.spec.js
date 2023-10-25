import '../../test/mock-appinsight';
import { extractBudgetsAmount, extractBudgets } from './selectors';
import { initialState as scenarioInitialState } from '../scenario/reducers/scenario';

describe('dashboard selector', () => {
  const data = [
    { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'JAN', description: 'Salaries', FTE: 100.0, Amounts: 202, HOURS: 20 },
    { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'FEB', description: 'Test - tous code sec', FTE: 200.0, Amounts: 302.0, HOURS: 20 },
    { budget: 'b1', section: 's1', organization: 'o1', year: 2017, month: 'MAR', description: 'Test - tous code sec', FTE: 100.0, Amounts: 402.34, HOURS: 20 },

    { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'JAN', description: 'Test - tous code sec', FTE: 100.0, Amounts: 182.0, HOURS: 20 },
    { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'FEB', description: 'Salaries', FTE: 30.0, Amounts: 182.0, HOURS: 20 },
    { budget: 'b2', section: 's2', organization: 'o1', year: 2017, month: 'MAR', description: 'M.O.I', FTE: 130.0, Amounts: 182.0, HOURS: 20 },
  ];
  const state = {
    dashboard: {
      data,
      budgets: {
        'b1': { title: 'Current Budget', color: '#ffb915' },
        'b2': { title: 'Budget-SGA_2017_ORI', color: '#00bdd5' },
      },
      sections: {
        's1': { title: 'Total lignes a 1-5' },
        's2': { title: 'Total du budget' },
      },
      budgetOptions: [
        { 'id': 1, section: 1, 'description': 'Salaires', 'order': 1, 'type': 1 },
        { 'id': 2, section: 1, 'description': 'Temps supplémentaire', 'order': 2, 'type': 1 },
        { 'id': 3, section: 1, 'description': 'M.O.I.', 'order': 3, 'type': 1 },
        { 'id': 4, section: 1, 'description': 'Primes', 'order': 4, 'type': 1 },
        { 'id': 5, section: 1, 'description': 'Autres', 'order': 5, 'type': 1 },
        { 'id': 6, section: 1, 'description': 'Total rémunéré', 'order': 6, 'type': 0 },
        { 'id': 8, section: 2, 'description': 'Autres dépenses', 'order': 7, 'type': 1 },
        { 'id': 9, section: 2, 'description': 'Revenus', 'order': 8, 'type': 1 },
        { 'id': 10, section: 2, 'description': 'Total du budget', 'order': 9, 'type': 0 },
        { 'id': 11, section: 3, 'description': 'Cible', 'order': 10, 'type': 0 },
        { 'id': 12, section: 3, 'description': 'Écart', 'order': 11, 'type': 0 },
        { 'id': 7, section: 4, 'description': 'À déterminer', 'order': 12, 'type': 2 },
        { 'id': 13, section: 4, 'description': 'Unité de mesure A', 'order': 13, 'type': 2 },
        { 'id': 14, section: 4, 'description': 'Unité de mesure B', 'order': 14, 'type': 2 },
        { 'id': 15, section: 4, 'description': 'Unité de mesure C', 'order': 15, 'type': 2 },
        { 'id': 16, section: 4, 'description': 'Av. soc. gén.', 'order': 16, 'type': 1 },
        { 'id': 17, section: 4, 'description': 'Fournitures', 'order': 17, 'type': 1 },
        { 'id': 18, section: 4, 'description': 'Av. soc. part.', 'order': 18, 'type': 1 },
        { 'id': 19, section: 4, 'description': 'Anastasiya', 'order': 19, 'type': 1 },
        { 'id': 20, section: 4, 'description': 'Charges sociales', 'order': 20, 'type': 1 },
      ],
      budgetSelected: [
        { 'fte': 0.0, 'rowOptionId': 6, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
        { 'fte': 0.0, 'rowOptionId': 9, 'amount': '0', 'hours': 0.0, 'isTotalRow': true },
        { 'fte': 0.0, 'rowOptionId': 10, 'amount': '17837100', 'hours': 0.0, 'isTotalRow': false },
        { 'fte': 0.0, 'rowOptionId': 11, 'amount': '-17837100', 'hours': 0.0, 'isTotalRow': false },
      ],
    },
    app: {
      locale: 'en-CA',
      filter: {
        organization: 'o1',
        year: 2017,
        scenario: 'b2',
      },
      user: {

      }
    },
    scenario: scenarioInitialState,
  };

  const props = {
    setYear: () => {},
    setPeriod: () => {},
  };

  describe('extractBudgetsAmount', () => {
    const table = extractBudgetsAmount(state);

    it('should be an array', () => {
      expect(Array.isArray(table)).toBeTruthy();
    });

    it('should have line for every month', () => {
      expect(table.length).toBe(3);
      expect(table[0].month).toBe('JAN');
      expect(table[1].month).toBe('FEB');
      expect(table[2].month).toBe('MAR');
    });
  });

  describe('extractBudgets', () => {
    const table = extractBudgets(state, props);

    it('should be an object', () => {
      expect(typeof table).toBe('object');
    });

    it('should have columns', () => {
      expect(Array.isArray(table.columns)).toBeTruthy();
      expect(table.columns.length).toBeGreaterThan(0);
    });

    it('should have rows', () => {
      expect(Array.isArray(table.rows)).toBeTruthy();
      expect(table.rows.length).toBeGreaterThan(0);
    });
  });
});
