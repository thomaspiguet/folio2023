import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { isEmpty } from 'lodash';

import ColumnItems from './column-items';
import Checkbox from '../../controls/checkbox';

export default class CustomizeColumnsGroup extends Component {
  static propTypes = {
    item: PropTypes.object,
    toggleExpandGroup: PropTypes.func,
    onChange: PropTypes.func,
    onGroupChange: PropTypes.func,
  };

  @autobind
  onDropDown(event) {
    this.props.toggleExpandGroup(this.props.item.id);
  }

  @autobind
  onGroupChange(value) {
    const { item, onGroupChange } = this.props;
    if (onGroupChange) {
      onGroupChange(value, item.id);
    }
  }

  render() {
    const { item } = this.props;

    return (
      <div className='customize-columns__group'>
        { this.renderColumnsGroup(item) }
        { this.renderColumnsGroupItems(item) }
      </div>
    );
  }

  renderColumnsGroup(item) {
    let groupChecked = false;
    let groupPartlyChecked = false;

    if (!isEmpty(item.columns)) {
      let columnCheckedCounter = 0;
      item.columns.forEach((column) => {
        if (column.visible) {
          columnCheckedCounter++;
        }
      });
      if (columnCheckedCounter === item.columns.length) {
        groupChecked = true;
      }
      if (columnCheckedCounter > 0 && columnCheckedCounter !== item.columns.length) {
        groupPartlyChecked = true;
      }
    }

    return (
      <div className='customize-columns__item' key={ item.id }>
        <Checkbox
          labelIntlId={ item.intlId }
          label={ item.label }
          single={ true }
          editMode={ true }
          value={ groupChecked }
          onToggle={ this.onGroupChange }
          styleModifier='checkbox--column-group'
          partlyChecked={ groupPartlyChecked }
        />
        { this.renderColumnGroupDropDown(item) }
      </div>
    );
  }

  renderColumnGroupDropDown(item) {
    if (!isEmpty(item.columns)) {
      const dropDownClassNames = classnames('customize-columns__dropdown', {
        'customize-columns__dropdown--expanded': item.expanded,
      });

      return (
        <div className='customize-columns__dropdown-wrapper' onClick={ this.onDropDown } >
          <div className={ dropDownClassNames } role='button' tabIndex='0' />
        </div>
      );
    }
    return null;
  }

  renderColumnsGroupItems(item) {
    if (!isEmpty(item.columns)) {
      return (
        <ColumnItems
          item={ item }
          onChange={ this.props.onChange }
        />
      );
    }
    return null;
  }
}
