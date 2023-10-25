import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import PopupDialog from './popup-dialog';
import Spinner from '../../controls/spinner';
import { PopupType } from './constants';
import { popupAction, popupClose } from './actions';

import './popup.scss';

@connect(state => ({
  options: state.popup.options,
  show: state.popup.show,
  type: state.popup.type,
}), (dispatch) => bindActionCreators({
  popupAction,
  popupClose,
}, dispatch))
class Popup extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: false,
  };
  renderPopupContent() {
    const { type, options, popupAction, popupClose } = this.props;

    return (
      <div className='popup__box__content'>
        {{
          [PopupType.dialog]: (
            <PopupDialog options={ options } popupAction={ popupAction } popupClose={ popupClose } />
          ),
          [PopupType.spinner]: (
            <Spinner message={ options.message } />
          ),
        }[type || PopupType.dialog]}
      </div>
    );
  }
  render() {
    const { show } = this.props;

    return (
      <div className={ classNames('popup', { 'popup--show': show }) }>
        <div className={ classNames('popup__box', { 'popup__box--show': show }) }>
          { this.renderPopupContent() }
        </div>
      </div>
    );
  }
}

export default injectIntl(Popup);
