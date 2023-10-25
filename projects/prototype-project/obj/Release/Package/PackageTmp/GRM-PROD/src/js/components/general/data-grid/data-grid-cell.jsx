import React, { PureComponent } from 'react';
import classNames from 'classnames';

export default class DataGridCell extends PureComponent {
  render() {
    const { children, className, style, ...rest } = this.props;
    return (
      <div className='rt-td' style={ style }>
        <div className={ classNames('data-grid__cell', className) } { ...rest }>
          {children}
        </div>
      </div>
    );
  }
}
