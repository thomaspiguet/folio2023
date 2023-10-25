import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import Dropdown from '../../controls/dropdown';

import './data-grid-pagination.scss';

const SCROLLER_BUTTON_WIDTH = 60;

export default class DataGridPagination extends Component {
  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    canPrevious: PropTypes.bool,
    canNext: PropTypes.bool,
    isLastPage: PropTypes.bool,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    viewWidth: PropTypes.number,
    fullWidth: PropTypes.number,
  };

  static defaultProps = {
    pageSize: 30,
    pageSizes: {
      10: { title: '10' },
      20: { title: '20' },
      30: { title: '30' },
      50: { title: '50' },
      80: { title: '80' },
    },
    footerOffset: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      pointerX: 0,
      tracking: false,
      fullWidth: 0,
      viewWidth: 0,
      viewOffset: 0,
      changedPageSize: false,
    };
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { fullWidth, viewWidth, tableBottom, paginationTop, viewOffset, footerHeight } = this.getViewState(props);
    this.setState({ fullWidth, viewWidth, tableBottom, paginationTop, viewOffset, footerHeight }, () => {
      this.doScroll(0);
    });

    const { page, onPageChange, pageSize } = props;
    if (pageSize !== this.props.pageSize) {
      onPageChange(page);
    }
  }

  @autobind
  onPrevious() {
    const { onPageChange, page, canPrevious } = this.props;
    if (canPrevious) {
      onPageChange(page - 1);
    }
  }

  @autobind
  onNext() {
    const { onPageChange, page, canNext } = this.props;
    if (canNext) {
      onPageChange(page + 1);
    }
  }

  @autobind
  onMouseStart(event) {
    event.stopPropagation();
    if (!this.scroller || this.state.tracking) {
      return;
    }
    const rect = this.scroller.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    this.setState({ tracking: true, pointerX, startX: pointerX });
  }

  @autobind
  onMouseEnd(event) {
    event.stopPropagation();
    if (!this.scroller || !this.state.tracking) {
      return;
    }
    const rect = this.scroller.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    this.setState({ tracking: false });
    if (pointerX === this.state.startX) {
      this.setScroll(pointerX);
    }
  }

  @autobind
  onMouseMove(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.scroller || !this.state.tracking) {
      return;
    }
    const rect = this.scroller.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const delta = pointerX - this.state.pointerX;

    this.setState({ pointerX });
    this.doScroll(delta);
  }

  @autobind
  onWheel(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.scroller) {
      return;
    }

    const { deltaY } = event;
    const delta = -deltaY;

    this.doScroll(delta < 0 ? -10 : 10);
  }

  @autobind
  onScrollPrev() {
    this.doScroll(-10);
  }

  @autobind
  onScrollNext() {
    this.doScroll(10);
  }

  @autobind
  setPageSize(pageSize) {
    const { setPageSize } = this.props;
    if (setPageSize) {
      setPageSize(+pageSize);
    }
    const changedPageSize = true;
    this.setState({ changedPageSize });
  }

  getFullWidth(getNode) {
    const node = getNode();
    return node ? node.clientWidth : 0;
  }

  getViewState(props) {
    const { getScrollContainer, getScrollHead, getScrollBody, getScrollViewport } = props;
    const node = getScrollContainer();
    if (node) {
      const fullWidth = this.getFullWidth(getScrollBody);
      const headNodes = getScrollHead();
      const bodyNode = getScrollBody();
      const viewWidth = node.clientWidth;
      const viewOffset = node.scrollLeft;
      const { bottom: tableBottom } = node.getBoundingClientRect();
      const { top: paginationTop } = this.pagination ? this.pagination.getBoundingClientRect() : {};
      const footerHeight = this.footer ? this.footer.getBoundingClientRect().height : 0;
      const viewPort = getScrollViewport();
      const scrollTop = viewPort ? viewPort.scrollTop : 0;
      const { bottom: viewBottom } = viewPort ? viewPort.getBoundingClientRect() : { top: paginationTop };

      const state = {
        node,
        headNodes,
        bodyNode,
        fullWidth,
        viewWidth,
        viewBottom,
        viewOffset,
        tableBottom,
        paginationTop,
        footerHeight,
        scrollTop,
      };
      return state;
    }

    return { node };
  }

  setScroll(offset) {
    const { node, headNodes, fullWidth, viewWidth } = this.getViewState(this.props);
    if (!node || !fullWidth) {
      return;
    }
    const scrollerWidth = this.getScrollerWidth(viewWidth);
    const viewOffset = offset * fullWidth / scrollerWidth - viewWidth / 2;
    this.setNodeScroll(node, headNodes, viewOffset, fullWidth, viewWidth);
  }

  doScroll(delta) {
    const { node, headNodes, fullWidth, viewWidth, viewOffset } = this.getViewState(this.props);
    if (node) {
      const viewDelta = fullWidth * delta / viewWidth;

      const offset = viewOffset + viewDelta;
      this.setNodeScroll(node, headNodes, offset, fullWidth, viewWidth);

      const { onScroll } = this.props;
      if (onScroll) {
        onScroll(node.scrollLeft);
      }
    }
  }

  setNodeScroll(node, headNodes, offset, fullWidth, viewWidth) {
    if (!node) {
      return;
    }
    const { isStickyHeader } = this.props;
    if (offset > fullWidth - viewWidth) {
      offset = fullWidth - viewWidth;
    }
    if (offset < 0) {
      offset = 0;
    }
    offset = Math.ceil(offset);

    node.scrollLeft = offset;
    for (let ind = 0; ind < headNodes.length; ++ind) {
      const item = headNodes[ind];
      if (isStickyHeader) {
        item.style.minWidth = `${ viewWidth }px`;
        item.style.width = `${ viewWidth }px`;
        item.style.overflow = 'hidden';
        item.scrollLeft = offset;
      } else {
        item.style.minWidth = `${ fullWidth }px`;
        item.style.width = `${ fullWidth }px`;
        item.style.overflow = 'visible';
        item.scrollLeft = 0;
      }
    }

    this.setState({
      viewOffset: offset,
      viewWidth,
      fullWidth,
    });
  }

  @autobind
  onRefScroller(node) {
    this.scroller = node;
  }

  @autobind
  onRefPagination(node) {
    this.pagination = node;
  }

  @autobind
  onRefFooter(node) {
    this.footer = node;
  }

  getScrollerWidth(viewWidth) {
    return viewWidth - SCROLLER_BUTTON_WIDTH;
  }

  componentDidUpdate() {
    const footer = this.footer;
    if (!footer) {
      return;
    }

    const { getResizer, noPaging } = this.props;
    if (!getResizer) {
      return;
    }

    const resizerNode = getResizer();
    if (!resizerNode) {
      return;
    }

    const footerHeight = footer.getBoundingClientRect().height;
    this.footerHeight = footerHeight;
    const height = (noPaging ? 1 : 50) + footerHeight;
    resizerNode.style.height = `${ height }px`;
  }

  @autobind
  onGotoTop() {
    const { getScrollViewport, scrollToY } = this.props;
    if (scrollToY) {
      scrollToY(0);
    } else {
      const viewPort = getScrollViewport();
      if (viewPort) {
        viewPort.scrollTop = 0;
      }
    }
  }

  render() {
    const { pages, page, pageSize, pageSizes, isStickyHeader,
      noPaging, noPadding, Footer, hidePager, footerOffset } = this.props;
    const { viewWidth, viewBottom, fullWidth, viewOffset, tableBottom, footerHeight, scrollTop } = this.getViewState(this.props);
    const scrollerWidth = this.getScrollerWidth(viewWidth);
    const activeWidth = Math.ceil(scrollerWidth * viewWidth / fullWidth);
    const activeOffset = Math.ceil(viewOffset * scrollerWidth / fullWidth);
    const isScrollerVisible = !!(viewWidth && viewWidth < fullWidth);
    const isPagerVisible = !noPaging && !hidePager;
    const isPaginationStatic = (noPadding && noPaging) ||
      !isStickyHeader && ((tableBottom + footerHeight + footerOffset) < viewBottom);
    const showGotoTop = scrollTop > 0;
    const thePages = pages < 1 ? 1 : pages;
    const thePage = page < thePages ? (page + 1) : thePages;
    const canPrevious = thePage > 1;
    const canNext = thePage < thePages;
    return (
      <div
        ref={ this.onRefPagination }
        className={ classNames('data-grid-pagination', { 'data-grid-pagination--last': isPaginationStatic }) }
        style={ { width: viewWidth || 'auto' } }
      >
        <div className='data-grid-pagination__bottom' />
        { isScrollerVisible &&
        <div className='data-grid-pagination__scroller'>
          <div className='data-grid-pagination__scroll-prev' onClick={ this.onScrollPrev } />
          <div
            className='data-grid-pagination__scroll-bar'
            style={ { width: scrollerWidth } }
            ref={ this.onRefScroller }
            onMouseDown={ this.onMouseStart }
            onMouseLeave={ this.onMouseEnd }
            onMouseUp={ this.onMouseEnd }
            onMouseMove={ this.onMouseMove }
            onWheel={ this.onWheel }
          >
            <div className='data-grid-pagination__scroll-line' style={ { width: scrollerWidth } } />
            <div className='data-grid-pagination__scroll-active' style={ { width: activeWidth, left: activeOffset } } />
          </div>
          <div className='data-grid-pagination__scroll-next' onClick={ this.onScrollNext } />
        </div>
        }
        { isPagerVisible &&
        <div className={ classNames('data-grid-pagination__pager', { 'data-grid-pagination__pager--top': !isScrollerVisible }) }>
          <div className='data-grid-pagination__rows'>
            <div className='data-grid-pagination__text'>
              <FormattedMessage id='pagination.rows-per-page' defaultMessage='Rows per page:' />
            </div>
            <Dropdown
              classNames='data-grid-pagination__dropdown'
              values={ pageSizes }
              value={ pageSize }
              onChange={ this.setPageSize }
              showUpward={ true }
              height='130px'
            />
          </div>
          <div className='data-grid-pagination__pages'>
            { thePage }
            <FormattedMessage id='pagination.of' defaultMessage='of' />
            { thePages }
          </div>
          <div
            className={ classNames('data-grid-pagination__arrow', 'data-grid-pagination__arrow--previous', { 'data-grid-pagination__arrow--disabled': !canPrevious }) }
            onClick={ this.onPrevious }
          />
          <div
            className={ classNames('data-grid-pagination__arrow', 'data-grid-pagination__arrow--next', { 'data-grid-pagination__arrow--disabled': !canNext }) }
            onClick={ this.onNext }
          />
          { showGotoTop && <div className='data-grid-pagination__goto-top' onClick={ this.onGotoTop } /> }
        </div>
        }
        { Footer &&
          <div className='data-grid-pagination__footer' ref={ this.onRefFooter } > { Footer } </div>
        }
      </div>
    );
  }
}
