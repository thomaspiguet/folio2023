import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import './data-grid-tree-cell.scss';

export default class DataGridTreeCell extends PureComponent {
  static propTypes = {
    grouped: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onExpand: PropTypes.func,
  };

  @autobind
  onExpand() {
    const { onExpand } = this.props;
    if (onExpand) {
      onExpand(this.props);
    }
  }

  render() {
    const { grouped, isExpanded, children, className, style, isLoading, hidden } = this.props;
    return (
      <div
        className={ classNames(className, 'rt-td', 'grid-column__cell', 'data-grid-tree-cell') }
        style={ style }
      >
        { grouped && !hidden &&
          <div
            className={ classNames('data-grid-tree-cell__icon', {
              'data-grid-tree-cell__icon--expanded': isExpanded,
              'data-grid-tree-cell__icon--loading': isLoading,
            }) }
            onClick={ this.onExpand }
          />
        }
        <div className='data-grid-tree-cell__value'>
          { children }
        </div>
      </div>
    );
  }
}
