import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { findDOMNode } from 'react-dom';
import { find } from 'lodash';

import { Types } from '../../../utils/components/drag-n-drop';

import './data-grid-group.scss';

function getId(props) {
  return props.column.id;
}

const groupSource = {
  canDrag(props) {
    return true;
  },

  isDragging(props, monitor) {
    return monitor.getItem().id === getId(props);
  },

  beginDrag(props, monitor, component) {
    return props.column;
  },
};

function isOnLeftSide(componentRect, point) {
  const middleX = (componentRect.right + componentRect.left) / 2;
  return point.x < middleX;
}

const groupTarget = {
  canDrop(props, monitor) {
    const itemType = monitor.getItemType();

    if (itemType === Types.GRID_COLUMN) {
      const item = monitor.getItem();
      const found = find(props.groups, { id: item.id });
      return !found;
    }

    return true;
  },

  hover(props, monitor, component) {
    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();
    const isHoverLeftSide = isOnLeftSide(componentRect, clientOffset);
    const isHoverRightSide = !isHoverLeftSide;

    component.getDecoratedComponentInstance().setState({ isHoverLeftSide, isHoverRightSide });
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }

    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();
    const isDroppedOnLeftSide = isOnLeftSide(componentRect, clientOffset);

    const item = monitor.getItem();
    props.onMove(item, props.column, isDroppedOnLeftSide);
  },
};

@DropTarget([Types.GROUP_COLUMN, Types.GRID_COLUMN], groupTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
@DragSource(Types.GROUP_COLUMN, groupSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class DataGridGroup extends Component {
  static propTypes = {
    column: PropTypes.object,
    onRemove: PropTypes.func,
    onMove: PropTypes.func,
    groups: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      isHoverLeftSide: false,
      isHoverRightSide: false,
    };
  }

  @autobind
  onRemove() {
    this.props.onRemove(this.props.column);
  }

  render() {
    const { isDragging, isOver, canDrop, connectDragSource, connectDropTarget, column } = this.props;
    const { isHoverLeftSide, isHoverRightSide } = this.state;
    return connectDropTarget(connectDragSource(
      <div
        className={ classNames('data-grid-group',
          {
            'data-grid-group--hover-left': canDrop && isOver && isHoverLeftSide,
            'data-grid-group--hover-right': canDrop && isOver && isHoverRightSide,
          }) }
        key={ column.id }
      >
        <div
          className={ classNames('data-grid-group__button',
            { 'data-grid-group__button--dragging': isDragging }) }
        >
          <FormattedMessage id={ column.intlId } values={ column.intlValues } />
          <div className='data-grid-group__remove' onClick={ this.onRemove } />
        </div>
      </div>
    ));
  }
}

