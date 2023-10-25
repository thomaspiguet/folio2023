import { booleanSchema, numberSchema, stringSchema } from './base';


export const parameterSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};

export const parametersSchema = {
  type: 'object',
  required: true,
  properties: {
    'StandardHours': parameterSchema,
    'Overtime': parameterSchema,
    'ExtraStaff': parameterSchema,
    'Holiday': parameterSchema,
    'PsychiatricLeave': parameterSchema,
    'Vacation': parameterSchema,
    'Sick': parameterSchema,
    'SickBank': parameterSchema,
    'NightShift': parameterSchema,
    'UnionDues': parameterSchema,
    'EmployeeDevelopment': parameterSchema,
    'PersonalHoliday': parameterSchema,
    'SalaryInsurance': parameterSchema,
    'PaternityMaternityLeave': parameterSchema,
    'LeaveOfAbsenceWithoutPay': parameterSchema,
    'CanadaPensionPlan': parameterSchema,
    'WorkersCompensationBoard': parameterSchema,
    'HealthCarePlan': parameterSchema,
    'EmploymentInsurance': parameterSchema,
    'PensionPlan': parameterSchema,
    'GlobalPayrollTaxes': parameterSchema,
    'FringeBenefits': parameterSchema,
    'QuebecParentalInsurancePlan': parameterSchema,
    'RequiredAttendance': parameterSchema,
    'TemporaryClosure': parameterSchema,
    'IndependentLabour': parameterSchema,
  },
};

export const payrollDeductionSchema = {
  type: 'object',
  required: true,
  properties: {
    'specificPayrolDedactionId': numberSchema,
    'parameters': parametersSchema,
    'specificParameters': parametersSchema,
    'calculateTaxableAmaunt': booleanSchema,
    'dateFrom': stringSchema,
    'dateTo': stringSchema,
    'amaunt': stringSchema,
    'specificAmount': stringSchema,
    'specificPayrollDeductions': booleanSchema,
  },
};

export const defaultPayrollDeductionSchema = {
  type: 'object',
  required: true,
  properties: {
    'code': stringSchema,
    'description': stringSchema,
  },
};

export const generalLedgerAccountSchema = {
  type: 'object',
  required: true,
  properties: {
    'id': numberSchema,
    'accountNumber': stringSchema,
    'description': stringSchema,
    'isFinancial': booleanSchema,
  },
};

export const payrollDeductionGlobalSchema = {
  type: 'object',
  required: true,
  properties: {
    'defaultPayrollDeduction': defaultPayrollDeductionSchema,
    'assignCalculationToSingleAccount': booleanSchema,
    'generalLedgerAccount': generalLedgerAccountSchema,
  },
};
