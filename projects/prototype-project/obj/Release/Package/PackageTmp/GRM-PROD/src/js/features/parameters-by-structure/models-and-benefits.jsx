import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';

class ModelsAndBenefits extends PureComponent {

  render() {
    const {
      modelsAndBenefits: {
        fullTimeDistribution: {
          psychLeave: {
            number: dftPsychLeave,
          },
          vacation: {
            number: dftVacation,
          },
          holidays: {
            number: dftHolidays,
          },
          sickDays: {
            number: dftSickDays,
          },
        },
        partTimeDistribution: {
          psychLeave: {
            number: dptPsychLeave,
          },
          vacation: {
            number: dptVacation,
          },
          holidays: {
            number: dptHolidays,
          },
          sickDays: {
            number: dptSickDays,
          },
        },
        fullTimeFinalDistribution: {
          vacation: {
            number: fftVacation,
          },
          holidays: {
            number: fftHolidays,
          },
          sickDays: {
            number: fftSickDays,
          },
        },
        partTimeFinalDistribution: {
          vacation: {
            number: fptVacation,
          },
          holidays: {
            number: fptHolidays,
          },
          sickDays: {
            number: fptSickDays,
          },
        },
      },
      othersRegularNonManagement: {
        hours: { number: nmHoursNumber },
        amounts: { number: nmAmountsNumber },
      },
      othersRegularManagement: {
        hours: { number: mHoursNumber },
        amounts: { number: mAmountsNumber },
      },
      othersFullTimeNightShift,
    } = this.props;

    return (
      <div>
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__section'>
              <FormattedMessage id='parameters-by-structure.item.models-benefits' defaultMessage='Models - Benefits' />
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage
                id='parameters-by-structure.item.distribution-taken'
                defaultMessage='Distribution based on days taken'
              />
            </div>
          </Form.Column2>
          <Form.Column2>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage
                id='parameters-by-structure.item.distribution-full'
                defaultMessage='Final distribution of expense'
              />
            </div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.full-time' defaultMessage='Full-time' />
            </div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.part-time' defaultMessage='Part-time' />
            </div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.full-time' defaultMessage='Full-time' />
            </div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.part-time' defaultMessage='Part-time' />
            </div>
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ dftVacation } labelIntlId='parameters-by-structure.item.vacation' /></Form.Column>
          <Form.Column><Field value={ dptVacation } labelIntlId='parameters-by-structure.item.vacation' /></Form.Column>
          <Form.Column><Field value={ fftVacation } labelIntlId='parameters-by-structure.item.vacation' /></Form.Column>
          <Form.Column><Field value={ fptVacation } labelIntlId='parameters-by-structure.item.vacation' /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ dftHolidays } labelIntlId='parameters-by-structure.item.holidays' /></Form.Column>
          <Form.Column><Field value={ dptHolidays } labelIntlId='parameters-by-structure.item.holidays' /></Form.Column>
          <Form.Column><Field value={ fftHolidays } labelIntlId='parameters-by-structure.item.holidays' /></Form.Column>
          <Form.Column><Field value={ fptHolidays } labelIntlId='parameters-by-structure.item.holidays' /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ dftSickDays } labelIntlId='parameters-by-structure.item.sick' /></Form.Column>
          <Form.Column><Field value={ dptSickDays } labelIntlId='parameters-by-structure.item.sick' /></Form.Column>
          <Form.Column><Field value={ fftSickDays } labelIntlId='parameters-by-structure.item.sick' /></Form.Column>
          <Form.Column><Field value={ fptSickDays } labelIntlId='parameters-by-structure.item.sick' /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ dftPsychLeave } labelIntlId='parameters-by-structure.item.psych' /></Form.Column>
          <Form.Column><Field value={ dptPsychLeave } labelIntlId='parameters-by-structure.item.psych' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <div className='parameters-by-structure__section'>
              <FormattedMessage id='parameters-by-structure.item.models-other' defaultMessage='Models - Other' />
            </div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage id='parameters-by-structure.item.regular' defaultMessage='Regular' />
            </div>
          </Form.Column2>
          <Form.Column />
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.management' defaultMessage='Management' />
            </div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__caption'>
              <FormattedMessage id='parameters-by-structure.item.non-management' defaultMessage='Non-management' />
            </div>
          </Form.Column>
          { othersFullTimeNightShift
            ? <Form.Column>
              <div className='parameters-by-structure__subsection'>
                <FormattedMessage id='global-parameters.models.full-time-title' defaultMessage='Full time' />
              </div>
            </Form.Column>
            : <Form.Column />
          }
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ mHoursNumber } labelIntlId='parameters-by-structure.item.hours' /></Form.Column>
          <Form.Column><Field value={ nmHoursNumber } labelIntlId='parameters-by-structure.item.hours' /></Form.Column>
          { othersFullTimeNightShift
            ? <Form.Column><Field value={ othersFullTimeNightShift.number } labelIntlId='global-parameters.models.night-shift' /></Form.Column>
            : <Form.Column /> }
          { othersFullTimeNightShift
            ? <Form.Column><Field.Info value={ othersFullTimeNightShift.name } /></Form.Column>
            : <Form.Column /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ mAmountsNumber } labelIntlId='parameters-by-structure.item.amounts' /></Form.Column>
          <Form.Column><Field value={ nmAmountsNumber } labelIntlId='parameters-by-structure.item.amounts' /></Form.Column>
          <Form.Column2 />
        </Form.Row>

      </div>
    );
  }
}

export default injectIntl(ModelsAndBenefits);
