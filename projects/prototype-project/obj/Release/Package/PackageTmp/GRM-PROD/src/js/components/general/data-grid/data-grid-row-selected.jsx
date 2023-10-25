import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './data-grid-row-selected.scss';

export class RowSelected extends PureComponent {
  static propTypes = {
    isSelected: PropTypes.bool,
  };

  render() {
    if (this.props.isSelected) {
      return (
        <div className='data-grid-row-selected'>
          {/* <div className='data-grid-row-selected__icon' /> */}
          <i className='material-icons data-grid-row-selected__small-icons'>check</i>
          <div className='data-grid-row-selected__text'>
            <FormattedMessage id='data-grid.row-selected' defaultMessage='Selected' />
          </div>
        </div>
      );
    }
    return null;
  }
}
