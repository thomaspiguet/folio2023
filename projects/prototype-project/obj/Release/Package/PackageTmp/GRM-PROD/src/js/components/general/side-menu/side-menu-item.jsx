import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

import SubItems from './sub-items';

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object,
    selected: PropTypes.string,
    selectedSubItem: PropTypes.string,
    select: PropTypes.func,
    toggleExpand: PropTypes.func,
    menuExpanded: PropTypes.bool,
    scenarioId: PropTypes.number,
  };

  @autobind
  onSelect() {
    this.props.select(this.props.item.id);
  }

  @autobind
  onDropDown(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.toggleExpand(this.props.item.id);
  }

  isSelected() {
    if (this.props.menuExpanded) {
      return this.props.selected === this.props.item.id && !this.props.selectedSubItem;
    }
    return this.props.selected === this.props.item.id;
  }

  defineMatIc() {
    const { item } = this.props;
    switch (item.icon) {
      case "employees": return "assignment_ind";
      case "salaries": return "credit_card";
      case "scenarios": return "update";
      case "revenue": return "attach_money";
      case "report": return "timeline";
      case "reference": return "insert_drive_file";
      default: return item.icon;
    }
  }

  render() {
    const { item, scenarioId } = this.props;
    const classNames = classnames('side-menu__item', {
      'side-menu__item--selected': this.isSelected(),
    });
    const linkClassNames = classnames(
      'side-menu__link',
      `side-menu__link--${item.icon}`
    );
    const material_ic = this.defineMatIc();

    return (
      <div className='side-menu__bucket'>
        <div className={classNames} key={item.id}>
          {item.notLink ?
            <div className={linkClassNames} >
              <i className="material-icons small-btn-icons">{material_ic}</i>
              {this.renderItemName(item)}
              {this.renderItemDropDown(item)}
            </div>
            :
            <Link className={linkClassNames} to={`/${scenarioId}/${item.id}`} onClick={this.onSelect}>
              <i className="material-icons small-btn-icons">{material_ic}</i>
              {this.renderItemName(item)}
              {this.renderItemDropDown(item)}
            </Link>
          }
        </div>
        {this.renderItemSubItems(item)}
      </div>
    );
  }

  renderItemName(item) {
    const itemNameClassNames = classnames('side-menu__name', {
      'side-menu__name--hidden': !this.props.menuExpanded,
    });

    return (
      <div className={itemNameClassNames} onClick={item.notLink ? this.onDropDown : null} >
        <FormattedMessage id={`side-menu.${item.id}`} />
      </div>
    );
  }

  renderItemDropDown(item) {
    if (!isEmpty(item.items)) {
      const dropDownClassNames = classnames('side-menu__dropdown', {
        'side-menu__dropdown--expanded': this.props.item.expanded,
        'side-menu__dropdown--hidden': !this.props.menuExpanded,
      });

      return (
        <div className={dropDownClassNames} role='button' tabIndex='0' onClick={this.onDropDown} />
      );
    }
    return null;
  }

  renderItemSubItems(item) {
    if (!isEmpty(item.items)) {
      return (
        <SubItems
          item={item}
          selected={this.props.selected}
          selectedSubItem={this.props.selectedSubItem}
          select={this.props.select}
          menuExpanded={this.props.menuExpanded}
          scenarioId={this.props.scenarioId}
        />
      );
    }
    return null;
  }
}
