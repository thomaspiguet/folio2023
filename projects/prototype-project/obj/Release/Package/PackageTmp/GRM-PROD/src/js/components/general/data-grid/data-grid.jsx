import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import { isEmpty, get, cloneDeep, isFunction, some, isEqual, isEqualWith, pick } from 'lodash';
import shallowequal from 'shallowequal';
import md5 from 'md5';

import ReactTable from 'react-table';
import { TbodyWithLoader } from './tbody-with-loader';
import DataGridHeader from './data-grid-header';
import DataGridDelete from './data-grid-delete';
import DataGridCell from './data-grid-cell';
import DataGridRow from './data-grid-row';

import './data-grid.scss';
import { defaultValidator } from '../../../utils/components/form-validator';

const BounceState = {
  NONE: 'NONE',
  UPDATED: 'UPDATED',
  DELAYED: 'DELAYED',
};

const BOUNCE_DELAY = 700;
const COLUMN_PROPS = ['id', 'intlId', 'intlValues', 'isNumber', 'minWidth', 'width', 'highlightNegative',
  'isLoading', 'values', 'title', 'grouped', 'groupId', 'isGroupable',
];

const HEADER_PROPS = [
  'openFilter', 'isMandatoryColumn', 'isFilterable', 'filters', 'isSortable', 'sorting', 'editMode',
  'version', 'viewWidth',
];

export function compareColumns(columns1, columns2) {
  if (columns1.length !== columns2.length) {
    return false;
  }

  for (let ind = 0; ind < columns1.length; ind++) {
    if (!compareColumn(columns1[ind], columns2[ind])) { // eslint-disable-line no-use-before-define
      return false;
    }
  }

  return true;
}

export function compareColumn(column1, column2) {
  if (!isEqual(pick(column1, COLUMN_PROPS), pick(column2, COLUMN_PROPS))) {
    return false;
  }
  if (!isEqual(column1.props, column2.props)) {
    return false;
  }
  if (column1.columns && !column2.columns || !column1.columns && column2.columns) {
    return false;
  }
  if (column1.columns && column2.columns) {
    return compareColumns(column1.columns, column2.columns);
  }

  return true;
}

export default class DataGrid extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    currentRow: PropTypes.number,
    onChangeCurrentRow: PropTypes.func,
    selectedRow: PropTypes.number,
    hoverRow: PropTypes.number,
    onChangeSelectedRow: PropTypes.func,
    onChangeHoverRow: PropTypes.func,
    onRowClick: PropTypes.func,
    fieldToDisableRowCursor: PropTypes.string,
    smokyWhiteBackground: PropTypes.bool,
    noGridBorders: PropTypes.bool,
    noHighlight: PropTypes.bool,
    groups: PropTypes.array,
    isStickyHeader: PropTypes.bool,
    noPadding: PropTypes.bool,
    noLoader: PropTypes.bool,
    onFilter: PropTypes.func,
  };

  static defaultProps = {
    validator: defaultValidator,
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      columnsVersion: 0,
      errors: null,
    };
    this.bounceState = BounceState.NONE;
    this.bounceTimerId = null;
  }

  componentDidMount() {
    this.isFirst = true;
    this._isMounted = true;
    this.initColumns(this.props, true);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(props) {
    this.initColumns(props);
  }

  initColumns(props, always) {
    if (always
      || !isEqualWith(props.columns, this.props.columns, compareColumns)
      || !isEqual(pick(props, HEADER_PROPS), pick(this.props, HEADER_PROPS))
      || props.rows.length !== this.props.rows.length
      || props.isLoading
      || !isEqual(props.validator.getErrors(), this.state.errors)
    ) {
      this.processColumns(props);
    }
  }

  processColumns(props) {
    const columns = cloneDeep([...props.columns]);
    let haveColumnGroups = false;
    let haveColumns = false;
    if (this.haveDeleteColumn(props)) {
      columns.push({
        id: 'delete',
        isDelete: true,
        width: 40,
      });
    }
    columns.forEach((column) => {
      if (column.columns) {
        haveColumnGroups = true;
        this.fillGroupColumn(column, props);

        column.columns.forEach((subcolumn, index) => {
          haveColumns = true;
          this.fillColumn(subcolumn, props, (index === (column.columns.length - 1)));
        });
      } else {
        haveColumns = true;
        this.fillColumn(column, props);
      }
    });

    let { columnsVersion } = this.state;
    columnsVersion++;
    const errors = props.validator.getErrors();
    this.setState({ columns, haveColumnGroups, haveColumns, columnsVersion, errors });
  }

  haveDeleteColumn(props) {
    const { validator, rows, canRemoveRow } = props;
    return validator
      && validator.isEditMode()
      && ((validator.canRemoveRow && (!isFunction(validator.canRemoveRow) || some(rows, (row) => validator.canRemoveRow(row))))
      || canRemoveRow);
  }

  fillGroupColumn(column, props) {
    const columnAlign = column.align ? column.align : 'left';
    const isSingle = column.columns.length === 1;
    column.headerClassName = classNames('grid-column__group',
      `grid-column__group--${ columnAlign }`, {
        'grid-column__group--empty': isSingle && !column.isTotal,
        'grid-column__group--pivot': props.pivotBy && props.pivotBy.length,
      });
    if ((column.intlId || column.title) && !column.Header) {
      column.Header = <DataGridHeader column={ column } haveGrouping={ !!props.groups } groups={ props.groups } />;
    }
  }

  fillColumn(column, props, isLast) {
    const columnAlign = column.align ? column.align : 'left';
    const { editMode, validator, onChangeCell, entry, onDeleteRow, noGridBorders } = props;
    column.className = classNames('grid-column__cell',
      `grid-column__cell--${ columnAlign }`, {
        'grid-column__cell--number': column.isNumber,
        'grid-column__cell--edit': editMode,
        'grid-column__cell--no-extra-padding': column.noExtraPadding,
      });
    column.headerClassName = classNames('grid-column__header',
      `grid-column__header--${ columnAlign }`, {
        'grid-column__header--number': column.isNumber,
        'grid-column__header--last': !!isLast,
        'grid-column__header--edit': editMode,
        'grid-column__header--no-borders': noGridBorders,
      });

    let isMandatoryColumn = false;
    if (column.isDelete) {
      column.Cell = props => <DataGridDelete { ...props } validator={ validator } onDeleteRow={ onDeleteRow } />;
    } else if (editMode && column.EditCell) {
      column.Cell = props => (<column.EditCell
        { ...props }
        validator={ validator.getColumnValidator(column.id) }
        onChange={ onChangeCell }
        hideTitle
        editMode
        isDataGridField
        isNumber={ column.isNumber }
        entry={ entry }
      />);
      if (column && column.id && props.validator.columns && props.validator.columns[column.id]) {
        isMandatoryColumn = props.validator.columns[column.id].getMandatory();
      }
      if (column.editWidth) {
        column.width = column.editWidth;
      }
    }

    if ((column.intlId || column.title) && !column.Header) {
      column.Header = (
        <DataGridHeader
          column={ column }
          haveGrouping={ !!props.groups }
          groups={ props.groups }
          isFilterable={ !!column.isFilterable }
          openFilter={ props.openFilter }
          filters={ props.filters }
          setFilters={ props.setFilters }
          sorting={ props.sorting }
          setSorting={ props.setSorting }
          isMandatoryColumn={ isMandatoryColumn }
          isSortable={ column.isSortable }
        />);
    }
  }

  @autobind
  getTdProps(state, rowInfo, column, instance) {
    if (!rowInfo) return {};
    const tdProps = this.props.getTdProps ? this.props.getTdProps(state, rowInfo, column, instance) : {};
    const original = rowInfo.row._original;
    return {
      ...tdProps,
      'className': classNames({
        'grid-column__cell--hidden': column.grouped && column.groupId !== original.groupId,
        'grid-column__cell--grouped': column.grouped,
        'grid-column__cell--total': original && original.isSection || column.isTotal,
        'grid-column__cell--total-column': column.isTotal,
        'grid-column__cell--negative': column.isNumber && column.highlightNegative && rowInfo.original && get(rowInfo.original, column.id) < 0,
        'grid-column__cell--changed': column.changable && original && get(original, `_changed["${ column.id }"]`),
        'grid-column__cell--border-left': column.borderLeft,
        'grid-column__cell--border-right': column.borderRight,
        'grid-column__cell--merged-cell': original && original.mergedCell && column.hasMergedCells,
      }),
    };
  }

  @autobind
  getTheadThProps(state, rowInfo, column, instance) {
    return {
      'className': classNames({
        'grid-column__header--draggable': !!instance.props.groups && column.isGroupable,
      }),
    };
  }

  @autobind
  getTrProps(state, rowInfo, column, instance) {
    if (!rowInfo) return {};
    const { index } = rowInfo;
    const original = rowInfo.row._original;
    const { editMode, currentRow, selectedRow, hoverRow, validator, viewWidth } = this.props;
    const { columnsVersion } = this.state;
    const isCurrent = currentRow === index;
    const isSelected = selectedRow === index;
    const isHover = hoverRow === index;
    const haveErrors = !!validator.getErrors(index);
    const resized = state.resized ? md5(JSON.stringify(state.resized)) : 0;
    return {
      onClick: () => {
        if (!editMode && this.props.onChangeSelectedRow) {
          this.props.onChangeSelectedRow(rowInfo.index, rowInfo.original);
        }
        if (this.props.onRowClick) {
          this.props.onRowClick(rowInfo.original);
        }
      },
      onMouseEnter: () => {
        if (!editMode && this.props.onChangeHoverRow) {
          this.props.onChangeHoverRow(rowInfo.index);
        }
      },
      onMouseLeave: () => {
        if (!editMode && this.props.onChangeHoverRow) {
          this.props.onChangeHoverRow(-1);
        }
      },
      original,
      editMode,
      columnsVersion,
      isCurrent,
      isSelected,
      isHover,
      haveErrors,
      resized,
      viewWidth,
      className: classNames('grid-row', {
        'grid-row--current': isCurrent,
        'grid-row--selected': isSelected,
        'grid-row--hover': isHover,
        'grid-row--hoverEvent': this.props.hoverRow === null || this.props.hoverRow === undefined,
        'grid-row--selected --hover': this.props.hoverRow === index && this.props.selectedRow === index,
        'grid-row--total': original && original.isSection,
        'grid-row--transition-to-details': this.props.onRowClick,
        'grid-row--no-transition-to-details': this.props.fieldToDisableRowCursor && original && !original[this.props.fieldToDisableRowCursor],
        'grid-row--read-only-grayed-out': this.props.smokyWhiteBackground && this.props.selectedRow !== index,
        'grid-row--no-borders': this.props.noGridBorders,
      }),
    };
  }

  @autobind
  getTrGroupProps(state, rowInfo, column, instance) {
    if (!rowInfo) return {};
    const original = rowInfo.row._original;
    const className = classNames('grid-row-group', {
      'grid-row-group--total': original && original.isSection,
      'grid-row-group--total-joined': original && original.isJoinedSection,
    });
    if (this.props.TrGroupComponent) {
      return {
        row: rowInfo.index,
        onTrGroupRef: this.props.onTrGroupRef,
        className,
      };
    }
    return {
      className,
    };
  }

  @autobind
  getTbodyProps(state, rowInfo, column, instance) {
    return {
      isLoading: instance.props.isLoading,
      noData: !state.rows || !state.rows.length,
      style: {
        minWidth: state.rowMinWidth + 1,
      },
      noLoader: instance.props.noLoader,
      noNoData: instance.props.noNoData,
      customMessageIntlId: instance.props.customMessageIntlId,
    };
  }

  @autobind
  getNoDataProps(state, rowInfo, column, instance) {
    return { isLoading: instance.props.isLoading };
  }

  @autobind
  getPaginationProps(state, rowInfo, column, instance) {
    const { onScroll, getScrollContainer, getScrollHead, getScrollBody, getResizer, getScrollViewport,
      isStickyHeader, pageSize, setPageSize, noPaging, isLoading, viewWidth,
      noPadding, Footer, hidePager, footerOffset, scrollToY } = instance.props;
    return {
      isLastPage: !isEmpty(state.padRows),
      onScroll,
      getScrollContainer,
      getScrollHead,
      getScrollBody,
      getResizer,
      getScrollViewport,
      isStickyHeader,
      pageSize,
      setPageSize,
      noPaging,
      noPadding,
      isLoading,
      Footer,
      hidePager,
      viewWidth,
      footerOffset,
      scrollToY,
    };
  }

  makeKey(props, state) {
    const allProps = { ...props };
    delete allProps.currentRow;
    return { ...allProps };
  }

  @autobind
  onBounceTimer() {
    switch (this.bounceState) {
      case BounceState.NONE:
      default:
        break;
      case BounceState.UPDATED:
        this.bounceState = BounceState.NONE;
        break;
      case BounceState.DELAYED:
        this.bounceState = BounceState.UPDATED;
        if (this._isMounted) {
          this.forceUpdate();
          setTimeout(this.onBounceTimer, BOUNCE_DELAY);
        }
        break;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldProps = this.props;
    const prev = this.makeKey(oldProps, this.state);
    const next = this.makeKey(nextProps, nextState);
    let ret = !shallowequal(prev, next) || this.isFirst;
    if (oldProps.noThrottle) {
      return ret;
    }

    if (!oldProps.rows.length && nextProps.rows.length
      || oldProps.hoverRow !== nextProps.hoverRow
      || oldProps.isLoading !== nextProps.isLoading
      || oldProps.isStickyHeader !== nextProps.isStickyHeader
      || oldProps.page !== nextProps.page
      || oldProps.pages !== nextProps.pages
      || oldProps.currentRow !== nextProps.currentRow
      || oldProps.hoverRow !== nextProps.hoverRow
      || oldProps.selectedRow !== nextProps.selectedRow
      || oldProps.viewWidth !== nextProps.viewWidth
      || nextProps.editMode
    ) {
      return ret;
    }

    if (ret) {
      switch (this.bounceState) {
        case BounceState.NONE:
          this.bounceState = BounceState.UPDATED;
          setTimeout(this.onBounceTimer, BOUNCE_DELAY);
          break;
        case BounceState.UPDATED:
          this.bounceState = BounceState.DELAYED;
          ret = false;
          break;
        case BounceState.DELAYED:
        default:
          ret = false;
          break;
      }
    }

    return ret;
  }

  componentDidUpdate(prevProps, prevState) {
    this.isFirst = false;
  }

  render() {
    const className = classNames({
      '-highlight': !this.props.noHighlight,
      'ReactTable--sticky': this.props.isStickyHeader,
      'ReactTable--column-groups': this.state.haveColumnGroups,
      'ReactTable--fill': this.props.fill,
      'ReactTable--hidden': !this.state.haveColumns,
    });

    return (
      <ReactTable
        showPagination={ false }
        { ...this.props }
        rows={ this.props.rows }
        pages={ this.props.pages }
        page={ this.props.page }
        pageSize={ this.props.pageSize }
        onFetchData={ this.props.onFetchData }
        onPageChange={ this.props.onPageChange }
        isLoading={ this.props.isLoading }
        manual={ this.props.manual }
        data={ this.props.rows }
        columns={ this.state.columns }
        className={ className }
        minRows={ this.props.minRows ? this.props.minRows : (this.props.noPadding ? 0 : 5) }
        getTdProps={ this.getTdProps }
        getTheadThProps={ this.getTheadThProps }
        getTrProps={ this.getTrProps }
        getTrGroupProps={ this.props.getTrGroupProps ? this.props.getTrGroupProps : this.getTrGroupProps }
        getTbodyProps={ this.getTbodyProps }
        getNoDataProps={ this.getNoDataProps }
        getPaginationProps={ this.getPaginationProps }
        TbodyComponent={ TbodyWithLoader }
        PaginationComponent={ this.props.PaginationComponent }
        Footer={ this.props.Footer }
        children={ this.props.children }
        TdComponent={ this.props.TdComponent || DataGridCell }
        TrComponent={ this.props.TrComponent || DataGridRow }
        NoDataComponent={ () => null }
      />
    );
  }
}
