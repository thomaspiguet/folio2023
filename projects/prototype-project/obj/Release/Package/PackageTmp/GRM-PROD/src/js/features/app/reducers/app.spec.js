import '../../../test/mock-appinsight';

import reducer from './app';

describe('app reducer', () => {
  it('should have initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(Object.keys(state)).not.toHaveLength(0);
  });
});
