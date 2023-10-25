import React, { PureComponent } from 'react';
import AnimateHeight from 'react-animate-height';

import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import RadioButton from '../../components/controls/radio-button';

export const RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE = 'FunctionalCenterAverage';
export const RATE_ORIGIN_JOB_TITLE_AVERAGE = 'JobTitleAverage';
export const RATE_ORIGIN_GROUP_LEVEL = 'GroupLevel';
export const RATE_ORIGIN_PARAMETERS = 'Parameters';
export const JOB_TYPE_SPECIFIC = 'Specific';

export class AverageHourlyRate extends PureComponent {
  render() {
    const { rateOriginType, editMode, expand,
      // jobGroup, jobLevel,
      jobGroupValue, jobLevelValue,
      labelIntlId, haveParameters } = this.props;
    // const isSpecificJobGroup = jobGroup === JOB_TYPE_SPECIFIC;
    // const isSpecificJobLevel = jobLevel === JOB_TYPE_SPECIFIC;

    const values = [
      { value: RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE,
        id: 'average-job-title',
        intlId: 'global-parameters.global-average-hourly-rate-job-title',
        components: [
        ],
      },
      {
        value: RATE_ORIGIN_JOB_TITLE_AVERAGE,
        id: 'average-salary-scale',
        intlId: 'global-parameters.global-average-hourly-rate-salary-scale-of-job-title',
        components: [
        ],
      },
      {
        value: RATE_ORIGIN_GROUP_LEVEL,
        id: 'specific-group-and-level',
        intlId: 'global-parameters.global-average-hourly-rate-specific-group-and-level',
        components: [
          <div className='global-parameters__row' key='specific-group-and-level-field-group'>
            <Form.Row single>
              <Form.Column>
                <Field
                  labelIntlId='global-parameters.global-average-hourly-rate-specific-group'
                  value={ jobGroupValue }
                  inRadioButton
                />
              </Form.Column>
            </Form.Row>
            <Form.Row single>
              <Form.Column>
                <Field
                  labelIntlId='global-parameters.global-average-hourly-rate-specific-level'
                  value={ jobLevelValue }
                  inRadioButton
                />
              </Form.Column>
            </Form.Row>
          </div>,
        ],
      },
    ];

    if (haveParameters) {
      values.push({
        value: RATE_ORIGIN_PARAMETERS,
        id: 'average-parameters-salary-scale',
        intlId: 'global-parameters.hourly-rate-average-parameters-salary-scale',
        components: [],
      });
    }

    return (
      <AnimateHeight
        contentClassName='form__row form__row--full'
        height={ expand ? 'auto' : 0 }
        duration={ 500 }
      >
        <Form.Column4>
          <RadioButton
            value={ rateOriginType }
            labelIntlId={ labelIntlId }
            labelClassModifier='radio-button__label--global-parameters'
            itemClassModifier='radio-button__item--global-parameters'
            verticalAligned
            editMode={ editMode }
            values={ values }
          />
        </Form.Column4>
      </AnimateHeight>
    );
  }
}
