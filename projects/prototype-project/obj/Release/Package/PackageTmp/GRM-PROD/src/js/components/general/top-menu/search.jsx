import React, { Component } from 'react';
import './search.scss';

export default class Search extends Component {

  componentWillMount() {
    this.setState({
      placeholder: 'Type in to search',
    });
  }

  render() {
    return (
      <div className='search'>
        <input className='search__input' placeholder={ this.state.placeholder } />
        <div className='search__icon' />
      </div>
    );
  }
}
