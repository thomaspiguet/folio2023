import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './search-action.scss';

import Button from '../../../components/controls/button';

class SearchAction extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    have: PropTypes.bool,
    toggle: PropTypes.func,
    clear: PropTypes.func,
  };

  render() {
    const { have, show, toggle, clear } = this.props;
    const showClear = have && !show;
    return (
      <div className='search-action'>
        <Button
          classElementModifier={ (have || show) ?
            (showClear ? 'search-selected-with-clear' : 'search-selected')
            : 'search' }
          onClick={ toggle }
        />
        { showClear &&
        <Button
          classElementModifier='search-clear'
          onClick={ clear }
        />
        }
      </div>
    );

  }
}

export default injectIntl(SearchAction);
