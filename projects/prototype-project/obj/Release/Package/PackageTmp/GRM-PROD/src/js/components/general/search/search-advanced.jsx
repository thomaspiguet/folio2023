import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './search-advanced.scss';

import Form from '../../general/form/form';

export default class SearchAdvanced extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    shiftedActions: PropTypes.bool,
    apply: PropTypes.func,
    clear: PropTypes.func,
    children: PropTypes.node,
  };

  render() {
    const { show, clear, apply, children, shiftedActions: shifted } = this.props;
    if (!show) {
      return null;
    }
    return (
      <div className='search-advanced'>
        <div className='search-advanced__content' >
          { children }
        </div>
        <Form.Actions>
          <Form.FooterActions { ...{ shifted } }>
            <Form.Action type='clear' intlId='action.clear' onClick={ clear } />
            <Form.Action type='search' intlId='action.search' onClick={ apply } isLast />
          </Form.FooterActions>
        </Form.Actions>
      </div>
    );
  }
}
