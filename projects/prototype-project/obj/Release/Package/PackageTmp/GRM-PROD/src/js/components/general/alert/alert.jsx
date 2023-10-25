import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { alertClose } from './actions';

import './alert.scss';

@connect(state => ({
  message: state.alert.message,
  show: state.alert.show,
  type: state.alert.type,
  values: state.alert.values,
}), (dispatch) => bindActionCreators({
  alertClose,
}, dispatch))
class Alert extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool,
    message: PropTypes.string,
    values: PropTypes.object,
  };

  static defaultProps = {
    show: false,
  };

  @autobind
  onClose() {
    const { alertClose } = this.props;
    alertClose();
  }

  render() {
    const { type, show, message, values } = this.props;

    return (
      <div className={ classNames('alert', { 'alert--show': show }, `alert--${ type }`) }>
        <div className='alert__column-left'>
          <div className={ `alert__icon--${ type }` } />
        </div>
        { message &&
          <div className='alert__column-center'>
            <FormattedMessage id={ message } values={ values } />
          </div>
        }
        <div className='alert__column-right'>
          <div className='alert__close-button' onClick={ this.onClose } />
        </div>
      </div>
    );
  }
}

export default injectIntl(Alert);
