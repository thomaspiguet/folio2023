import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import ReactResizeDetector from 'react-resize-detector';
import { ScrollBox } from '../scroll-box';

import DataGridPagination from './data-grid-pagination';
import DataGridGrouping from './data-grid-grouping';

import DataGrid from './data-grid';

import './data-grid.scss';
import { increaseStateVersion } from '../../../utils/utils';

class DataGridScrollable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isStickyHeader: false,
      pageSize: 30,
      version: 0,
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
    const { pageSize } = props;
    if (pageSize) {
      this.setState({ pageSize });
    }
  }

  @autobind
  onPageChange(page) {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(page);
    }
  }

  @autobind
  setPageSize(pageSize) {
    const { setPageSize } = this.props;
    if (setPageSize) {
      setPageSize(pageSize);
    }
    this.setState({ pageSize });
  }

  @autobind()
  onRefScrolled(node) {
    this.scrolledNode = node;
  }

  @autobind()
  onRefGrid(node) {
    this.gridNode = node;
  }

  @autobind()
  onRefResizer(node) {
    this.resizerNode = node;
  }

  @autobind
  onScrollGrid() {
    increaseStateVersion(this);
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
  getScrollViewport() {
    if (!this.gridNode) {
      return null;
    }
    return this.gridNode.querySelector('.scroll-box__viewport');
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
    const viewWidth = this.getViewWidth();
    this.setState({ viewWidth });
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

  render() {
    const { labelText, labelIntlId, intl, noGroups } = this.props;
    const label = labelIntlId ? intl.formatMessage({ id: labelIntlId }) : labelText;
    return (
      <div
        className={ classNames('data-grid', {
          'data-grid--fill': this.props.fill,
          'data-grid--no-paging': this.props.noPaging,
          'data-grid--standalone': this.props.standalone,
        }) }
        ref={ this.onRefGrid }
        onScroll={ this.onScrollGrid }
      >
        <ScrollBox style={ { height: '100%' } } onScrollY={ this.onScrollY } getRef={ (node) => { this.scrollBox = node; } } >
          <div className={ classNames('data-grid__header', { 'data-grid__header--fill': this.props.fill }) }>
            { this.props.children }
            { !noGroups && this.props.groups && <DataGridGrouping
              className='data-grid__grouping'
              groups={ this.props.groups }
              setGroups={ this.props.setGroups }
            /> }
            { label && <div className='data-grid__label'><span>{ label }</span></div> }
          </div>
          <div
            className={ classNames('data-grid__scrolled', { 'data-grid__scrolled--full-width': this.props.isFullWidth }) }
            ref={ this.onRefScrolled }
          >
            <DataGrid
              { ...this.props }
              children={ null }
              noHighlight={ true }
              showPagination={ true }
              showPaginationBottom={ true }
              showPageSizeOptions={ false }
              pageSize={ this.props.pageSize || this.state.pageSize }
              PaginationComponent={ DataGridPagination }
              onScroll={ this.onScrollX }
              getScrollContainer={ this.getScrollContainer }
              getScrollHead={ this.getScrollHead }
              getScrollBody={ this.getScrollBody }
              getScrollViewport={ this.getScrollViewport }
              getResizer={ this.getResizer }
              onPageChange={ this.onPageChange }
              setPageSize={ this.setPageSize }
              isStickyHeader={ this.state.isStickyHeader }
              viewWidth={ this.state.viewWidth }
              version={ `${ this.state.version }.${ this.props.version }` }
              filters={ this.props.filters }
              setFilters={ this.props.setFilters }
              sorting={ this.props.sorting }
              setSorting={ this.props.setSorting }
              scrollToY={ this.scrollToY }
            />
            <div
              className={ classNames('data-grid__resizer', { 'data-grid__resizer--no-paging': this.props.noPaging }) }
              ref={ this.onRefResizer }
            >
              <ReactResizeDetector handleWidth onResize={ this.onResize } />
            </div>
          </div>
        </ScrollBox>
      </div>
    );
  }

}

export default injectIntl(DataGridScrollable);
