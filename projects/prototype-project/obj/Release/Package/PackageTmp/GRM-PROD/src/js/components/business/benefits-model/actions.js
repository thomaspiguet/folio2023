export const CLEAR_BENEFITS_MODEL_KEYWORD = 'CLEAR_BENEFITS_MODEL_KEYWORD';
export const FILTER_BENEFITS_MODEL_BY_KEYWORD = 'FILTER_BENEFITS_MODEL_BY_KEYWORD';
export const SET_SELECTED_BENEFITS_MODEL = 'SET_SELECTED_BENEFITS_MODEL';

export function filterBenefitsModelByKeyword(searchKeyword) {
  return {
    type: FILTER_BENEFITS_MODEL_BY_KEYWORD,
    payload: searchKeyword,
  };
}

export function clearBenefitsModelKeyword() {
  return {
    type: CLEAR_BENEFITS_MODEL_KEYWORD,
  };
}

export function setSelectedModel(originalRow) {
  return {
    type: SET_SELECTED_BENEFITS_MODEL,
    payload: { ...originalRow },
  };
}
