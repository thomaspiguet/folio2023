import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Checkbox from '../../controls/checkbox';

export default class ColumnItems extends Component {
  static propTypes = {
    item: PropTypes.object,
    parentId: PropTypes.string,
    onChange: PropTypes.func,
  };

  @autobind
  onChange(value) {
    const { onChange, parentId, item: { id } } = this.props;
    if (onChange) {
      onChange(value, parentId, id);
    }
  }

  render() {
    const { item } = this.props;

    if (item.isLink) {
      return null;
    }

    return (
      <div className='customize-columns__sub-item'>
        <Checkbox
          labelIntlId={ item.intlId }
          labelIntlValues={ item.intlValues }
          label={ item.label }
          single={ true }
          editMode={ true }
          value={ item.visible }
          onToggle={ this.onChange }
          disabled={ item.grouped }
        />
      </div>
    );
  }
}
