import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import TrackablePage from '../trackable-page/trackable-page';

import './access-denied.scss';

class AccessDenied extends TrackablePage {
  render() {
    const { message } = this.props;

    return (
      <div className='access-denied'>

        <div className='access-denied__icon-box'>
          <div className='access-denied__icon' />
        </div>

        <div className='access-denied__title'>
          <FormattedMessage id='access-denied.title' defaultMessage='Access denied' />
        </div>

        <div className='access-denied__message'>
          { message || <FormattedMessage id='access-denied.message' defaultMessage='You do not have access to this application.' /> }
        </div>

      </div>
    );
  }
}

export default injectIntl(AccessDenied);
