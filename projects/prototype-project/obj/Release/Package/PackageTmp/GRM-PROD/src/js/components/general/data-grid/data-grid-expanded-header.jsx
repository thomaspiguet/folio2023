import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import './data-grid-header.scss';

export default class DataGridExpandedHeader extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onChangeExpanded: PropTypes.func,
    column: PropTypes.object,
  };

  render() {
    const { expanded, groups } = this.props;
    return (
      <div className='data-grid-header'>
        <div
          className={ classNames('data-grid-header__icon', {
            'data-grid-header__icon--collapse': expanded,
            'data-grid-header__icon--expand': !expanded,
            'data-grid-header__icon--hidden': groups && groups.length,
          }) }
          onClick={ this.props.onChangeExpanded }
        />
        {
          this.props.column ? <div className='data-grid-header__title'>
            { this.props.column.intlId &&
              <FormattedMessage id={ this.props.column.intlId } values={ this.props.column.intlValues } />
            }
          </div> : null
        }
      </div>
    );
  }
}
