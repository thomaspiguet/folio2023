import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { DropTarget } from 'react-dnd';
import { autobind } from 'core-decorators';
import { isEmpty, remove, find } from 'lodash';

import './data-grid-grouping.scss';

import { Types } from '../../../utils/components/drag-n-drop';
import DataGridGroup from './data-grid-group';

const groupingTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();

    const found = find(props.groups, { id: item.id });
    return !found;
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const itemType = monitor.getItemType();
    const found = find(props.groups, { id: item.id });

    if (itemType === Types.GRID_COLUMN) {
      if (!found) {
        props.setGroups([...props.groups, item]);
      }
    } else if (itemType === Types.GROUP_COLUMN) {
      const groups = [...props.groups];
      remove(groups, item);
      groups.push(item);
      props.setGroups(groups);
    }
  },
};

@DropTarget([Types.GRID_COLUMN, Types.GROUP_COLUMN], groupingTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class DataGridFixed extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    groups: PropTypes.array,
    setGroups: PropTypes.func,
  };

  @autobind
  onRemove(column) {
    const groups = [...this.props.groups];
    remove(groups, column);
    this.props.setGroups(groups);
  }

  @autobind
  onMove(from, to, isDroppedOnLeftSide) {
    if (from === to) {
      return;
    }
    const groups = [...this.props.groups];
    remove(groups, from);
    const toIndex = groups.indexOf(to) + (isDroppedOnLeftSide ? 0 : 1);
    groups.splice(toIndex, 0, from);
    this.props.setGroups(groups);
  }

  renderGroups() {
    const { groups } = this.props;
    return groups.map(column => (<DataGridGroup
      column={ column }
      onRemove={ this.onRemove }
      onMove={ this.onMove }
      groups={ groups }
      key={ column.id }
    />));
  }

  render() {
    const { isOver, canDrop, connectDropTarget, groups, className } = this.props;

    return connectDropTarget(
      <div className={ classNames('data-grid-grouping', className, {
        'data-grid-grouping--dropable': canDrop && isOver && !groups.length,
      }) }
      >
        {isEmpty(groups) ?
          <div className='data-grid-grouping__placeholder'>
            <FormattedMessage
              id='data-grid-grouping.placeholder'
              defaultMessage='Drag a column header and drop it here to group by that column'
            />
          </div>
          :
          <div className='data-grid-grouping__groups'>
            { this.renderGroups() }
          </div>
        }
      </div>
    );
  }
}
