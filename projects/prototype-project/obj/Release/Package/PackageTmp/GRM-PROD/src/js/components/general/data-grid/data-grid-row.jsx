import React, { Component } from 'react';
import classNames from 'classnames';
import { isEqual, omit } from 'lodash';

const EXTRA_PROPS = ['original', 'editMode', 'columnsVersion', 'isCurrent', 'isSelected', 'isHover',
  'haveErrors', 'resized', 'viewWidth'];

export default class DataGridRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const props = this.props;
    const ret = (!nextProps.original
      || !isEqual(nextProps.original, props.original)
      || nextProps.editMode !== props.editMode
      || nextProps.columnsVersion !== props.columnsVersion
      || nextProps.resized !== props.resized
      || nextProps.viewWidth !== props.viewWidth
      || !nextProps.editMode && (nextProps.isCurrent || nextProps.isSelected || nextProps.isHover
        || props.isCurrent || props.isSelected || props.isHover)
      || nextProps.haveErrors || props.haveErrors
    );

    return ret;
  }

  render() {
    const { children, className, ...rest } = omit(this.props, EXTRA_PROPS);
    return (
      <div className={ classNames('rt-tr', className) } { ...rest }>
        {children}
      </div>
    );
  }
}
