import React, { PureComponent } from 'react';
import AnimateHeight from 'react-animate-height';

import Form from '../../components/general/form/form';

export class OtherPositions extends PureComponent {
  render() {
    const { employeeOtherPositions, expand } = this.props;
    return (
      <AnimateHeight
        contentClassName='form__row'
        height={ expand ? 'auto' : 5 }
        duration={ 500 }
      >
        <Form.Column4>
          <Form.Grid
            rows={ employeeOtherPositions.rows }
            columns={ employeeOtherPositions.columns }
          />
        </Form.Column4>
      </AnimateHeight>
    );
  }
}
