import '../../test/mock-appinsight';

import { extractData } from './selectors';
import { initialState as appInitialState } from '../../features/app/reducers/app';
import { initialState as salariesInitialState } from '../../features/salaries/reducer';

xdescribe('salaries selector', () => {
  const data = [
    { func: '001171 60001', description: 'Positions', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions by job title', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions attendance', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Requests', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
    { func: '001171 60001', description: 'Positions', details: 26, total: 23424, period01: 32, period02: 23, period03: 13, period04: 43, period05: 42, period06: 35, period07: 21, period08: 33, period09: 13, period10: 33, period11: 53, period12: 31, period13: 25 },
  ];
  const state = {
    salaries: salariesInitialState,
    app: appInitialState,
    scenario: { selectedScenario: {} },
  };

  describe('extractData', () => {
    const table = extractData(state);

    it('should be an object', () => {
      expect(typeof table).not.toHaveLength(0);
    });

    it('should have rows', () => {
      expect(table).to.have.property('rows').toEqual(data);
    });

    it('should have columns', () => {
      expect(Array.isArray(table)).not.toHaveLength(0);
    });

    it('should have columnsFixed', () => {
      expect(Array.isArray(table)).not.toHaveLength(0);
    });

    it('should have columnsScrolled', () => {
      expect(Array.isArray(table)).not.toHaveLength(0);
    });
  });
});
