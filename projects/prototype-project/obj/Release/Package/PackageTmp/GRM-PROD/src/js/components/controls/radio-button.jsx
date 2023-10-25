import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { find } from 'lodash';
import { autobind } from 'core-decorators';

import './radio-button.scss';
import { focusKeyDown } from '../../utils/components/keyboard';

class RadioButton extends PureComponent {
  static propTypes = {
    intl: PropTypes.object,
    labelIntlId: PropTypes.string,
    labelIntlValues: PropTypes.object,
    disabled: PropTypes.bool,
    editMode: PropTypes.bool,
    value: PropTypes.any,
    values: PropTypes.array,
    verticalAligned: PropTypes.bool,
    twoColumnsWidth: PropTypes.bool,
    labelClassModifier: PropTypes.string,
    itemClassModifier: PropTypes.string,
  };

  static defaultProps = {
    editMode: false,
    verticalAligned: false,
    labelClassModifier: '',
    itemClassModifier: '',
  };

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    this.resetIfActiveIsGrayedOut(props);
  }

  resetIfActiveIsGrayedOut(props) {
    const active = find(props.values, { value: props.value });
    if (active && active.grayedOut) {
      this.onClickItem(find(props.values, (value) => {
        return value.grayedOut ? false : value;
      }));
    }
  }

  getIconClassName(active, disabled, editMode, grayedOut) {
    return classNames('radio-button__icon', {
      'radio-button__icon--checked-view': active && !disabled && !editMode,
      'radio-button__icon--unchecked-view': !active && !disabled && !editMode,
      'radio-button__icon--checked-disabled': active && disabled,
      'radio-button__icon--unchecked-disabled': !active && disabled,
      'radio-button__icon--checked': active && !disabled && editMode,
      'radio-button__icon--unchecked': !active && !disabled && editMode,
      'radio-button__icon--unchecked-grayed-out': grayedOut,
    });
  }

  onClickItem(item, e) {
    if (item) {
      const { onChange, validator, index } = this.props;
      if (validator) {
        validator.onChange(item.value, index, undefined, () => {
          if (onChange) {
            onChange(item.value, index);
          }
        });
      } else if (onChange) {
        onChange(item.value, index);
      }
    }
  }

  @autobind
  onKeyDown(e) {
    const { onTab, onShiftTab } = this.props;
    focusKeyDown(e, { onTab, onShiftTab, onEnter: this.nextItem });
  }

  @autobind
  nextItem() {
    const { value, values } = this.props;
    let index = 0;
    for (; index < values.length; ++index) {
      const item = values[index];
      if (item.value === value) {
        break;
      }
    }
    index++;
    if (index >= values.length) {
      index = 0;
    }
    this.onClickItem(values[index]);
  }

  getItems() {
    const { value, editMode, disabled, values, intl, twoColumnsWidth, verticalAligned, itemClassModifier } = this.props;

    return values.map(item => {
      const active = item.value === value;
      const grayedOut = item.grayedOut;
      const available = (editMode && !grayedOut && !disabled);

      return (
        <div
          key={ item.id }
          className={ classNames('radio-button__item',
            itemClassModifier,
            { 'radio-button__item--edit': editMode },
            { 'radio-button__item--active': active },
            { 'radio-button__item--two-columns-width': twoColumnsWidth },
            { 'radio-button__item--grayed-out': grayedOut },
            { 'radio-button__item--vertical': verticalAligned }) }
          onClick={ available ? this.onClickItem.bind(this, item) : null }
        >
          <div className={ this.getIconClassName(active, disabled, editMode, grayedOut) } />
          { item.intlId && <span>{ intl.formatMessage({ id: item.intlId }, item.intlValues) }</span> }
          { active && item.components && item.components.length > 0 &&
            <div className='radio-button__fields-container'>
              { item.components }
            </div>
          }
        </div>
      );
    });
  }

  render() {
    const { labelIntlId, labelIntlValues, intl, twoColumnsWidth, verticalAligned, labelClassModifier, editMode, validator, modifier, className } = this.props;

    return (
      <div className={ classNames('radio-button', { 'radio-button--two-columns-width': twoColumnsWidth }, modifier ? `radio-button--${ modifier }` : null) }>
        { labelIntlId &&
          <div className={ classNames('radio-button__label', labelClassModifier) }>
            { intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
          </div>
        }
        <div
          className={ classNames('radio-button__items', { 'radio-button__items--vertical': verticalAligned }, className) }
          tabIndex='0'
          onKeyDown={ editMode ? this.onKeyDown : null }
          ref={ validator && validator.onRef(this.props) }
        >
          { this.getItems() }
        </div>
      </div>
    );
  }
}

export default injectIntl(RadioButton);
