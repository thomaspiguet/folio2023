import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './search-input.scss';

@connect(state => ({
  locale: state.app.locale,
}),
(dispatch) => bindActionCreators({
}, dispatch))
class SearchInput extends Component {
  static propTypes = {
    placeholderIntlId: PropTypes.string,
    inputStyleModificator: PropTypes.string,
    onChangeKeyWord: PropTypes.func.isRequired,
    onClearKeyWord: PropTypes.func.isRequired,
    keyWord: PropTypes.string,
    locale: PropTypes.string,
  };

  static defaultProps = {
    inputStyleModificator: '',
  };

  state = {
    active: false,
    keyWord: this.props.keyWord,
  };

  handleInputChange = (e) => {
    if (e.target.value || e.target.value === '') {
      this.setState({ keyWord: e.target.value });

      if (this.props.onChangeKeyWord) {
        this.props.onChangeKeyWord(e.target.value);
      }
    }
  };

  handleClearInput = () => {
    if (this.state.keyWord !== '' && this.state.keyWord !== null) {
      this.setState({ keyWord: '' });
    }
    if (this.props.onClearKeyWord) {
      this.props.onClearKeyWord();
    }
  };

  handleInputBlur = () => {
    this.setState({ active: false });
  };

  handleInputFocus = () => {
    this.setState({ active: true });
  };

  render() {
    const { locale, placeholderIntlId, inputStyleModificator } = this.props;

    const textInputNotEmpty = this.state.keyWord !== '' && this.state.keyWord !== null;
    const bottomBorderBlock = this.state.active || textInputNotEmpty ?
      <div className='search-keyword__bottom-line' /> : null;
    const clearInputBlock = textInputNotEmpty ?
      <div className='search-keyword__close' onClick={ this.handleClearInput } /> : null;

    const inputClassNames = classNames(
      'search-keyword__input',
      `search-keyword__input--${ locale }${ inputStyleModificator }`,
      { 'search-keyword__input--active': this.state.active || textInputNotEmpty });

    return (
      <div className='search-keyword'>
        <div className='search-keyword__icon' />
        <input
          type='text'
          tabIndex={ 0 }
          className={ inputClassNames }
          placeholder={ !textInputNotEmpty ? this.props.intl.formatMessage({ id: placeholderIntlId }) : null }
          value={ this.state.keyWord }
          onChange={ this.handleInputChange }
          onBlur={ this.handleInputBlur }
          onFocus={ this.handleInputFocus }
        />
        { clearInputBlock }
        { bottomBorderBlock }
      </div>
    );
  }

}

export default injectIntl(SearchInput);
