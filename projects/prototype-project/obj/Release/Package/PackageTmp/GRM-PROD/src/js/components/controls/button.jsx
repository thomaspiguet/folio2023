import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import './button.scss';
import { focusKeyDown } from '../../utils/components/keyboard';

class Button extends Component {
  static propTypes = {
    intl: PropTypes.object,
    labelIntlId: PropTypes.string,
    editMode: PropTypes.bool,
    classElementModifier: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      mouse: false,
    };
  }

  @autobind
  handleOnClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  @autobind
  onKeyDown(e) {
    const { onTab, onShiftTab } = this.props;
    focusKeyDown(e, { onTab, onShiftTab, onEnter: this.handleOnClick });
  }

  @autobind
  onMouseDown(e) {
    this.setState({ mouse: true });
  }

  @autobind
  onMouseUp(e) {
    this.setState({ mouse: false });
  }

  renderAwesomeFont() {
    const { classElementModifier } = this.props;

    if (classElementModifier === 'export-to-excel--with-icon')
      return (<i className='fa fa-file-excel-o small-btn-icons-excel' />);
    else
      return null;
  }

  renderMaterialIcon() {
    const { classElementModifier } = this.props;

    if (classElementModifier === 'customize-columns-apply')
      return (<i class="material-icons small-btn-icons">check</i>);
    else if (classElementModifier === 'customize-columns-restore-defaults')
      return (<i class="material-icons small-btn-icons">history</i>);
    else
      return null;
  }

  render() {
    const { labelIntlId, intl, classElementModifier, className, disabled, onRef } = this.props;
    const { mouse } = this.state;
    const buttonClassName = classNames(className, 'button',
      classElementModifier ? `button__${ classElementModifier }` : null, {
        'button--disabled': disabled,
        'button--mouse': mouse,
      });
    const excelIcon = this.renderAwesomeFont();
    const matIcon = this.renderMaterialIcon();

    return (
      <div
        className={ buttonClassName }
        onClick={ disabled ? null : this.handleOnClick }
        onKeyDown={ disabled ? null : this.onKeyDown }
        tabIndex={ disabled ? null : '0' }
        onMouseDown={ disabled ? null : this.onMouseDown }
        onMouseUp={ disabled ? null : this.onMouseUp }
        ref={ disabled ? null : onRef }
      >
        { labelIntlId && <span>{intl.formatMessage({ id: labelIntlId })}</span> }
        {excelIcon}
        {matIcon}
      </div>
    );
  }
}

export default injectIntl(Button);
