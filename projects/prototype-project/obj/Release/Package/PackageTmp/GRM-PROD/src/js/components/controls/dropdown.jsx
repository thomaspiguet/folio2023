import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isArray, isEqual, isObject, isUndefined, each, eachRight, keys } from 'lodash';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl } from 'react-intl';

import { ScrollBox } from '../general/scroll-box';
import DropdownContainer from './dropdown-container';
import { DropDownOption } from './dropdown-option';
import { isEmptyObject, isFunction } from '../../utils/utils';

import './dropdown.scss';
import './scroll-box.less';

const MIN_HEIGHT = 210;
const DEFAULT_OPTIONS_LIST_HORIZONTAL_SHIFT = 0;
const DEFAULT_SIMPLE_DROP_DOWN_OPTIONS_LIST_VERTICAL_SHIFT = 5;

defineMessages({
  all: {
    id: 'dropdown-department.all',
    defaultMessage: 'All',
  },
  several: {
    id: 'dropdown-department.several',
    defaultMessage: 'Several',
  },
  direction: {
    id: 'dropdown-department.DIRECTION',
    defaultMessage: 'Department',
  },
  sousdirection: {
    id: 'dropdown-department.SOUSDIRECTION',
    defaultMessage: 'Sub-department',
  },
  programmefinance: {
    id: 'dropdown-department.PROGRAMMEFINANCE',
    defaultMessage: 'Program',
  },
  sousprogrammefinance: {
    id: 'dropdown-department.SOUSPROGRAMMEFINANCE',
    defaultMessage: 'Sub-program',
  },
  centreactivitefinance: {
    id: 'dropdown-department.CENTREACTIVITEFINANCE',
    defaultMessage: 'Responsibility center level 1',
  },
  souscentreactivitefinance: {
    id: 'dropdown-department.SOUSCENTREACTIVITEFINANCE',
    defaultMessage: 'Responsibility center level 2',
  },
  soussouscentreactivite: {
    id: 'dropdown-department.SOUSSOUSCENTREACTIVITE',
    defaultMessage: 'Responsibility center level 3',
  },
  installation: {
    id: 'dropdown-department.INSTALLATION',
    defaultMessage: 'Site',
  },
  groupecodeprimaire: {
    id: 'dropdown-department.GROUPECODEPRIMAIRE',
    defaultMessage: 'Primary codes group',
  },
  uniteadmin: {
    id: 'dropdown-department.UNITEADMIN',
    defaultMessage: 'Functional center',
  },
});

class Dropdown extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNameModifier: PropTypes.string,
    optionClass: PropTypes.string,
    optionsClass: PropTypes.string,
    scrollViewWidth: PropTypes.number,
    labelClass: PropTypes.string,
    valueClass: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    disabled: PropTypes.bool,
    disabledScrollBox: PropTypes.bool,
    hideTitle: PropTypes.bool,
    hideValue: PropTypes.bool,
    showIcon: PropTypes.bool,
    showUpward: PropTypes.bool,
    sortDescending: PropTypes.bool,
    itemValue: PropTypes.string,
    placeholderIntlId: PropTypes.string,
    addSelectValue: PropTypes.bool,
    pageSize: PropTypes.number,
    values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    renderOptions: PropTypes.func,
    optionsListVerticalShift: PropTypes.number,
    optionsListHorizontalShift: PropTypes.number,
  };

  static defaultProps = {
    height: '210px',
    itemValue: 'code',
    pageSize: 6,
    placeholderIntlId: 'dropdown-department.all',
    addSelectValue: false,
    disabledScrollBox: false,
    showIcon: false,
    optionClass: 'dropdown__option',
    optionsClass: 'dropdown__options',
    optionsListVerticalShift: DEFAULT_SIMPLE_DROP_DOWN_OPTIONS_LIST_VERTICAL_SHIFT,
    optionsListHorizontalShift: DEFAULT_OPTIONS_LIST_HORIZONTAL_SHIFT,
  };

  @autobind
  onChange(value, opt, oldValue) {
    this.props.onChange(value, opt, oldValue);
    this.setExpanded(false);
  }

  @autobind
  setItem(index) {
    const { values, addSelectValue, sortDescending } = this.props;
    let optIndex = 0;
    let newOpt = null;
    const maxIndex = keys(values).length + (addSelectValue ? 1 : 0);
    if (index > maxIndex) {
      index = maxIndex - 1;
    }
    if (index < 0) {
      index = 0;
    }
    if (addSelectValue) {
      if (index === 0) {
        newOpt = this.defaultOption;
        this.setState({ currentOpt: newOpt });
        return;
      }
      optIndex++;
    }
    const doEach = sortDescending ? eachRight : each;
    doEach(values, (opt, value) => {
      if (index === optIndex) {
        newOpt = opt;
      }
      ++optIndex;
    });
    if (newOpt) {
      this.setState({ currentOpt: newOpt });
    }
  }

  @autobind
  onClose() {
    this.setExpanded(false);
  }

  @autobind
  onClear(value, opt, oldValue) {
    this.props.onClear(oldValue);
    this.setExpanded(false);
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      expanded: false,
    };
    this.defaultOption = {};
  }

  componentDidMount() {
    this.init(this.props);
    this.setItem(0);
    window.addEventListener('resize', this.onClose);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onClose);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const value = isFunction(props.value) ? props.value() : props.value;
    this.setState({ value });
  }

  getValueTitle(value) {
    const { values, intl, itemValue, placeholderIntlId, addSelectValue } = this.props;
    if (value === '' || value === undefined || isEmptyObject(value)) {
      if (placeholderIntlId && addSelectValue) {
        return intl.formatMessage({ id: placeholderIntlId });
      }
      return this.props.intl.formatMessage({ id: 'dropdown-department.every' });
    }
    if (isArray(values)) {
      const val = values.find(val => (itemValue ? (val[itemValue] === value) : (val === value)));
      if (val) {
        if (val.intlId) {
          return intl.formatMessage({ id: val.intlId });
        } else if (val.title) {
          return val.title;
        }
      }
    }
    let opt = (values === undefined) ? value : values[value];
    if (!opt) {
      opt = value;
    }
    if (opt.intlId) {
      return intl.formatMessage({ id: opt.intlId });
    }
    if (opt.title) {
      return opt.title;
    }
    if (itemValue && !isUndefined(opt[itemValue])) {
      return opt[itemValue];
    }
    if (opt.code) {
      return opt.code;
    }
    if (opt.value) {
      return opt.value;
    }
    return isObject(opt) ? '' : opt;
  }

  @autobind
  onToggle(e) {
    this.setExpanded(!this.state.expanded);
  }

  @autobind
  setExpanded(expanded) {
    this.setState({ expanded });
    if (this.props.onSetExpanded) {
      this.props.onSetExpanded(expanded);
    }
  }

  @autobind
  getDropdownNodes() {
    const { dropdownToogleNode, dropdownBoxNode } = this;
    return { dropdownToogleNode, dropdownBoxNode };
  }

  componentDidUpdate() {
    const { optionsListVerticalShift, optionsListHorizontalShift } = this.props;
    if (this.popupNode && this.dropdownBoxNode && this.state.expanded) {
      const { bottom, top, width: popupWidth } = this.popupNode.getBoundingClientRect();
      const { height: viewHeight } = document.body.getBoundingClientRect();
      const { width: optionsWidth, height: optionsHeight } = this.optionsNode.getBoundingClientRect();
      const dropdownHeight = Math.min(optionsHeight, MIN_HEIGHT);
      const dropdownWidth = Math.max(optionsWidth, popupWidth);
      const node = this.dropdownBoxNode;
      node.style.position = 'fixed';
      if (bottom < (viewHeight - dropdownHeight)) {
        node.style.top = `${ bottom + optionsListVerticalShift }px`;
        node.style.bottom = `${ viewHeight - (bottom + optionsListVerticalShift) - dropdownHeight }px`;
      } else {
        node.style.top = `${ (top - optionsListVerticalShift) - dropdownHeight }px`;
        node.style.bottom = `${ viewHeight - (top - optionsListVerticalShift) }px`;
      }
      // load width and right values after set top and and bottom,
      // because the values can be changed
      const { width: viewWidth } = document.body.getBoundingClientRect();
      const { right } = this.popupNode.getBoundingClientRect();
      node.style.right = `${ viewWidth - right + optionsListHorizontalShift }px`;
      node.style.left = `${ right + optionsListHorizontalShift - dropdownWidth }px`;
    }
  }

  isSelected(opt, value) {
    return (String(value) === String(this.state.value)) || (!isUndefined(opt.code) && isEqual(opt.code, this.state.value));
  }

  isSelectedArray(opt) {
    const { value } = this.state;
    if (isUndefined(opt.value)) {
      return false;
    }
    return opt.value === value;
  }

  renderDropDownOptions() {
    const { value: currentValue, currentOpt } = this.state;
    const { values, addSelectValue, intl, placeholderIntlId, optionClass, pageSize, sortDescending } = this.props;

    const isValuesArray = isArray(values);
    let optIndex = 0;
    const options = [];

    if (addSelectValue) {
      const selectValue = intl.formatMessage({ id: placeholderIntlId });
      const option = (
        <DropDownOption
          selected={false}
          className={optionClass}
          value={selectValue}
          index={optIndex}
          title={selectValue}
          key={selectValue}
          opt={this.defaultOption}
          setItem={this.setItem}
          exit={this.onClose}
          currentValue={currentValue}
          currentOpt={currentOpt}
          onChange={this.onClear}
          pageSize={pageSize}
        />
      );

      options.push(option);
      optIndex++;
    }

    const doEach = sortDescending ? eachRight : each;

    doEach(values, (opt, value) => {
      const selected = isValuesArray ? this.isSelectedArray(opt) : this.isSelected(opt, value);
      const option = (
        <DropDownOption
          selected={selected}
          className={optionClass}
          value={value}
          index={optIndex}
          title={this.getValueTitle(value)}
          key={value}
          opt={opt}
          setItem={this.setItem}
          exit={this.onClose}
          currentValue={currentValue}
          currentOpt={currentOpt}
          onChange={this.onChange}
          pageSize={pageSize}
        />
      );
      options.push(option);
      ++optIndex;
    });

    return options;
  }

  renderDropDownBox() {
    const { height, disabledScrollBox, renderOptions, optionsClass } = this.props;

    let options = [];
    if (isFunction(renderOptions)) {
      options = renderOptions(this.props, this.state);
    } else {
      options = this.renderDropDownOptions();
    }

    if (disabledScrollBox) {
      return (
        <div className={optionsClass} ref={(node) => { this.optionsNode = node; }}>
          {options}
        </div>
      );
    }
    return (
      <ScrollBox style={{ height }}>
        <div className={optionsClass} ref={(node) => { this.optionsNode = node; }}>
          {options}
        </div>
      </ScrollBox>
    );
  }

  defineMaterialIcon() {
    const { valueClass, disabled } = this.props;
    const { expanded } = this.state;

    if (valueClass === 'routes-dropdown__ellipsis')
      if (disabled)
        return (<i className='material-icons small-btn-icons-ellipsis-disabled'>more_vert</i>);
      else if (expanded)
        return (<i className='material-icons small-btn-icons-ellipsis-expanded'>more_vert</i>);
      else
        return (<i className='material-icons small-btn-icons-ellipsis'>more_vert</i>);
    else
      return null;
  }

  render() {
    const { hideTitle, disabled, showUpward, hideValue, valueClass } = this.props;
    const { expanded } = this.state;

    const dropDownToggleNodeClassName = classNames(valueClass, {
      [`${valueClass}--expanded`]: valueClass && expanded,
      [`${valueClass}--disabled`]: valueClass && disabled,
      'dropdown__value': !hideValue,
      'dropdown__value--placeholder-shown': isEmptyObject(this.state.value) && !hideValue,
    });

    // TODO: move class to props and give it default value
    const popupNodeClassName = classNames('dropdown__select', {
      'dropdown__select--expanded': expanded,
      'dropdown__select--upward': showUpward,
    });

    const dropDownBoxNodeClassName = classNames('dropdown__box', this.props.classNameModifier);

    let materialIcon = this.defineMaterialIcon();

    return (
      <DropdownContainer getDropdownNodes={this.getDropdownNodes} expanded={expanded} onClose={this.onClose}>
        <div className={classNames('dropdown', this.props.classNames, { 'dropdown--disabled': disabled })}>
          {!hideTitle &&
            <div className={classNames('dropdown__label', this.props.labelClass)}>
              {this.props.label}
            </div>
          }
          <div
            className={dropDownToggleNodeClassName}
            onClick={disabled ? null : this.onToggle}
            ref={(node) => { this.dropdownToogleNode = node; }}
          >
            {!hideValue && <span>{this.getValueTitle(this.state.value)}</span>}
            {!disabled &&
              <div className={popupNodeClassName} ref={(node) => { this.popupNode = node; }}>
                {expanded &&
                  <div className={dropDownBoxNodeClassName} ref={(node) => { this.dropdownBoxNode = node; }}>
                    {this.renderDropDownBox()}
                  </div>
                }
              </div>
            }
            {materialIcon}
          </div>
        </div>
      </DropdownContainer>
    );
  }
}

export default injectIntl(Dropdown, { withRef: true });
