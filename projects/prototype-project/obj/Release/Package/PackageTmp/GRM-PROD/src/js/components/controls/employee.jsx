import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import './employee.scss';

import { routes } from '../../features/app/app';
import { addScenarioIdToRoute } from '../../utils/utils';

function firstLetter(str) {
  if (!str) {
    return '';
  }
  return str.substr(0, 1).toUpperCase();
}

class Employee extends PureComponent {

  render() {
    const { number, firstName, lastName, children, employeeId, scenarioId, large } = this.props;
    return (
      <div className={ classNames('employee', { 'employee--large': large }) }>
        { employeeId ?
          <Link
            className='employee__left'
            to={ addScenarioIdToRoute(`${ routes.EMPLOYEES.path }/${ employeeId }`, scenarioId) }
          >
            <div className='employee__initials'>
              { `${ firstLetter(firstName) }${ firstLetter(lastName) }` }
            </div>
            <div className='employee__info'>
              <div className='employee__full-name'>
                <span> { firstName } </span>
                <span> { lastName } </span>
              </div>
              <div className='employee__number'>
                <span> { number } </span>
              </div>
            </div>
          </Link>
        :
          <div className='employee__left'>
            <div className='employee__initials' />
          </div>
        }
        <div className='employee__right'>
          { children }
        </div>
      </div>
    );
  }

}

export default injectIntl(Employee);
