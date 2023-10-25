/* Forked from react-tiny-virtual-list */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import SizeAndPositionManager from './SizeAndPositionManager';

import {
  // ALIGNMENT,
  ALIGN_AUTO,
  ALIGN_CENTER,
  ALIGN_END,
  ALIGN_START,
  // DIRECTION,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  // SCROLL_CHANGE_REASON,
  SCROLL_CHANGE_OBSERVED,
  SCROLL_CHANGE_REQUESTED,
  positionProp,
  scrollProp,
  sizeProp,
} from './constants';

const STYLE_WRAPPER = {
  overflow: 'hidden', // 'auto'
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch',
};

const STYLE_INNER = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  minHeight: '100%',
};

const STYLE_ITEM = {
  position: 'absolute',
  left: 0,
  width: '100%',
};

export default class VirtualScrollList extends PureComponent {
  static defaultProps = {
    overscanCount: 3,
    scrollDirection: DIRECTION_VERTICAL,
    width: '100%',
    overflowStyle: 'hidden',
  };

  static propTypes = {
    estimatedItemSize: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    itemCount: PropTypes.number.isRequired,
    itemSize: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.func]).isRequired,
    onItemsRendered: PropTypes.func,
    overscanCount: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollOffset: PropTypes.number,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.oneOf([ALIGN_AUTO, ALIGN_START, ALIGN_CENTER, ALIGN_END]),
    scrollDirection: PropTypes.oneOf([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  sizeAndPositionManager = new SizeAndPositionManager({
    itemCount: this.props.itemCount,
    itemSizeGetter: (index) => this.getSize(index),
    estimatedItemSize: this.getEstimatedItemSize(),
  });

  state = {
    offset: (
      this.props.scrollOffset ||
      this.props.scrollToIndex != null && this.getOffsetForIndex(this.props.scrollToIndex) ||
      0
    ),
    scrollChangeReason: SCROLL_CHANGE_REQUESTED,
  };

  rootNode;

  styleCache = {};

  componentDidMount() {
    const { scrollOffset, scrollToIndex } = this.props;

    if (scrollOffset != null) {
      this.scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      this.scrollTo(this.getOffsetForIndex(scrollToIndex));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      estimatedItemSize,
      itemCount,
      itemSize,
      scrollOffset,
      scrollToAlignment,
      scrollToIndex,
    } = this.props;
    const scrollPropsHaveChanged = (
      nextProps.scrollToIndex !== scrollToIndex ||
      nextProps.scrollToAlignment !== scrollToAlignment
    );
    const itemPropsHaveChanged = (
      nextProps.itemCount !== itemCount ||
      nextProps.itemSize !== itemSize ||
      nextProps.estimatedItemSize !== estimatedItemSize
    );

    if (
      nextProps.itemCount !== itemCount ||
      nextProps.estimatedItemSize !== estimatedItemSize
    ) {
      this.sizeAndPositionManager.updateConfig({
        itemCount: nextProps.itemCount,
        estimatedItemSize: this.getEstimatedItemSize(nextProps),
      });
    }

    if (itemPropsHaveChanged) {
      this.recomputeSizes();
    }

    if (nextProps.scrollOffset !== scrollOffset) {
      this.setState({
        offset: nextProps.scrollOffset || 0,
        scrollChangeReason: SCROLL_CHANGE_REQUESTED,
      });
    } else if (
      typeof nextProps.scrollToIndex === 'number' && (
        scrollPropsHaveChanged || itemPropsHaveChanged
      )
    ) {
      this.setState({
        offset: this.getOffsetForIndex(nextProps.scrollToIndex, nextProps.scrollToAlignment, nextProps.itemCount),
        scrollChangeReason: SCROLL_CHANGE_REQUESTED,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { offset, scrollChangeReason } = this.state;

    if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REQUESTED) {
      this.scrollTo(offset);
    }
  }

  @autobind
  handleScroll(e) {
    const { onScroll } = this.props;
    const offset = this.getNodeOffset();

    if (offset < 0 || this.state.offset === offset || e.target !== this.rootNode) {
      return;
    }

    this.setState({
      offset,
      scrollChangeReason: SCROLL_CHANGE_OBSERVED,
    });

    if (typeof onScroll === 'function') {
      onScroll(offset, e);
    }
  }

  @autobind
  doScroll(delta) {
    const { onScroll } = this.props;
    const prevOffset = this.getNodeOffset();
    let offset = prevOffset + delta;
    if (offset < 0) {
      offset = 0;
    }

    this.setState({
      offset,
      scrollChangeReason: SCROLL_CHANGE_REQUESTED,
    });

    if (typeof onScroll === 'function') {
      const isVertical = this.isVerticalDirection();
      onScroll(offset, { deltaY: isVertical ? delta : 0, deltaX: !isVertical ? delta : 0 });
    }
  }

  isVerticalDirection() {
    const { scrollDirection } = this.props;
    return scrollDirection === DIRECTION_VERTICAL;
  }

  @autobind
  getEstimatedItemSize(props = this.props) {
    return props.estimatedItemSize || typeof props.itemSize === 'number' && props.itemSize || 50;
  }

  @autobind
  getNodeOffset() {
    const { scrollDirection = DIRECTION_VERTICAL } = this.props;
    return this.rootNode[scrollProp[scrollDirection]];
  }

  @autobind
  scrollTo(value) {
    const { scrollDirection = DIRECTION_VERTICAL } = this.props;
    this.rootNode[scrollProp[scrollDirection]] = value;
  }

  @autobind
  getOffsetForIndex(index, scrollToAlignment = this.props.scrollToAlignment, itemCount: number = this.props.itemCount) {
    const { scrollDirection = DIRECTION_VERTICAL } = this.props;

    if (index < 0 || index >= itemCount) {
      index = 0;
    }

    return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: scrollToAlignment,
      containerSize: this.props[sizeProp[scrollDirection]],
      currentOffset: this.state && this.state.offset || 0,
      targetIndex: index,
    });
  }

  @autobind
  getSize(index) {
    const { itemSize } = this.props;

    if (typeof itemSize === 'function') {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  }

  @autobind
  getStyle(index) {
    const style = this.styleCache[index];
    if (style) { return style; }

    const { scrollDirection = DIRECTION_VERTICAL } = this.props;
    const { size, offset } = this.sizeAndPositionManager.getSizeAndPositionForIndex(index);

    return this.styleCache[index] = {
      ...STYLE_ITEM,
      [sizeProp[scrollDirection]]: size,
      [positionProp[scrollDirection]]: offset,
    };
  }

  @autobind
  recomputeSizes(startIndex = 0) {
    this.styleCache = {};
    this.sizeAndPositionManager.resetItem(startIndex);
  }

  render() {
    const {
      // estimatedItemSize,
      height,
      overscanCount,
      renderItem,
      // itemCount,
      // itemSize,
      onItemsRendered,
      // onScroll,
      scrollDirection = DIRECTION_VERTICAL,
      // scrollOffset,
      // scrollToIndex,
      // scrollToAlignment,
      style,
      width,
      className,
      overflowStyle,
      // ...props
    } = this.props;
    const { offset } = this.state;
    const { start, stop } = this.sizeAndPositionManager.getVisibleRange({
      containerSize: this.props[sizeProp[scrollDirection]] || 0,
      offset,
      overscanCount,
    });
    const items = [];

    if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
      for (let index = start; index <= stop; index++) {
        items.push(renderItem({
          index,
          style: this.getStyle(index),
        }));
      }

      if (typeof onItemsRendered === 'function') {
        onItemsRendered({
          startIndex: start,
          stopIndex: stop,
        });
      }
    }

    return (
      <div
        ref={ this.getRef }
        className={ className }
        onScroll={ this.handleScroll }
        style={ { ...STYLE_WRAPPER, overflow: overflowStyle, ...style, height, width } }
      >
        <div style={ { ...STYLE_INNER, [sizeProp[scrollDirection]]: this.sizeAndPositionManager.getTotalSize() } }>
          {items}
        </div>
      </div>
    );
  }

  @autobind
  getRef(node) {
    this.rootNode = node;
  }
}
