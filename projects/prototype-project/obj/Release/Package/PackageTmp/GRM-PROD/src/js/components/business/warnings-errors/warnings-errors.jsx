import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { injectIntl, defineMessages } from 'react-intl';

import './warnings-errors.scss';

import RelativePortal from '../../general/relative-portal/relative-portal';

defineMessages({
  warning: {
    id: 'warning-errors.line-warning',
    defaultMessage: 'Warning:',
  },
  error: {
    id: 'warning-errors.line-error',
    defaultMessage: 'Error:',
  },
});

class WarningsErrors extends Component {
  static propTypes = {
    warnings: PropTypes.number,
    errors: PropTypes.number,
  };

  static defaultProps = {
    warnings: 0,
    errors: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      mouseHovered: false,
    };
  }

  @autobind
  onMouseOver(event) {
    this.setState({ mouseHovered: true });
  }

  @autobind
  onMouseOut(event) {
    this.setState({ mouseHovered: false });
  }

  render() {
    const { warnings, errors, intl } = this.props;
    const { mouseHovered } = this.state;
    const haveWarnings = warnings > 0;
    const haveErrors = errors > 0;
    const icon = haveErrors ? 'error' : (haveWarnings ? 'warning' : null);
    const warningMessage = intl.formatMessage({ id: 'warning-errors.line-warning' });
    const errorMessage = intl.formatMessage({ id: 'warning-errors.line-error' });
    return (
      <div
        className='warning-errors'
        onMouseOver={ this.onMouseOver }
        onMouseOut={ this.onMouseOut }
      >
        { icon && <div className={ `warning-errors__icon warning-errors__icon--${ icon }` } /> }
        { icon && mouseHovered && <RelativePortal top={ -40 } left={ -54 } onTop>
          <div className='warning-errors__box'>
            <div className='warning-errors__line'>
              <div className='warning-errors__message warning-errors__message--error'>
                { errorMessage }
              </div>
              <div className='warning-errors__value'>
                { errors }
              </div>
            </div>
            <div className='warning-errors__line'>
              <div className='warning-errors__message warning-errors__message--warning'>
                { warningMessage }
              </div>
              <div className='warning-errors__value'>
                { warnings }
              </div>
            </div>
            <div className='warning-errors__arrow' />
          </div>
        </RelativePortal> }
      </div>
    );
  }
}

export default injectIntl(WarningsErrors);
