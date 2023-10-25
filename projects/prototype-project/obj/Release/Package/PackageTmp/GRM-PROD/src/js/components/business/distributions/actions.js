export const REQUEST_RECALCULATED_DISTRIBUTIONS = 'REQUEST_RECALCULATED_DISTRIBUTIONS';


export function requestRecalculatedDistributions(recalculationType, recalculationParameters) {
  return {
    type: REQUEST_RECALCULATED_DISTRIBUTIONS,
    payload: { recalculationType, ...recalculationParameters },
  };
}
