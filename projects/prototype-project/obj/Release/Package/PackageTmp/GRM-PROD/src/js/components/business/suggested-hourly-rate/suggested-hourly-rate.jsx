import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import Form from '../../general/form/form';
import Field from '../../controls/field';
import Button from '../../controls/button';
import RadioButton from '../../controls/radio-button';
import ModalEventsHandler from '../../../utils/components/modal-events-handler';

import { panelOpen, panelClose } from '../../general/popup/actions';
import { PopupActionKind } from '../../general/popup/constants';
import { isEmptyField } from '../../../utils/utils';

import OtherRates from './other-rates';
import GroupLevel from './group-level';
import { isJobTitleType } from '../../../entities/suggested-hourly-rate';

export const RATE_ORIGIN_UNKNOWN = 'Unknown';
export const RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE = 'FunctionalCenterAverage';
export const RATE_ORIGIN_JOB_TITLE_AVERAGE = 'JobTitleAverage';
export const RATE_ORIGIN_GROUP_LEVEL = 'GroupLevel';
export const RATE_ORIGIN_PARAMETERS = 'Parameters';


const JOB_FIRST = 'P';
const JOB_LAST = 'D';
const JOB_SPECIFIC = 'S';
const JOP_PROPERTY_GROUP = 'jobGroupType';
const JOP_PROPERTY_LEVEL = 'jobLevelType';

defineMessages({
  first: {
    id: 'suggested-hourly-rate.first',
    defaultMessage: 'First',
  },
  last: {
    id: 'suggested-hourly-rate.last',
    defaultMessage: 'Last',
  },
  specific: {
    id: 'suggested-hourly-rate.specific',
    defaultMessage: 'Specific',
  },
});

function isFirstLastType(type) {
  return type === JOB_FIRST || type === JOB_LAST;
}

function isSpecificType(type) {
  return type === JOB_SPECIFIC;
}

export function getRateOriginDescription(rateOriginType, intl) {
  let id;
  switch (rateOriginType) {
    case RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE:
      id = 'required-attendance.rate-origin.functional-center-average';
      break;
    case RATE_ORIGIN_JOB_TITLE_AVERAGE:
      id = 'required-attendance.rate-origin.job-title-average';
      break;
    case RATE_ORIGIN_PARAMETERS:
      id = 'required-attendance.rate-origin.parameters';
      break;
    case RATE_ORIGIN_GROUP_LEVEL:
      id = 'required-attendance.rate-origin.group-level';
      break;
    default:
      return '';
  }

  return intl.formatMessage({ id });
}

export function isRateOriginUnknown(rateOriginType) {
  return rateOriginType === RATE_ORIGIN_UNKNOWN;
}

export function isSuggestedHourlyRate(rateOriginType) {
  return !isRateOriginUnknown(rateOriginType);
}

export function getRateOriginFunctionalCenter(rateOriginType, rateOriginFunctionalCenter, functionalCenter) {
  if (rateOriginType === RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE) {
    return rateOriginFunctionalCenter || functionalCenter;
  }
  return functionalCenter;
}

export function getRateOriginFuncCode(rateOriginType, rateOriginFunctionalCenter, functionalCenter) {
  let rateOriginFuncCode;
  if (rateOriginType === RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE) {
    if (rateOriginFunctionalCenter && rateOriginFunctionalCenter.code) {
      rateOriginFuncCode = rateOriginFunctionalCenter.code;
    } else if (functionalCenter && functionalCenter.code) {
      rateOriginFuncCode = functionalCenter.code;
    }
  }
  return rateOriginFuncCode;
}

export function calculateSuggestedHourlyRate(context, rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue) {
  const {
    getSuggestedHourlyRate, url, scenarioId, financialYearId,
    functionalCenter, jobTitle, jobTitleGroup, groupType,
    suggestedHourlyRate,
    originType,
    requestType,
  } = context;
  const {
    rateOriginType,
      jobGroupType: jobGroupTypeL,
      jobLevelType: jobLevelTypeL,
      rateOriginFunctionalCenter: rateOriginFunctionalCenterL,
  } = suggestedHourlyRate;

  const jobGroupType = jobGroupTypeP || jobGroupTypeL;
  const jobLevelType = jobLevelTypeP || jobLevelTypeL;
  const rateOriginFunctionalCenter = (rateOriginFunctionalCenterP !== undefined) ? rateOriginFunctionalCenterP : rateOriginFunctionalCenterL;
  const isJobTitle = isJobTitleType(groupType);
  const type = rateType || rateOriginType;
  const isGroupLevel = type === RATE_ORIGIN_GROUP_LEVEL;
  const funcCenter = getRateOriginFunctionalCenter(type, rateOriginFunctionalCenter, functionalCenter);

  getSuggestedHourlyRate(url, scenarioId, financialYearId,
    originType, requestType,
    type,
    funcCenter ? funcCenter.id : undefined,
    isJobTitle ? (jobTitle ? jobTitle.id : undefined) : undefined,
    isJobTitle ? undefined : (jobTitleGroup ? jobTitleGroup.id : undefined),
    isGroupLevel ? jobGroupType : undefined,
    isGroupLevel ? jobLevelType : undefined,
    setValue);
}

export function fillSuggestedHourlyRate(suggestedHourlyRate, value, calculateSuggestedHourlyRate) {
  const {
    suggestedHourlyRate: suggestedHourlyRateFromProps,
    specificHourlyRate: specificHourlyRateFromProps,
    rateOriginType: rateOriginTypeFromProps,
    rateOriginFunctionalCenter: rateOriginFunctionalCenterFromProps,
    jobGroupType,
    jobLevelType,
  } = suggestedHourlyRate;

  const updatedRateOriginTypeValue = rateOriginTypeFromProps === RATE_ORIGIN_UNKNOWN ? RATE_ORIGIN_PARAMETERS : rateOriginTypeFromProps;
  const newSuggestedHourlyRate = value ? {
    suggestedHourlyRate: suggestedHourlyRateFromProps,
    specificHourlyRate: undefined,
    rateOriginType: updatedRateOriginTypeValue,
    rateOriginFunctionalCenter: rateOriginFunctionalCenterFromProps,
  } : {
    suggestedHourlyRate: undefined,
    specificHourlyRate: specificHourlyRateFromProps,
    rateOriginType: RATE_ORIGIN_UNKNOWN,
    rateOriginFunctionalCenter: undefined,
  };

  if (value) {
    calculateSuggestedHourlyRate(updatedRateOriginTypeValue, jobGroupType, jobLevelType, undefined, true);
  }

  return newSuggestedHourlyRate;
}


@connect(state => ({
}), (dispatch) => bindActionCreators({
  panelOpen,
}, dispatch))
class SuggestedHourlyRateClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      suggestedHourlyRate: '',
      functionalCenter: {},
      rateOriginType: RATE_ORIGIN_UNKNOWN,
    };
    this.node = undefined;
    this.modalHandler = new ModalEventsHandler(this.getNode, {
      onWheelEvent: () => {},
    });
  }

  @autobind
  getNode() {
    return this.node;
  }

  componentDidMount() {
    this.init(this.props, true);
    this.modalHandler.onMount(this.props.formNode);
  }

  componentWillUnmount() {
    this.modalHandler.onUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
    this.modalHandler.setFormNode(this.props.formNode);
  }

  init(props, initial) {
    const { editMode, rateOriginType, expand, suggestedHourlyRate, calculatedSuggestedHourlyRate,
      jobGroup, jobLevel, rateOriginFunctionalCenter } = props;
    let { jobGroupType, jobLevelType } = props;
    if (!jobGroupType) {
      jobGroupType = JOB_FIRST;
    }
    if (!jobLevelType) {
      jobLevelType = JOB_FIRST;
    }
    if (editMode) {
      const suggested = isEmptyField(calculatedSuggestedHourlyRate) ? suggestedHourlyRate : calculatedSuggestedHourlyRate;
      if (expand && (!this.props.expand || initial || !this.props.editMode)) {
        this.setState({ rateOriginType,
          calculatedSuggestedHourlyRate: suggestedHourlyRate,
          jobGroup,
          jobLevel,
          jobGroupType,
          jobLevelType,
          functionalCenter: rateOriginFunctionalCenter });
        this.onChangeRate(rateOriginType, undefined, undefined, undefined, rateOriginFunctionalCenter);
      } else {
        this.setState({ calculatedSuggestedHourlyRate: suggested });
      }
      this.modalHandler.block(expand);
    } else {
      this.setState({ rateOriginType,
        calculatedSuggestedHourlyRate: suggestedHourlyRate,
        jobGroup,
        jobLevel,
        jobGroupType,
        jobLevelType,
        functionalCenter: rateOriginFunctionalCenter });
    }
  }

  @autobind
  onSelectRate(row) {
    const { functionalCenter, hourlyRate } = row;
    this.setState({ functionalCenter, hourlyRate });
    this.setFirstFocus();
  }

  @autobind
  onOkRate() {
    const { functionalCenter, hourlyRate } = this.state;
    if (!functionalCenter || !functionalCenter.id) {
      return;
    }
    this.setState({ calculatedSuggestedHourlyRate: hourlyRate });
    this.setFirstFocus();
  }

  @autobind
  onOk() {
    const { validator, rateValidator, functionalCenterValidator,
      jobGroupValidator, jobLevelValidator,
      toggleExpand } = this.props;
    const { rateOriginType, functionalCenter, calculatedSuggestedHourlyRate, jobGroupType, jobLevelType } = this.state;
    const update = {};
    if (validator) {
      validator.onChange(rateOriginType, undefined, update);
    }
    if (rateValidator) {
      rateValidator.onChange(calculatedSuggestedHourlyRate, undefined, update);
    }
    if (functionalCenterValidator) {
      functionalCenterValidator.onChange(functionalCenter, undefined, update);
    }
    if (rateOriginType === RATE_ORIGIN_GROUP_LEVEL) {
      if (jobGroupValidator) {
        jobGroupValidator.onChange(jobGroupType, undefined, update);
      }
      if (jobLevelValidator) {
        jobLevelValidator.onChange(jobLevelType, undefined, update);
      }
    }
    if (toggleExpand) {
      toggleExpand();
    }
  }

  @autobind
  onCancel() {
    const { toggleExpand } = this.props;
    if (toggleExpand) {
      toggleExpand();
    }
  }

  @autobind
  onPanelClose() {
    this.setFirstFocus();
  }

  @autobind
  onOther() {
    const { jobTitle, panelOpen } = this.props;
    panelOpen({
      Body: <OtherRates jobTitle={ jobTitle } onSelect={ this.onSelectRate } />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose, func: this.onPanelClose },
        { kind: PopupActionKind.ok, func: this.onOkRate },
      ],
    });
  }

  @autobind
  onChange(value, index, update, done) {
    const { rateOriginType: prevRateOriginType } = this.state;
    this.setState({ rateOriginType: value, prevRateOriginType }, done);
  }

  @autobind
  onChangeRate(value, index, group, level, functionalCenterP) {
    const { onChange } = this.props;
    const { jobGroupType, jobLevelType, prevRateOriginType } = this.state;
    if (prevRateOriginType === value && !group && !level) {
      return;
    }
    const functionalCenter = functionalCenterP || null;
    this.setState({ functionalCenter: functionalCenter || undefined });
    if (onChange) {
      onChange(value, group || jobGroupType, level || jobLevelType, functionalCenter);
    }
  }

  @autobind
  onGroupLevel(jobProperty) {
    const { jobTitle, panelOpen } = this.props;
    if (!jobTitle) {
      return;
    }
    this.setState({ jobProperty });
    panelOpen({
      Body: <GroupLevel jobTitle={ jobTitle } onSelect={ this.onSelectGroupLevel } />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose, func: this.onPanelClose },
        { kind: PopupActionKind.ok, func: this.onOkGroupLevel },
      ],
    });
  }

  @autobind
  onSelectGroupLevel(row) {
    const { group, level, hourlyRate } = row;
    this.setState({ group, level, hourlyRate });
  }

  @autobind
  onOkGroupLevel() {
    const { group, level, jobProperty, rateOriginType, jobGroupType, jobLevelType } = this.state;
    if (!group || !level) {
      return;
    }
    let groupP, levelP;
    if (!isFirstLastType(jobGroupType) && !isFirstLastType(jobLevelType)) {
      this.setState({ jobGroupType: group, jobLevelType: level });
      groupP = group;
      levelP = level;
    } else if (jobProperty === JOP_PROPERTY_GROUP) {
      this.setState({ jobGroupType: group });
      groupP = group;
    } else if (jobProperty === JOP_PROPERTY_LEVEL) {
      this.setState({ jobLevelType: level });
      levelP = level;
    }
    this.onChangeRate(rateOriginType, undefined, groupP, levelP);
    this.setFirstFocus();
  }

  @autobind
  onChangeJobGroupType(index, opt) {
    const jobGroupType = opt.value;
    const { rateOriginType } = this.state;
    this.setState({ jobGroupType });
    this.onChangeRate(rateOriginType, undefined, jobGroupType);
  }

  @autobind
  onChangeJobGroupLevel(index, opt) {
    const jobLevelType = opt.value;
    const { rateOriginType } = this.state;
    this.setState({ jobLevelType });
    this.onChangeRate(rateOriginType, undefined, undefined, jobLevelType);
  }

  @autobind
  onSearchLevel() {
    this.onGroupLevel(JOP_PROPERTY_LEVEL);
  }

  @autobind
  onSearchGroup() {
    this.onGroupLevel(JOP_PROPERTY_GROUP);
  }

  getJobDescription(type) {
    const { intl } = this.props;
    if (type === JOB_FIRST) {
      return intl.formatMessage({ id: 'suggested-hourly-rate.first' });
    } else if (type === JOB_LAST) {
      return intl.formatMessage({ id: 'suggested-hourly-rate.last' });
    }
    return intl.formatMessage({ id: 'suggested-hourly-rate.specific' });
  }

  getJobValues() {
    const { intl } = this.props;
    return [
      { value: JOB_FIRST, title: intl.formatMessage({ id: 'suggested-hourly-rate.first' }) },
      { value: JOB_LAST, title: intl.formatMessage({ id: 'suggested-hourly-rate.last' }) },
      { value: JOB_SPECIFIC, title: intl.formatMessage({ id: 'suggested-hourly-rate.specific' }) },
    ];
  }

  getJobType(type) {
    if (isFirstLastType(type)) {
      return type;
    } else if (!type) {
      return JOB_FIRST;
    }

    return JOB_SPECIFIC;
  }

  @autobind
  onFirstRef(node) {
    this.firstNode = node;
  }

  @autobind
  onLastRef(node) {
    this.lastNode = node;
  }

  @autobind
  setFirstFocus() {
    if (this.firstNode) {
      this.firstNode.focus();
    }
  }

  @autobind
  setLastFocus() {
    if (this.lastNode) {
      this.lastNode.focus();
    }
  }

  onRef() {
    return this.onFirstRef;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.expand && this.props.expand) {
      this.setFirstFocus();
    }
  }

  render() {
    const { suggestedHourlyRate: origSuggestedHourlyRate, editMode, expand, jobTitle, wide } = this.props;
    const { rateOriginType, calculatedSuggestedHourlyRate, jobGroupType, jobLevelType } = this.state;
    const suggestedHourlyRate = editMode ? calculatedSuggestedHourlyRate : origSuggestedHourlyRate;
    const FullComponent = wide ? Form.Column4 : Form.Column2;

    return (
      <AnimateHeight
        contentClassName='form__row form__row--full'
        height={ expand ? 'auto' : 0 }
        duration={ 500 }
      >
        <div className='required-attendance__suggested' ref={ (node) => { this.node = node; } } >
          <FullComponent>
            <div className='required-attendance__levels-hourly-rate'>
              <div className='required-attendance__levels-content'>
                <RadioButton
                  value={ rateOriginType }
                  labelIntlId='required-attendance.suggested-hourly-rate-colon'
                  validator={ this }
                  onShiftTab={ this.setLastFocus }
                  onChange={ this.onChangeRate }
                  values={ [
                    { value: RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE,
                      id: 'average-job-title',
                      intlId: 'required-attendance.hourly-rate-average-job-title',
                      components: [
                        <Field.Number
                          key='average-job-title-field'
                          value={ suggestedHourlyRate }
                          hideTitle
                          inRadioButton
                          editMode={ editMode }
                          disabled
                        />,
                        <Button
                          key='average-job-title-button-others'
                          classElementModifier='levels-others'
                          labelIntlId='required-attendance.levels-button-others'
                          disabled={ !jobTitle || !editMode }
                          onClick={ editMode && jobTitle ? this.onOther : null }
                        />,
                      ],
                    },
                    {
                      value: RATE_ORIGIN_JOB_TITLE_AVERAGE,
                      id: 'average-salary-scale',
                      intlId: 'required-attendance.hourly-rate-average-salary-scale',
                      components: [
                        <Field.Number
                          key='average-salary-scale-field'
                          value={ suggestedHourlyRate }
                          hideTitle
                          inRadioButton
                          editMode={ editMode }
                          disabled
                        />,
                      ],
                    },
                    {
                      value: RATE_ORIGIN_GROUP_LEVEL,
                      id: 'specific-group-and-level',
                      intlId: 'required-attendance.hourly-rate-specific-group-and-level',
                      components: [
                        <div className='required-attendance__column' key='specific-group-and-level-field-group'>
                          { editMode ?
                            <Field.Dropdown
                              labelIntlId='required-attendance.hourly-rate-specific-group'
                              inRadioButton
                              values={ this.getJobValues() }
                              value={ this.getJobType(jobGroupType) }
                              onChange={ this.onChangeJobGroupType }
                            />
                          :
                            <Field
                              labelIntlId='required-attendance.hourly-rate-specific-group'
                              value={ this.getJobDescription(jobGroupType) }
                              inRadioButton
                              editMode={ editMode }
                              disabled
                            />
                        }
                          { editMode ?
                            <Field.Dropdown
                              labelIntlId='required-attendance.hourly-rate-specific-level'
                              inRadioButton
                              values={ this.getJobValues() }
                              value={ this.getJobType(jobLevelType) }
                              onChange={ this.onChangeJobGroupLevel }
                            />
                          :
                            <Field
                              labelIntlId='required-attendance.hourly-rate-specific-level'
                              value={ this.getJobDescription(jobLevelType) }
                              inRadioButton
                              editMode={ editMode }
                              disabled
                            />
                        }
                        </div>,
                        <div className='required-attendance__column' key='specific-group-and-level-field-specific'>
                          { isFirstLastType(jobGroupType) ?
                            <div className='required-attendance__empty-field' />
                          :
                            <Field.Search
                              inRadioButton
                              value={ isSpecificType(jobGroupType) ? '' : jobGroupType }
                              editMode={ editMode }
                              disabled={ !jobTitle }
                              onSearch={ this.onSearchGroup }
                            />
                        }
                          { isFirstLastType(jobLevelType) ?
                            <div className='required-attendance__empty-field' />
                          :
                            <Field.Search
                              inRadioButton
                              value={ isSpecificType(jobLevelType) ? '' : jobLevelType }
                              disabled={ !jobTitle }
                              editMode={ editMode }
                              onSearch={ this.onSearchLevel }
                            />
                        }
                        </div>,
                        <div className='required-attendance__column' key='specific-group-and-level-field-level'>
                          <Field.Number
                            value={ suggestedHourlyRate }
                            inRadioButton
                            editMode={ editMode }
                            disabled
                          />
                        </div>,
                      ],
                    },
                    {
                      value: RATE_ORIGIN_PARAMETERS,
                      id: 'average-parameters-salary-scale',
                      intlId: 'required-attendance.hourly-rate-average-parameters-salary-scale',
                      components: [
                        <Field.Number
                          key='average-parameters-salary-scale-field'
                          value={ suggestedHourlyRate }
                          hideTitle
                          inRadioButton
                          editMode={ editMode }
                          disabled
                        />,
                      ],
                    },
                  ] }
                  editMode={ editMode }
                  verticalAligned
                />
              </div>
              <div className='required-attendance__levels-separator' />
              <div className='required-attendance__levels-actions'>
                { editMode && <Button
                  classElementModifier='levels-cancel'
                  labelIntlId='required-attendance.levels-button-cancel'
                  editMode
                  onClick={ this.onCancel }
                /> }
                <Button
                  classElementModifier='levels-ok'
                  labelIntlId='required-attendance.levels-button-ok'
                  editMode
                  onClick={ this.onOk }
                  onRef={ this.onLastRef }
                  onTab={ this.setFirstFocus }
                />
              </div>
            </div>
          </FullComponent>
        </div>
      </AnimateHeight>
    );
  }
}

export const SuggestedHourlyRate = injectIntl(SuggestedHourlyRateClass);
