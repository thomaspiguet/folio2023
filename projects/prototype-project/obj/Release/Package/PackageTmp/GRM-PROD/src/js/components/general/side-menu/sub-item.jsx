import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default class SubItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    selected: PropTypes.string,
    selectedSubItem: PropTypes.string,
    select: PropTypes.func,
    parentId: PropTypes.string,
    menuExpanded: PropTypes.bool,
    scenarioId: PropTypes.number,
  };

  @autobind
  onSelect() {
    this.props.select(this.props.parentId, this.props.item.id);
  }

  isSelected() {
    return this.props.selectedSubItem === this.props.item.id
      && this.props.selected === this.props.parentId;
  }

  render() {
    const { item, menuExpanded, parentId, scenarioId } = this.props;
    const className = classnames('side-menu__subitem', {
      'side-menu__subitem--selected': this.isSelected(),
      'side-menu__subitem--hidden': !menuExpanded,
    });

    return (
      <div className={ className } >
        <Link className='side-menu__sublink' to={ `/${ scenarioId }/${ parentId }/${ item.id }` } onClick={ this.onSelect }>
          { item.intlId && <FormattedMessage id={ item.intlId } values={ item.intlValues } /> }
          { item.name && item.name }
        </Link>
      </div>
    );
  }
}
