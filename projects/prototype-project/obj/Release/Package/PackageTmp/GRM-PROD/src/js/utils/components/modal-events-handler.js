import { autobind } from 'core-decorators';
import { find } from 'lodash';

export default class ModalEventsHandler {

  constructor(getNode, { onClickOutside, onWheelEvent, noWheel } = {}) {
    this.getNode = getNode;
    this.blockEvents = false;
    this.handleOutsideClick = onClickOutside;
    this.handleWheelEvent = onWheelEvent;
    this.noWheel = noWheel;
  }

  block(value) {
    this.blockEvents = value;
  }

  setFormNode(formNode) {
    if (formNode !== this.formNode) {
      this.formNode = formNode;
    }
  }

  onMount(formNode) {
    this.formNode = formNode;
    document.addEventListener('click', this.handleClickOutside, true);
    document.addEventListener('dragstart', this.onUnhandledEvent, true);
    document.addEventListener('dragstart', this.onUnhandledEvent, false);
    document.addEventListener('wheel', this.onWheelEvent, true);
    document.addEventListener('wheel', this.onWheelEvent, false);
    document.addEventListener('scroll', this.onScrollEvent, true);
    document.addEventListener('scroll', this.onScrollEvent, false);
  }

  onUnmount() {
    this.formNode = undefined;
    document.removeEventListener('dragstart', this.onUnhandledEvent, true);
    document.removeEventListener('dragstart', this.onUnhandledEvent, false);
    document.removeEventListener('wheel', this.onWheelEvent, true);
    document.removeEventListener('wheel', this.onWheelEvent, false);
    document.removeEventListener('scroll', this.onScrollEvent, true);
    document.removeEventListener('scroll', this.onScrollEvent, false);
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  @autobind
  handleClickOutside(e) {
    if (!this.blockEvents || this.isOutOfForm(e)) {
      return;
    }
    if (find(e.path, ({ nodeName, className }) => (nodeName === 'DIV'
      && (className === 'popup-dialog'
        || className === 'panel__paper'
        || className === 'scroll-box__handle scroll-box__handle--y'
        || className === 'scroll-box__track scroll-box__track--y scroll-box__track--hover'
      )))) {
      return;
    }
    const node = this.getNode();
    if (!node) {
      return;
    }
    if (!this.isInside(node, e)) {
      if (this.handleOutsideClick) {
        this.handleOutsideClick();
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  isOutOfForm(e) {
    if (!this.formNode) {
      return false;
    }

    const res = this.formNode.contains(e.target);
    return !res;
  }

  @autobind
  isEventInsize(e) {
    return this.isInside(this.getNode(), e);
  }

  isInside(node, e) {
    return (node && node.contains(e.target));
  }

  @autobind
  onUnhandledEvent(e) {
    if (!this.blockEvents || this.isOutOfForm(e)) {
      return;
    }
    const node = this.getNode();
    if (!node) {
      return;
    }
    if (this.isInside(node, e)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  onWheelEvent(e) {
    if (!this.blockEvents) {
      return;
    }
    if (this.handleWheelEvent) {
      this.handleWheelEvent(e);
      return;
    }
    this.onScrollEvent(e);
  }

  @autobind
  onScrollEvent(e) {
    if (this.noWheel) {
      return;
    }
    if (!this.blockEvents || this.isOutOfForm(e)) {
      return;
    }
    const node = this.getNode();
    if (!node) {
      return;
    }
    if (this.isInside(node, e)) {
      const scroller = node.querySelector('.scroll-box__track--y');
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

}
