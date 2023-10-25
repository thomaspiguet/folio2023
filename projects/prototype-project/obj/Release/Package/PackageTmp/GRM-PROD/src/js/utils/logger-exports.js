import { createLogger } from 'redux-logger';

// Redux logger
const logger = createLogger({
  // State transformer
  // transforms Immutable maps from reducers
  // to the plain JS objects
  stateTransformer: (state) => {
    const newState = {};

    Object.keys(state).forEach((key) => {
      const stateItem = state[key];
      newState[key] = stateItem;
    });

    return newState;
  },
  collapsed: true,
});

export default logger;
