import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import './data-grid-no-data.scss';

class NoData extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.any,
    hideLoader: PropTypes.bool,
    customMessageIntlId: PropTypes.string,
  };

  renderNoDataText(customMessageIntlId) {
    if (customMessageIntlId) {
      return this.props.intl.formatMessage({ id: customMessageIntlId });
    }
    return (<FormattedMessage id='data-grid.no-data' defaultMessage='No results. Please enter fields above' />);
  }

  render() {
    const { customMessageIntlId, isLoading } = this.props;

    if (!isLoading) {
      return (
        <div className='data-grid-no-data'>
          <div className='data-grid-no-data__box'>
            <div className='data-grid-no-data__text'>
              { this.renderNoDataText(customMessageIntlId) }
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default injectIntl(NoData);
