import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { cloneDeep, first } from 'lodash';
import shallowequal from 'shallowequal';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { ScrollBox } from '../scroll-box';

import { buildExpandParameters, transferPropsToState } from '../../../utils/utils';

import DataGrid from './data-grid';
import DataGridExpandedHeader from './data-grid-expanded-header';
import DataGridGrouping from './data-grid-grouping';
import DataGridPagination from './data-grid-pagination';
import DataGridTreeCell from './data-grid-tree-cell';

import './data-grid.scss';

export default class DataGridFixed extends Component {
  static propTypes = {
    rows: PropTypes.array.isRequired,
    columnsScrolled: PropTypes.array.isRequired,
    SubComponent: PropTypes.any,
    groups: PropTypes.array,
    setGroups: PropTypes.func,
    manual: PropTypes.bool,
    expandable: PropTypes.bool,
  };

  static defaultProps = {
    manual: false,
    expandable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentRow: -1,
      selectedRow: -1,
      hoverRow: -1,
      expanded: true,
      columnsFixed: [],
      columnsScrolled: [],
      rows: [],
      page: 0,
      isStickyHeader: false,
      pageSize: 30,
    };
  }

  componentDidMount() {
    this.init(this.props);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    transferPropsToState(this, props, ['pageSize', 'page']);
    this.initColumns(props, this.state.expanded);
  }

  haveColumns(columns) {
    return columns.reduce((result, column) => {
      if (result) {
        return true;
      }
      if (column.columns) {
        return column.columns.length > 0;
      }
      return true;
    }, false);
  }

  initColumns(props, expanded) {
    const fixedColumns = cloneDeep(this.getFixedColumns(expanded, props.columnsFixed));
    const firstColumn = first(fixedColumns);
    const expanderColumns = [];
    this.initFirstColumn(props, firstColumn, expanded, expanderColumns);

    let columnsFixed = [...expanderColumns, ...fixedColumns];
    let columnsScrolled = [...props.columnsScrolled];
    const haveFixedColumns = this.haveColumns(columnsFixed);
    const haveScrolledColumns = this.haveColumns(columnsScrolled);
    if (!haveFixedColumns && !haveScrolledColumns) {
      columnsScrolled = [{ id: '_phantome' }];
    } else if (!haveScrolledColumns) {
      columnsScrolled = [...columnsFixed];
      columnsFixed = [];
    }

    this.setState({
      columnsFixed,
      columnsScrolled,
      haveFixedColumns,
      haveScrolledColumns,
    });
  }

  initFirstColumn(props, firstColumn, expanded, expanderColumns) {
    const { groups, expandable } = props;
    const haveGroups = groups && groups.length;
    if (!haveGroups && expandable) {
      if (!props.SubComponent) {
        firstColumn.Header = (
          <DataGridExpandedHeader
            column={ firstColumn }
            expanded={ expanded }
            onChangeExpanded={ this.onChangeExpanded }
          />);
      } else {
        expanderColumns.push({
          width: 60,
          Header: (
            <DataGridExpandedHeader
              expanded={ expanded }
              onChangeExpanded={ this.onChangeExpanded }
            />
          ),
          expander: true,
          Expander: ({ isExpanded }) => {
            return (
              <div className={ classNames('data-grid__expander', {
                'data-grid__expander--expanded': isExpanded,
                'data-grid__expander--collapsed': !isExpanded,
              }) }
              />
            );
          },
        });
      }
    }
  }

  getFixedColumns(expanded, columnsFixed) {
    let column = first(columnsFixed);
    if (expanded /* && (!column.columns || column.columns.length > 1) */) {
      return columnsFixed;
    }

    if (column.columns && column.columns.length) {
      column = { ...column, intlId: null, columns: [{ ...first(column.columns), minWidth: 120 }] };
    }

    return [column];
  }

  @autobind
  onChangeExpanded() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
    this.initColumns(this.props, expanded);
  }

  @autobind
  onChangeCurrentRow(index) {
    this.setState({ currentRow: index });
  }

  @autobind
  onChangeSelectedRow(index) {
    this.setState({ selectedRow: index });
  }

  @autobind
  onChangeHoverRow(index) {
    this.setState({ hoverRow: index });
  }

  @autobind
  onSetGroups(groups) {
    const { setGroups } = this.props;
    if (setGroups) {
      setGroups(groups);
    }
  }

  @autobind
  onPageChange(page) {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(page);
    }
    this.setState({ page });
  }

  @autobind()
  onRefScrolled(node) {
    this.scrolledNode = node;
  }

  @autobind()
  onRefGrid(node) {
    this.gridNode = node;
  }

  @autobind
  getScrollViewport() {
    if (!this.gridNode) {
      return null;
    }
    return this.gridNode.querySelector('.scroll-box__viewport');
  }

  @autobind()
  getResizer() {
    return this.resizerNode;
  }

  @autobind()
  getScrollContainer() {
    if (!this.scrolledNode) {
      return null;
    }
    return this.scrolledNode.querySelector('.rt-table');
  }

  @autobind()
  getScrollHead() {
    if (!this.scrolledNode) {
      return null;
    }
    return this.scrolledNode.querySelectorAll('.rt-thead');
  }

  @autobind()
  getScrollBody() {
    if (!this.scrolledNode) {
      return null;
    }
    return this.scrolledNode.querySelector('.rt-tbody');
  }

  @autobind()
  getViewWidth() {
    const node = this.getScrollContainer();
    return node ? node.clientWidth : 0;
  }

  @autobind()
  onScrollX(offset) {
  }

  @autobind()
  onResize() {
    this.setState({ viewWidth: this.getViewWidth() });
  }

  @autobind
  onScrollY(genericScrollBox) {
    const node = this.getScrollContainer();
    if (node) {
      const { top } = node.getBoundingClientRect();
      const gridTop = this.gridNode.getBoundingClientRect().top;
      const isStickyHeader = top < gridTop;
      if (this.state.isStickyHeader !== isStickyHeader) {
        this.setState({ isStickyHeader });
      }
    }
  }

  @autobind
  scrollToY(scrollY) {
    if (this.scrollBox) {
      this.scrollBox.scrollToY(scrollY);
    }
    this.setState({ isStickyHeader: false });
  }

  @autobind
  setPageSize(pageSize) {
    const { setPageSize } = this.props;
    if (setPageSize) {
      setPageSize(pageSize);
    }
    this.setState({ pageSize });
  }

  @autobind
  getTableProps(state, rowInfo, column, instance) {
    return {};
  }

  @autobind
  getScrollableRows() {
    return this.props.rows;
  }

  getFixedRows() {
    return this.props.rows;
  }

  @autobind
  onExpand(props) {
    const { groups, setExpanded } = this.props;
    const { groupId, original } = props;
    const { hash, _expanded } = original;
    const { filters, nextGroup, groupBy } = buildExpandParameters(groups, original, groupId);

    if (setExpanded) {
      setExpanded(filters, groupId, nextGroup, hash, groupBy, !_expanded);
    }
  }

  @autobind
  getTdProps(state, rowInfo, column, instance) {
    const { grouped, groupId } = column;
    const { groups } = instance.props;
    if (grouped) {
      const { original } = rowInfo;
      const { _expanded, isLoading, groupId: originalGroupId } = original;
      return {
        grouped,
        hidden: grouped && groupId !== originalGroupId,
        groupId,
        original,
        isExpanded: _expanded,
        isLoading,
        haveGroups: true,
        onExpand: this.onExpand,
      };
    } else if (column.Cell && column.groupId) {
      return {
        haveGroups: !!(groups && groups.length),
      };
    }

    return {};
  }

  makeKey(props, state) {
    const { expanded, isStickyHeader, page, viewWidth, pages, selectedRow, hoverRow, currentRow } = state;
    const { columnsFixed, columnsScrolled, page: propsPage, pages: propsPages, groups,
      rows, isLoading, filters, sorting, editMode } = props;
    return {
      columnsFixed,
      columnsScrolled,
      expanded,
      isStickyHeader,
      page,
      pages,
      propsPage,
      propsPages,
      groups,
      rows,
      isLoading,
      viewWidth,
      selectedRow,
      hoverRow,
      currentRow,
      filters,
      sorting,
      editMode,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const prev = this.makeKey(this.props, this.state);
    const next = this.makeKey(nextProps, nextState);
    return !shallowequal(prev, next);
  }

  render() {
    const { columnsFixed, columnsScrolled, viewWidth } = this.state;
    const { groups, validator, editMode, noPaging, noPadding, noGroups, onChangeCell } = this.props;
    const haveGroups = !!(groups && groups.length);
    return (
      <div className='data-grid' ref={ this.onRefGrid }>
        <ScrollBox style={ { height: '100%' } } onScrollY={ this.onScrollY } getRef={ (node) => { this.scrollBox = node; } } >
          <div className='data-grid__header'>
            { this.props.children }
            { !noGroups && this.props.groups && <DataGridGrouping
              className='data-grid__grouping'
              groups={ this.props.groups }
              setGroups={ this.onSetGroups }
            /> }
          </div>
          <div className='data-grid__joined'>
            <div className='data-grid__fixed'>
              <DataGrid
                rows={ this.getFixedRows() }
                columns={ columnsFixed }
                noHighlight={ true }
                selectedRow={ this.state.selectedRow }
                hoverRow={ this.state.hoverRow }
                onChangeSelectedRow={ this.onChangeSelectedRow }
                onChangeHoverRow={ this.onChangeHoverRow }
                isLoading={ this.props.isLoading }
                groups={ this.props.groups }
                manual={ this.props.manual }
                pages={ this.props.pages }
                page={ this.props.page || this.state.page }
                pageSize={ this.props.pageSize || this.state.pageSize }
                showPagination={ true }
                PaginationComponent={ () => null }
                onPageChange={ this.onPageChange }
                isStickyHeader={ this.state.isStickyHeader }
                getTableProps={ this.getTableProps }
                TdComponent={ haveGroups ? DataGridTreeCell : undefined }
                getTdProps={ this.getTdProps }
                openFilter={ this.props.openFilter }
                filters={ this.props.filters }
                setFilters={ this.props.setFilters }
                sorting={ this.props.sorting }
                setSorting={ this.props.setSorting }
                editMode={ editMode }
                validator={ validator }
                noPadding={ noPadding }
                onChangeCell={ onChangeCell }
              />
            </div>
            <div className='data-grid__scrolled' ref={ this.onRefScrolled }>
              <DataGrid
                rows={ this.getScrollableRows() }
                columns={ columnsScrolled }
                noHighlight={ true }
                selectedRow={ this.state.selectedRow }
                hoverRow={ this.state.hoverRow }
                onChangeSelectedRow={ this.onChangeSelectedRow }
                onChangeHoverRow={ this.onChangeHoverRow }
                groups={ this.props.groups }
                showPagination={ true }
                showPaginationBottom={ true }
                showPageSizeOptions={ false }
                manual={ this.props.manual }
                pages={ this.props.pages }
                page={ this.state.page }
                pageSize={ this.state.pageSize }
                onFetchData={ this.props.onFetchData }
                PaginationComponent={ DataGridPagination }
                onScroll={ this.onScrollX }
                getScrollContainer={ this.getScrollContainer }
                getScrollViewport={ this.getScrollViewport }
                getScrollHead={ this.getScrollHead }
                getScrollBody={ this.getScrollBody }
                getResizer={ this.getResizer }
                setPageSize={ this.setPageSize }
                onPageChange={ this.onPageChange }
                isStickyHeader={ this.state.isStickyHeader }
                noLoader={ this.state.haveFixedColumns }
                isLoading={ this.props.isLoading }
                hidePager={ haveGroups }
                openFilter={ this.props.openFilter }
                filters={ this.props.filters }
                setFilters={ this.props.setFilters }
                sorting={ this.props.sorting }
                setSorting={ this.props.setSorting }
                viewWidth={ viewWidth }
                scrollToY={ this.scrollToY }
                editMode={ editMode }
                validator={ validator }
                noPaging={ noPaging }
                noPadding={ noPadding }
                onChangeCell={ onChangeCell }
              />
              <div className='data-grid__resizer' ref={ (node) => { this.resizerNode = node; } }>
                <ReactResizeDetector handleWidth onResize={ this.onResize } />
              </div>
            </div>
          </div>
        </ScrollBox>
      </div>
    );
  }
}
