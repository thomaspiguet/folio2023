import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TagsListItem from './tags-list-item';

export default class TagsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemCode: PropTypes.string,
    itemDescription: PropTypes.string,
    onItemClick: PropTypes.func.isRequired,
    onItemClose: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    itemCode: 'code',
    itemDescription: 'description',
  };

  render() {
    const listItems = this.props.items.map(item => (
      <TagsListItem
        key={ item.id || item[this.props.itemCode] }
        item={ item }
        itemCode={ this.props.itemCode }
        itemDescription={ this.props.itemDescription }
        onItemClick={ this.props.onItemClick }
        onItemClose={ this.props.onItemClose }
        singleItemSelected={ this.props.items.length === 1 }
      />
      )
    );

    return (
      <div className={ this.props.className }>
        { listItems }
      </div>
    );
  }
}
