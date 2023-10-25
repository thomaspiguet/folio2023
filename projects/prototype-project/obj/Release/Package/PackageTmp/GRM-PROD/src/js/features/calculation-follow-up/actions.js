export const CALCULATION_FOLLOW_UP_LOAD_LIST = 'CALCULATION_FOLLOW_UP_LOAD_LIST';
export const CALCULATION_FOLLOW_UP_FINANCIAL_STRUCTURE_SECTION_TOGGLE = 'CALCULATION_FOLLOW_UP_FINANCIAL_STRUCTURE_SECTION_TOGGLE';
export const CALCULATION_FOLLOW_UP_OTHER_SECTION_TOGGLE = 'CALCULATION_FOLLOW_UP_OTHER_SECTION_TOGGLE';

export function getCalculationFollowUpList(pageNo, pageSize, force) {
  return {
    type: CALCULATION_FOLLOW_UP_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}

export function calculationDetailsFinancialStructureSectionToggle() {
  return {
    type: CALCULATION_FOLLOW_UP_FINANCIAL_STRUCTURE_SECTION_TOGGLE,
  };
}

export function calculationDetailsOtherSectionToggle() {
  return {
    type: CALCULATION_FOLLOW_UP_OTHER_SECTION_TOGGLE,
  };
}
