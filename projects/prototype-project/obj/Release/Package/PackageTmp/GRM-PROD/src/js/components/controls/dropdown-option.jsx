import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import './dropdown.scss';

import {
  TOP_MENU_BUTTON_NOTES,
  TOP_MENU_BUTTON_ATTACHMENTS,
  TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP,
  TOP_MENU_BUTTON_BUDGET_CALCULATION,
  TOP_MENU_BUTTON_EDIT,
  TOP_MENU_BUTTON_COPY,
} from '../../features/app/reducers/app';

export class DropDownOption extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    pageSize: PropTypes.number,
    index: PropTypes.number,
    opt: PropTypes.object,
    currentOpt: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    exit: PropTypes.func,
    setItem: PropTypes.func,
    onChange: PropTypes.func,
    selected: PropTypes.bool,
    showIcon: PropTypes.bool,
  };

  static defaultProps = {
    className: 'dropdown__option',
    showIcon: false,
  };

  @autobind
  onClick() {
    const { value, opt, currentValue, onChange } = this.props;
    onChange(value, opt, currentValue);
  }

  @autobind
  onMouseEnter(e) {
    const { setItem, index } = this.props;
    if (setItem) {
      setItem(index);
    }
  }

  @autobind
  onKeyDown(e) {
    const { key } = e;
    const { setItem, index, exit, pageSize } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (key === 'ArrowDown') {
      setItem(index + 1);
    } else if (key === 'ArrowUp') {
      setItem(index - 1);
    } else if (key === 'Home') {
      setItem(0);
    } else if (key === 'End') {
      setItem(10000);
    } else if (key === 'PageUp') {
      setItem(index - pageSize);
    } else if (key === 'PageDown') {
      setItem(index + pageSize);
    } else if (key === 'Enter') {
      this.onClick();
    } else if (key === 'Escape') {
      exit();
    }
  }

  componentDidMount() {
    this.checkFocus();
  }

  componentDidUpdate() {
    this.checkFocus();
  }

  checkFocus() {
    const { opt, currentOpt } = this.props;
    const active = opt === currentOpt;
    if (active && this.node) {
      this.node.focus();
    }
  }

  renderFA() {
    const { opt } = this.props;
    if (opt.code === TOP_MENU_BUTTON_NOTES)
      return (<i className='fa fa-sticky-note small-btn-icons-top-menu-buttons' />);
    else if (opt.code === TOP_MENU_BUTTON_ATTACHMENTS)
      return (<i className='material-icons small-btn-icons-top-menu-buttons'>attach_file</i>);
    else if (opt.code === TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP)
      return (<i className='fa fa-calculator small-btn-icons-top-menu-buttons' />);
    else if (opt.code === TOP_MENU_BUTTON_EDIT)
      return (<i className='material-icons small-btn-icons-top-menu-buttons'>edit</i>);
    else if (opt.code === TOP_MENU_BUTTON_COPY)
      return (<i className='material-icons small-btn-icons-top-menu-buttons'>content_copy</i>);
    else
      return null;
  }

  renderIcon() {
    const { showIcon, opt, className } = this.props;
    if (showIcon && opt && opt.code) {
      const iconClass = `${ className }-icon`;
      const iconClassName = classNames(iconClass, {
        [`${ iconClass }--notes`]: opt.code === TOP_MENU_BUTTON_NOTES,
        [`${ iconClass }--attachments`]: opt.code === TOP_MENU_BUTTON_ATTACHMENTS,
        [`${ iconClass }--calculation-follow-up`]: opt.code === TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP,
        [`${ iconClass }--budget-calculation`]: opt.code === TOP_MENU_BUTTON_BUDGET_CALCULATION,
        [`${ iconClass }--edit`]: opt.code === TOP_MENU_BUTTON_EDIT,
        [`${ iconClass }--copy`]: opt.code === TOP_MENU_BUTTON_COPY,
      });
      const fa = this.renderFA();
      return (
        <div className={ iconClassName }>
          {fa}
        </div>
      );
    }
    return null;
  }

  renderTitle() {
    const { showIcon, title, className } = this.props;
    if (showIcon) {
      const titleClass = `${ className }-title`;
      const titleClassName = classNames(titleClass, {});
      return (
        <div className={ titleClassName }>{ title }</div>
      );
    }
    return title;
  }

  render() {
    const { selected, className, showIcon, opt, currentOpt } = this.props;
    const active = opt === currentOpt;
    const optionClassName = classNames(className, {
      [`${ className }--selected`]: selected,
      [`${ className }--active`]: active && !showIcon,
      [`${ className }--not-active`]: !opt.active && showIcon,
    });

    return (
      <div
        className={ optionClassName }
        onClick={ this.onClick }
        tabIndex='0'
        onMouseEnter={ this.onMouseEnter }
        onKeyDown={ this.onKeyDown }
        ref={ (node) => { this.node = node; } }
      >
        { this.renderIcon() }
        { this.renderTitle() }
      </div>
    );
  }
}
