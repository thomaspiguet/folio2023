import fillDefaults from 'json-schema-fill-defaults';

import { PARAMETERS_BY_STRUCTURE_SET_GROUPS } from './actions';
import {
  PARAMETER_BY_STRUCTURE_FAILURE,
  PARAMETER_BY_STRUCTURE_REQUEST,
  PARAMETER_BY_STRUCTURE_SUCCESS,
  PARAMETERS_BY_STRUCTURE_FAILURE,
  PARAMETERS_BY_STRUCTURE_REQUEST,
  PARAMETERS_BY_STRUCTURE_SUCCESS,
} from '../../api/actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';

import { numberSchema, stringSchema } from '../../entities/base';
import { codeDescriptionSchema } from '../../entities/code-description';
import { modelSchema, othersRegularSchema } from '../../entities/parameters';
import { replacementsSchema } from '../../entities/replacements';

const emptyEntry = {
  financialYear: {},
  group: {},
  code: {},
  holidays: {
    holidayGroup: {
      id: undefined,
      code: undefined,
      description: undefined,
    },
    numberOfDaysPartTime: undefined,
  },
  vacationNumberOfAbsenceDaysPartTime: undefined,
  globalPremium: [
    {
      id: undefined,
      amount: undefined,
      distributionModel: {},
      natureExp: {},
    },
  ],
  globalPayrollDeduction: {
    id: undefined,
    code: undefined,
    shortDescription: undefined,
    longDescription: undefined,
  },
  globalSpecificPayrollDeduction: {
    PensionPlan: {
      code: undefined,
      description: undefined,
      id: undefined,
    },
    WorkersCompensationBoard: {
      code: undefined,
      description: undefined,
      id: undefined,
    },
  },
  globalSpecificPayrollDeductionCustom: {
    PensionPlan: {
      code: undefined,
      description: undefined,
      id: undefined,
    },
    WorkersCompensationBoard: {
      code: undefined,
      description: undefined,
      id: undefined,
    },
  },
  fourDaysScheduleSickDays: {
    numberOfDaysFullTime: undefined,
    numberOfDaysFullTimeManagement: undefined,
    numberOfDaysPartTime: undefined,
  },
  fourDaysScheduleVacationDays: undefined,
  fourDaysScheduleHolidayGroup: {
    id: undefined,
    code: undefined,
    description: undefined,
  },
  modelsAndBenefits: {
    fullTimeDistribution: {
      psychLeave: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      vacation: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      holidays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      sickDays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
    },
    partTimeDistribution: {
      psychLeave: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      vacation: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      holidays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      sickDays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
    },
    fullTimeFinalDistribution: {
      vacation: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      holidays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      sickDays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
    },
    partTimeFinalDistribution: {
      vacation: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      holidays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
      sickDays: {
        id: undefined,
        name: undefined,
        number: undefined,
      },
    },
  },
  othersFullTimeNightShift: {
    id: undefined,
    name: undefined,
    number: undefined,
  },
  calendar: {
    board: {
      id: 0,
      regular: {
        week: {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        },
        total: 0,
        title: 'string',
      },
      others: {},
    },
    otherNonWorkDays: [
      {
        id: 0,
        row: 0,
        expense: {
          shortDescription: 'string',
          longDescription: 'string',
          code: 'string',
          id: 0,
          codeDescription: 'string',
        },
        date: '2017-10-20T07:54:15.900Z',
        day: 'Sunday',
      },
    ],
  },
  othersRegularNonManagement: {
    hours: {
      id: undefined,
      name: undefined,
      number: undefined,
    },
    amounts: {
      id: undefined,
      name: undefined,
      number: undefined,
    },
  },
  othersRegularManagement: {
    hours: {
      id: undefined,
      name: undefined,
      number: undefined,
    },
    amounts: {
      id: undefined,
      name: undefined,
      number: undefined,
    },
  },
  expectedSickDaysPerEmployee: {
    numberOfDaysFullTime: undefined,
    numberOfDaysFullTimeManagement: undefined,
    numberOfDaysPartTime: undefined,
  },
  psychiatricLeaveCalculation: undefined,
  replacementsManagement: [],
  replacementsNonManagement: [],
  vacantPositionAndRequest: {
    rateOriginDescription: undefined,
    rateOriginType: undefined,
    jobGroupType: undefined,
    jobGroupValue: undefined,
    jobLevelType: undefined,
    jobLevelValue: undefined,
  },
  replacement: {
    rateOriginDescription: undefined,
    rateOriginType: undefined,
    jobGroupType: undefined,
    jobGroupValue: undefined,
    jobLevelType: undefined,
    jobLevelValue: undefined,
  },
};


const rateReplacementSchema = {
  type: 'object',
  required: true,
  properties: {
    rateOriginDescription: stringSchema,
    rateOriginType: stringSchema,
    jobGroupType: stringSchema,
    jobGroupValue: stringSchema,
    jobLevelType: stringSchema,
    jobLevelValue: stringSchema,
  },
};


const weekSchema = {
  type: 'object',
  required: true,
  properties: {
    Sunday: numberSchema,
    Monday: numberSchema,
    Tuesday: numberSchema,
    Wednesday: numberSchema,
    Thursday: numberSchema,
    Friday: numberSchema,
    Saturday: numberSchema,
  },
};

const scheduleSchema = {
  type: 'object',
  required: true,
  properties: {
    week: weekSchema,
    total: numberSchema,
    title: stringSchema,
  },
};

const othersSchema = {
  type: 'object',
  // items: scheduleSchema,
  required: true,
  properties: {
  },
};

const boardSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    regular: scheduleSchema,
    others: othersSchema,
  },
};

const calendarSchema = {
  type: 'object',
  required: true,
  properties: {
    board: boardSchema,
    otherNonWorkDays: {
      type: 'array',
      items: {
        type: 'object',
        required: true,
        properties: {
          id: numberSchema,
          row: numberSchema,
          expense: codeDescriptionSchema,
          date: stringSchema,
          day: stringSchema,
        },
      },
    },
  },
};

const holidayGroupSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};

const holidaysSchema = {
  type: 'object',
  required: true,
  properties: {
    holidayGroup: holidayGroupSchema,
    numberOfDaysPartTime: numberSchema,
  },
};

const pensionPlanSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};

const workersCompensationBoardSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};

const globalSpecificPayrollDeductionSchema = {
  type: 'object',
  required: true,
  properties: {
    WorkersCompensationBoard: workersCompensationBoardSchema,
    PensionPlan: pensionPlanSchema,
  },
};

const globalSpecificPayrollDeductionCustomSchema = {
  type: 'object',
  required: true,
  properties: {
    WorkersCompensationBoard: workersCompensationBoardSchema,
    PensionPlan: pensionPlanSchema,
  },
};

const initialState = {
  isLoading: false,
  data: null,
  paging: {
    'pageNo': 1, // from 1
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
  groups: [],
  options: {},
  entry: emptyEntry,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }
    case PARAMETERS_BY_STRUCTURE_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }
    case PARAMETERS_BY_STRUCTURE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case PARAMETERS_BY_STRUCTURE_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
        listResource: resource,
      };
    }
    case PARAMETERS_BY_STRUCTURE_FAILURE: {
      return {
        ...initialState,
        isLoading: false,
      };
    }
    case PARAMETER_BY_STRUCTURE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: fillDefaults(emptyEntry, modelSchema),
      };
    }

    case PARAMETER_BY_STRUCTURE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
          modelsAndBenefits: fillDefaults(action.payload.modelsAndBenefits, modelSchema),
          calendar: fillDefaults(action.payload.calendar, calendarSchema),
          othersRegularManagement: fillDefaults(action.payload.othersRegularManagement, othersRegularSchema),
          othersRegularNonManagement: fillDefaults(action.payload.othersRegularNonManagement, othersRegularSchema),
          replacementsManagement: fillDefaults(action.payload.replacementsManagement, replacementsSchema),
          replacementsNonManagement: fillDefaults(action.payload.replacementsNonManagement, replacementsSchema),
          replacement: fillDefaults(action.payload.replacement, rateReplacementSchema),
          vacantPositionAndRequest: fillDefaults(action.payload.vacantPositionAndRequest, rateReplacementSchema),
          holidays: fillDefaults(action.payload.holidays, holidaysSchema),
          globalSpecificPayrollDeduction: fillDefaults(action.payload.globalSpecificPayrollDeduction, globalSpecificPayrollDeductionSchema),
          globalSpecificPayrollDeductionCustom: fillDefaults(action.payload.globalSpecificPayrollDeductionCustom, globalSpecificPayrollDeductionCustomSchema),
        },
        id: action.options.resource.id,
      };
    }

    case PARAMETER_BY_STRUCTURE_FAILURE: {
      return {
        ...initialState,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    default:
      return state;
  }
}
