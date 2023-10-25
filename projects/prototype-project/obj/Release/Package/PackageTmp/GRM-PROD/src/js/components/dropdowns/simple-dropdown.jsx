import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { injectIntl } from 'react-intl';

import Field from '../../components/controls/field';
import Dropdown from '../controls/dropdown';
import CustomTooltip from '../general/custom-tooltip/custom-tooltip';
import RelativePortal from '../general/relative-portal/relative-portal';

import { defaultValidator } from '../../utils/components/form-validator';

class SimpleDropdown extends Component {
  static defaultProps = {
    validator: defaultValidator,
    itemValue: 'shortDescription',
  };

  static propTypes = {
    validator: PropTypes.object.isRequired,
    entities: PropTypes.array,
    isLoading: PropTypes.bool,
    getEntities: PropTypes.func.isRequired,
    value: PropTypes.object,
    parameters: PropTypes.object,
    editMode: PropTypes.bool.isRequired,
    labelIntlId: PropTypes.string,
    placeholderIntlId: PropTypes.string.isRequired,
    itemValue: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      expanded: false,
      mouseHovered: false,
    };

    this.fieldCenter = 0;
  }

  componentDidMount() {
    this.init(this.props);

    if (this.node) {
      this.fieldCenter = this.node.getBoundingClientRect().width / 2;
    }
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { editMode } = props;
    if (!editMode) {
      return;
    }

    const { value, getEntities, entities, parameters, entitiesParameters, isLoading, validator: { metadata } } = props;
    if (metadata.endpoints && (!entities || !isEqual(parameters, entitiesParameters)) && !isLoading) {
      getEntities(metadata, parameters);
      return;
    }

    this.setState({ value });
  }

  @autobind
  onSelectItem(title, value, oldValue) {
    const { validator, onChange, index } = this.props;
    if (validator) {
      validator.onChange(value, index, undefined, () => {
        if (onChange) {
          onChange(value, index, oldValue);
        }
      });
    } else if (onChange) {
      onChange(value, index, oldValue);
    }
    if (this.dropdownNode) {
      this.dropdownNode.focus();
    }
  }

  @autobind
  onClear(oldValue) {
    const { validator, onChange, index } = this.props;
    if (validator) {
      validator.onClear(index, undefined, () => {
        if (onChange) {
          onChange(undefined, index, oldValue);
        }
      });
    } else if (onChange) {
      onChange(undefined, index, oldValue);
    }
    if (this.dropdownNode) {
      this.dropdownNode.focus();
    }
  }

  @autobind
  onSetExpanded(expanded) {
    this.setState({ expanded });
    if (!expanded && this.dropdownNode) {
      this.dropdownNode.focus();
    }
  }

  setDropdownExpanded(e, expanded) {
    e.preventDefault();
    e.stopPropagation();
    if (this.dropdown) {
      this.dropdown.getWrappedInstance().setExpanded(expanded, true);
    }
  }

  @autobind
  onKeyDown(e) {
    const { type, key } = e;
    const { expanded } = this.state;
    if (type === 'keydown') {
      if (expanded) {
        if (key === 'Escape') {
          this.setDropdownExpanded(e, false);
        }
      } else if (key === 'ArrowDown' || key === 'Enter') {
        this.setDropdownExpanded(e, true);
      }
    }
  }

  @autobind
  onMouseOver(e) {
    this.setState({ mouseHovered: true });
  }

  @autobind
  onMouseOut(e) {
    this.setState({ mouseHovered: false });
  }

  renderError(error) {
    const { isDataGridField } = this.props;
    const { mouseHovered } = this.state;

    const errorClassName = classNames(
      { 'field__error': !isDataGridField },
      { 'field__error-tooltip': isDataGridField }
    );

    if (error) {
      return (
        isDataGridField
          ? (mouseHovered && <RelativePortal top={ 0 } left={ 0 }><CustomTooltip errorClassName={ errorClassName } error={ error } isDataGridField={ isDataGridField } fieldCenter={ this.fieldCenter } /></RelativePortal>)
          : <div className={ errorClassName } aria-label={ error } > { error } </div>
      );
    }

    return null;
  }

  render() {
    const { editMode, validator: { getMandatory, getError },
      labelIntlId, placeholderIntlId, labelIntlValues, entities,
      itemValue, intl, hideTitle, index, isDataGridField, disabled } = this.props;

    if (!editMode || disabled) {
      const { value, itemValue } = this.props;
      return (
        <Field value={ value[itemValue] } labelIntlId={ labelIntlId } disabled={ disabled } />
      );
    }
    const { value, expanded } = this.state;
    const error = (isDataGridField ? getError(index) : getError());
    const mandatory = getMandatory();

    return (
      <div className={ classNames('field', { 'field--expanded': expanded }) } ref={ (node) => { this.node = node; } }>
        { labelIntlId && <div
          className={ classNames('field__label', {
            'field__label--mandatory': editMode && mandatory,
            'field__label--error': error,
          }) }
        >
          {intl.formatMessage({ id: labelIntlId }, labelIntlValues)}
        </div>
        }
        <div
          className={ classNames('field__dropdown', {
            'field__dropdown--mandatory': mandatory,
            'field__dropdown--error': error,
            'field__dropdown--expanded': expanded,
          }) }
          tabIndex='0'
          ref={ (node) => { this.dropdownNode = node; } }
          onKeyDown={ this.onKeyDown }
          onMouseOver={ !expanded ? this.onMouseOver : null }
          onMouseOut={ this.onMouseOut }
        >
          <Dropdown
            ref={ (node) => { this.dropdown = node; } }
            labelIntlId={ labelIntlId }
            hideTitle={ hideTitle }
            placeholderIntlId={ placeholderIntlId }
            values={ entities }
            value={ value }
            itemValue={ itemValue }
            onChange={ this.onSelectItem }
            onSetExpanded={ this.onSetExpanded }
            classNames='dropdown--field'
            valueClass='dropdown__value--field'
            addSelectValue={ !mandatory }
            onClear={ this.onClear }
            wide
          />
        </div>
        { this.renderError(error) }
      </div>
    );
  }
}

export default injectIntl(SimpleDropdown);
