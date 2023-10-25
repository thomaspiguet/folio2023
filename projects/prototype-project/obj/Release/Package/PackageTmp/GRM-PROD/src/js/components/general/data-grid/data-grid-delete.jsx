import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { isFunction } from 'lodash';

import './data-grid-delete.scss';
import { focusKeyDown } from '../../../utils/components/keyboard';

export default class DataGridDelete extends PureComponent {
  static propTypes = {
    onDeleteRow: PropTypes.func,
    validator: PropTypes.object.isRequired,
  };

  @autobind
  onDeleteRow() {
    const { validator } = this.props;
    validator.onDeleteRow(this.props);
  }

  @autobind
  onKeyDown(e) {
    focusKeyDown(e, { onEnter: this.onDeleteRow });
  }

  canRemoveRow() {
    const { validator: { canRemoveRow }, row } = this.props;
    if (isFunction(canRemoveRow)) {
      return canRemoveRow((row && row._original) ? row._original : row);
    }
    return true;
  }

  render() {
    return (
      <div>
        { this.canRemoveRow() &&
          <div
            className='data-grid-delete'
            onClick={ this.onDeleteRow }
            tabIndex='0'
            onKeyDown={ this.onKeyDown }
          />
        }
      </div>
    );
  }
}

