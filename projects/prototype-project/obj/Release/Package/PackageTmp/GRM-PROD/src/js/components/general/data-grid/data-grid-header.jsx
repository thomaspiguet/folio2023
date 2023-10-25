import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { some } from 'lodash';

import { Types } from '../../../utils/components/drag-n-drop';
import CustomFilter from './custom-filter';
import { SORTING_ASC, SORTING_DESC } from '../../../api/actions';


function getId(props) {
  return props.column.id || props.column.intlId;
}

const headerSource = {
  canDrag(props, monitor) {
    const { column, filters, haveGrouping, groups } = props;
    const isSelected = filters && filters.selected === column.id;
    if (haveGrouping && column.isGroupable && !isSelected) {
      return !some(groups, (group) => group.id === column.id);
    }
    return false;
  },

  isDragging(props, monitor) {
    return monitor.getItem().id === getId(props);
  },

  beginDrag(props, monitor, component) {
    return { ...props.column, id: getId(props) };
  },
};

@DragSource(Types.GRID_COLUMN, headerSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag(),
}))
export default class DataGridHeader extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    haveGrouping: PropTypes.bool,
    isFilterable: PropTypes.bool,
    isSortable: PropTypes.bool,
    setFilters: PropTypes.func,
    setSorting: PropTypes.func,
    filters: PropTypes.object,
    sorting: PropTypes.object,
    isMandatoryColumn: PropTypes.bool,
    groups: PropTypes.array,
  };

  static defaultProps = {
    rows: [],
  };

  @autobind
  onFilter() {
    const { openFilter, column } = this.props;
    if (openFilter) {
      openFilter(column.id);
    }
  }

  @autobind
  onClose() {
    this.onFilter();
  }

  @autobind
  onSorting() {
    const { setSorting, column } = this.props;
    if (!setSorting || !column) {
      return;
    }
    const sorting = this.props.sorting || {};
    let order = SORTING_ASC;
    if (this.isSorting(column, sorting, SORTING_ASC)) {
      order = SORTING_DESC;
    } else if (this.isSorting(column, sorting, SORTING_DESC)) {
      order = undefined;
    }
    setSorting(column.id, order);
  }

  isSorting(column, sorting, value) {
    return sorting && column && sorting.columnId === column.id && sorting.order === value;
  }

  render() {
    const { isDragging, connectDragSource, canDrag, column, isFilterable, filters, setFilters,
      isMandatoryColumn, isSortable, sorting } = this.props;
    const isSelected = filters && filters.selected === column.id;
    const columnAlign = column.align ? column.align : 'left';
    const grouped = column.isGroupable && !isDragging && !canDrag && !isSelected;
    return connectDragSource(
      <div className={ classNames('data-grid-header', {
        'data-grid-header--dragging': isDragging && canDrag,
        'data-grid-header--sortable': isSortable,
        'data-grid-header--grouped': grouped,
      }) }
      >
        <div className={ classNames('data-grid-header__column',
          `data-grid-header__column--${ columnAlign }`,
          { 'data-grid-header__column--mandatory': isMandatoryColumn }) }
        >
          <div
            className='data-grid-header__message'
            onClick={ isSortable ? this.onSorting : null }
          >
            { column.intlId && <FormattedMessage id={ column.intlId } values={ column.intlValues } /> }
            { column.title && <span> { column.title } </span>}
          </div>
          { isSortable &&
          <div
            className={ classNames('data-grid-header__sorting', {
              'data-grid-header__sorting--up': this.isSorting(column, sorting, SORTING_ASC),
              'data-grid-header__sorting--down': this.isSorting(column, sorting, SORTING_DESC),
            }) }
            onClick={ this.onSorting }
          />
          }
          { isFilterable &&
            <div
              className={ classNames('data-grid-header__filter', {
                'data-grid-header__filter--selected': isSelected,
              }) }
              onClick={ this.onFilter }
            >
              <i className='material-icons small-btn-icons-filter'>filter_list</i>
            </div>
          }
          { isSelected &&
            <CustomFilter
              filters={ filters }
              column={ column }
              onClose={ this.onClose }
              setFilters={ setFilters }
              placeholderIntlId='custom-filter.search'
            />
          }
        </div>
      </div>
    );
  }
}

