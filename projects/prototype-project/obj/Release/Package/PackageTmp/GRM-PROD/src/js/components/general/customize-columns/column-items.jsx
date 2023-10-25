import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

import ColumnItem from './column-item';

export default class ColumnItems extends Component {
  static propTypes = {
    item: PropTypes.object,
    onChange: PropTypes.func,
  };

  render() {
    const { item } = this.props;

    return (
      <AnimateHeight
        className='customize-columns__sub-items'
        height={ item.expanded ? 'auto' : 0 }
        duration={ 300 }
      >
        {
          item.columns ? item.columns.map((column) => (
            <ColumnItem
              item={ column }
              key={ column.id }
              parentId={ item.id }
              onChange={ this.props.onChange }
            />))
          : <div />
        }
      </AnimateHeight>
    );
  }
}
