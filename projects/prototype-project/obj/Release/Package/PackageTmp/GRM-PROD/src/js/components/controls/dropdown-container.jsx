import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';

export default class DropdownContainer extends Component {

  componentWillUnmount() {
    this.detachHandlers();
  }

  componentDidUpdate(prevProps) {
    const prevExpanded = { prevProps };
    const { expanded } = this.props;
    if (prevExpanded !== expanded) {
      if (expanded) {
        this.attachHandlers();
      } else {
        this.detachHandlers();
      }
    }
  }

  attachHandlers() {
    document.addEventListener('mousedown', this.handleClickOutside, true);
    document.addEventListener('dragstart', this.onUnhandledEvent, true);
    document.addEventListener('dragstart', this.onUnhandledEvent, false);
    document.addEventListener('wheel', this.onScrollEvent, true);
    document.addEventListener('wheel', this.onScrollEvent, false);
    document.addEventListener('scroll', this.onScrollEvent, true);
    document.addEventListener('scroll', this.onScrollEvent, false);
  }

  detachHandlers() {
    document.removeEventListener('dragstart', this.onUnhandledEvent, true);
    document.removeEventListener('dragstart', this.onUnhandledEvent, false);
    document.removeEventListener('wheel', this.onScrollEvent, true);
    document.removeEventListener('wheel', this.onScrollEvent, false);
    document.removeEventListener('scroll', this.onScrollEvent, true);
    document.removeEventListener('scroll', this.onScrollEvent, false);
    document.removeEventListener('mousedown', this.handleClickOutside, true);
  }

  @autobind
  handleClickOutside(e) {
    if (!this.handleClickInside(e)) {
      this.props.onClose();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @autobind
  onScrollEvent(e) {
    const { dropdownBoxNode } = this.props.getDropdownNodes();
    if (!dropdownBoxNode) {
      return;
    }
    const scrollBox = dropdownBoxNode.querySelector('.scroll-box');
    if (scrollBox && scrollBox.contains(e.target)) {
      const scroller = dropdownBoxNode.querySelector('.scroll-box__track--y');
      if (scroller) {
        const style = window.getComputedStyle(scroller, null);
        if (style && style.visibility !== 'hidden') {
          return;
        }
      }
    }

    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  onUnhandledEvent(e) {
    const { dropdownBoxNode } = this.props.getDropdownNodes();
    if (!dropdownBoxNode) {
      return;
    }
    if (this.handleClickInside(e)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  handleClickInside(e) {
    const { dropdownToogleNode } = this.props.getDropdownNodes();
    return (dropdownToogleNode && dropdownToogleNode.contains(e.target));
  }

  render() {
    return (
      <div className={ classNames('dropdown__container', this.props.containerClassNames) }>
        { this.props.children }
      </div>
    );
  }
}
