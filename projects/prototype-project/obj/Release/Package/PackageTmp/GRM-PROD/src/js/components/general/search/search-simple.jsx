import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Field from '../../controls/field';

import './search-simple.scss';

class SearchSimple extends Component {
  static propTypes = {
    keyWord: PropTypes.string,
    placeholderIntlId: PropTypes.string,
    search: PropTypes.func,
  };

  state = {
    keyWord: this.props.keyWord,
  };

  handleInputChange = (value) => {
    this.setState({ keyWord: value }, () => {
      this.props.search(this.state.keyWord);
    });
  };

  handleClearInput = () => {
    this.setState({ keyWord: '' });
  };

  render() {
    const { placeholderIntlId } = this.props;
    const textInputNotEmpty = this.state.keyWord !== '' && this.state.keyWord !== null;
    const clearInputBlock = textInputNotEmpty ?
      <div className='search-simple__clear' onClick={ this.handleClearInput } /> : null;

    return (
      <div className='search-simple'>
        <Field.Input
          editMode
          hideTitle
          className='search-simple__field'
          placeholderIntlId={ placeholderIntlId }
          value={ this.state.keyWord }
          onChange={ this.handleInputChange }
        />
        { clearInputBlock }
      </div>
    );
  }
}

export default injectIntl(SearchSimple);
