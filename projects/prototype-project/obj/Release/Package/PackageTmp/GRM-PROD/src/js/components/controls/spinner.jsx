import React, { PureComponent } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import BrowserDetection from 'react-browser-detection';

import './spinner.scss';

const browserHandler = {
  ie: () => <circle className='spinner-loaderbox__ie-path' cx='25' cy='25' r='10' fill='none' />,
  default: () => <circle className='spinner-loaderbox__path' cx='25' cy='25' r='10' fill='none' />,
};

defineMessages({
  deleteAction: {
    id: 'spinner.action-delete',
    defaultMessage: 'Deleting...',
  },
  copyAction: {
    id: 'spinner.action-copy',
    defaultMessage: 'Copying...',
  },
  initializingAction: {
    id: 'spinner.action-initializing',
    defaultMessage: 'Initializing...',
  },
});

class Spinner extends PureComponent {

  static propTypes = {
    message: PropTypes.string,
  };

  render() {
    const { message } = this.props;
    return (
      <div className='spinner'>
        <div className='spinner_box spinner-loaderbox'>
          <div className='spinner-loaderbox__loader'>
            <svg className='spinner-loaderbox__circular'>
              <BrowserDetection>
                { browserHandler }
              </BrowserDetection>
            </svg>
          </div>
        </div>
        { message &&
          <div className='spinner__message'>
            <FormattedMessage id={ message } />
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(Spinner);
