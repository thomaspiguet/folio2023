export const CONFIG_ENDPOINT = '/config.json';
export const REDIRECT_ENDPOINT = '/redirecturi';
export const LDAP_CHECK_ENDPOINT = '/api/Users/system';

export const BUDGET_OPTIONS_ENDPOINT = '/api/BudgetOptions';
export const BUDGET_SELECTED_ENDPOINT = '/api/BudgetDashboard';
export const BUDGET_ACTUAL_ENDPOINT = '/api/BudgetDashboard/actualData';
export const BUDGET_DETAILS_ENDPOINT = '/api/BudgetDetails';
export const BUDGET_OTHER_ENDPOINT = '/api/BudgetDashboard/scenarioToCompare';

export const CALCULATION_FOLLOW_UP_ENDPOINT = '/api/Calculation';

export const ORGANIZATIONS_ENDPOINT = '/api/organizations';
export const ALL_YEARS_ENDPOINT = '/api/FinancialYears/AllCodes';
export const YEARS_BY_ORGANIZATIONS_ENDPOINT = '/api/FinancialYears';
export const PERIODS_ENDPOINT = '/Periods';

export const RESPONSIBLE_ENDPOINT = '/api/Users/BudgetManagers';
export const FUNCTIONAL_CENTERS_ENDPOINT = '/api/FunctionalCenters';
export const BUDGET_SCENARIOS_ENDPOINT = '/api/Scenario/search';
export const SCENARIO_BY_ID_ENDPOINT = '/api/Scenario';
export const BUDGET_SCENARIO_COPY_METADATA_ENDPOINT = '/api/Scenario/Copy/Metadata';
export const BUDGET_SCENARIO_COPY_ENDPOINT = '/api/Scenario/Copy';

export const USER_INFO_ENDPOINT = '/api/Users';
export const FILTER_ELEMENTS_KEYS_ENDPOINT = '/api/Elements/Keys';
export const FILTER_ELEMENTS_ENDPOINT = '/api/Elements';

export const POSITIONS_ENDPOINT = '/api/Positions';
export const REQUIRED_ATTENDANCE_ENDPOINT = '/api/RequiredAttendances';
export const REQUIRED_ATTENDANCE_METADATA_ENDPOINT = '/api/RequiredAttendances/Metadata';
export const REQUIRED_ATTENDANCE_LIST_METADATA_ENDPOINT = '/api/RequiredAttendances/ListMetadata';
export const REQUIRED_ATTENDANCE_COPY_METADATA_ENDPOINT = '/api/RequiredAttendances/Copy/Metadata';
export const REQUIRED_ATTENDANCE_COPY_ENDPOINT = '/api/RequiredAttendances/Copy';
export const REQUIRED_ATTENDANCE_DEFAULT_ENDPOINT = '/api/RequiredAttendances/Default';
export const REQUIRED_ATTENDANCE_QUERY_ENDPOINT = '/api/QueryCaculatedExpenses';

export const DISTRIBUTION_EXPENSE_ENDPOINT = '/api/DistributionExpenses';
export const DISTRIBUTION_EXPENSE_DEFAULT_ENDPOINT = '/api/DistributionExpenses/Default';
export const DISTRIBUTION_EXPENSE_COPY_ENDPOINT = '/api/DistributionExpenses/Copy';
export const DISTRIBUTION_EXPENSE_COPY_METADATA_ENDPOINT = '/api/DistributionExpenses/Copy/Metadata';

export const DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED = '/api/DistributionExpenses/TotalToBeDistributed';

export const EMPLOYEES_ENDPOINT = '/api/Employees';

export const POSITIONS_BY_JOB_TITLE_ENDPOINT = '/api/PositionsByJobTitle';
export const BUDGET_REQUEST_ENDPOINT = '/api/BudgetRequests';
export const BUDGET_REQUEST_METADATA_ENDPOINT = '/api/BudgetRequests/Metadata';
export const BUDGET_REQUEST_LIST_METADATA_ENDPOINT = '/api/BudgetRequests/ListMetadata';
export const BUDGET_REQUEST_DEFAULT_ENDPOINT = '/api/BudgetRequests/Default';

export const OTHER_EXPENSES_ENDPOINT = '/api/RevenuesOtherExpenses';
export const OTHER_EXPENSES_DEFAULT_ENDPOINT = '/api/RevenuesOtherExpenses/Default';
export const OTHER_EXPENSES_METADATA_ENDPOINT = '/api/RevenuesOtherExpenses/Metadata';
export const OTHER_EXPENSES_HISTORY_BY_ID_ENDPOINT = '/api/RevenuesOtherExpensesHistory';
export const OTHER_EXPENSES_RECALCULATE_ENDPOINT = (id) => { return `/api/RevenuesOtherExpenses/${ id }/Recalculate`; };
export const REVENUE_AND_OTHER_EXPENSES_RECALCULATE_ENDPOINT = '/api/RevenuesOtherExpenses/Recalculate';

export const IMPORT_ENDPOINT = '/api/Imports';

export const PARAMETERS_BY_STRUCTURE_ENDPOINT = '/api/ParametersByStructure';

export const GLOBAL_PARAMETERS_ENDPOINT = '/api/ParametersByFinancialYear';

export const GROUP_TYPE_ENDPOINT = '/api/Elements?elementKey=TYPEREGRPOSTEDEMANDE&moduleKey=BUL';

export const REQUIRED_ATTENDANCE_TOTAL_HOURS_CALCULATION_ENDPOINT = '/api/RequiredAttendances/totalHours';

export const REQUIRED_ATTENDANCE_BENEFITS_DAYS_ENDPOINT = '/api/Benefits/Parameters';
export const BUDGET_REQUEST_BENEFITS_ENDPOINT = '/api/Benefits';

export const OTHER_RATES_ENDPOINT = '/api/HourlyRate/Others';

export const GROUP_LEVEL_ENDPOINT = '/api/SalaryLevel';

export const ORIGIN_REPLACEMENTS_ENDPOINT = '/api/OriginReplacements';

export const DISTRIBUTION_TEMPLATES_ENDPOINT = '/api/DistributionTemplates';
export const BUDGET_REQUEST_DISTRIBUTIONS_ENDPOINT = '/api/BudgetRequests/Distributions';

export const REQUIRED_ATTENDANCE_DASHBOARD_ENDPOINT = '/api/RequiredAttendanceDashboard';
export const REQUIRED_ATTENDANCE_DASHBOARD_METADATA_ENDPOINT = '/api/RequiredAttendanceDashboard/Metadata';
export const REQUIRED_ATTENDANCE_PARAMETERS_ENDPOINT = '/api/ParametersByFinancialYear/RequiredAttendance/Calendar/Others';
export const REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_TOTAL_ENDPOINT = '/api/RequiredAttendanceDashboard/TotalHours';
export const REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_ENDPOINT = '/api/RequiredAttendanceDashboard/Initialize';

export const GENERAL_LEDGER_ACCOUNT_ENDPOINT = '/api/GeneralLedgerAccount';
export const DISTRIBUTION_EXPENSES_COPY_DEFAULT_EXPENSE_ENDPOINT = '/api/DistributionExpenses/?disabledFields=TotalToBeDistributed';
