import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { injectIntl, defineMessages } from 'react-intl';
import { isEmpty } from 'lodash';

import OptionsList from '../../controls/options-list';
import DropdownContainer from '../../controls/dropdown-container';
import TagsListItem from '../../controls/tags-list-item';
import './filter-dropdown.scss';

defineMessages({
  code: {
    id: 'dropdown.code-header',
    defaultMessage: 'Code',
  },
  description: {
    id: 'dropdown.description-header',
    defaultMessage: 'Description',
  },
  all: {
    id: 'dropdown-department.all',
    defaultMessage: 'All',
  },
  every: {
    id: 'dropdown-department.every',
    defaultMessage: 'All',
  },
  several: {
    id: 'dropdown-department.several',
    defaultMessage: 'Several',
  },
});

const NO_ITEMS_SELECTED = 0;
const ONE_ITEM_SELECTED = 1;
const ITEM_UNIQUE_ID = 'id';


class FilterDropdown extends Component {
  static propTypes = {
    placeholderIntlId: PropTypes.string,
    items: PropTypes.array,
    itemCode: PropTypes.string,
    itemDescription: PropTypes.string,
    selectedItems: PropTypes.array,
    onFilterItems: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onDeselectItem: PropTypes.func.isRequired,
    onClearSelectedItems: PropTypes.func.isRequired,
    sortDescending: PropTypes.bool,
    showDescriptionColumn: PropTypes.bool,
    selectedDepartment: PropTypes.string,
    enabled: PropTypes.bool,
  };

  static defaultProps = {
    itemCode: 'code',
    itemDescription: 'description',
    showDescriptionColumn: true,
    enabled: true,
  };

  state = {
    expanded: false,
    filterValue: '',
  };

  constructor(props) {
    super(props);
    this.dropdownBoxNode = null;
  }

  @autobind
  onToggle(e) {
    this.setExpanded(!this.state.expanded);
  }

  @autobind
  onClose() {
    this.setExpanded(false);
  }

  setExpanded(expanded) {
    this.setState({ expanded });
    if (!expanded) {
      this.setFilter('');
    }
  }

  @autobind
  handleClickOnDropDown(e) {
    const { dropdownBoxNode } = this;

    if (dropdownBoxNode && dropdownBoxNode.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  getValueTitle(value) {
    const { selectedDepartment, selectedItems, itemCode } = this.props;
    if (selectedItems.length === NO_ITEMS_SELECTED) {
      if (selectedDepartment === '' ||
        selectedDepartment === 'All' ||
        selectedDepartment === 'DIRECTION' ||
        selectedDepartment === 'SOUSDIRECTION' ||
        selectedDepartment === 'INSTALLATION' ||
        selectedDepartment === 'UNITEADMIN') {
        return this.props.intl.formatMessage({ id: 'dropdown-department.all' });
      }
      return this.props.intl.formatMessage({ id: 'dropdown-department.every' });
    }
    if (selectedItems.length === ONE_ITEM_SELECTED) {
      return selectedItems[0][itemCode];
    }
    return this.props.intl.formatMessage({ id: 'dropdown-department.several' });
  }

  // add selected option
  handleSelectOption = (option) => {
    const { selectedItems, onSelectItem } = this.props;

    if (!selectedItems.find(item => item.id === option.id)) {
      if (onSelectItem) {
        onSelectItem(option);
      }
      // clear input field after option is selected
      this.setFilter('');
    }
  };

  // remove selected option
  handleDeselectOption = (option) => {
    if (this.props.onDeselectItem) {
      this.props.onDeselectItem(option);
    }
  };

  @autobind
  setFilter(value) {
    this.setState({ filterValue: value }, () => {
      if (this.props.onFilterItems) {
        this.props.onFilterItems(value);
      }
    });
  }

  // filter options list with given keyword
  handleInputChange = (e) => {
    const value = e.target.value;
    if (value || value === '') {
      this.setFilter(value);
    }
  };

  // clear input text and selected options
  handleClearInput = () => {
    if (this.state.filterValue !== '' && this.state.filterValue !== null) {
      this.setFilter('');
    }
    if (this.props.onClearSelectedItems) {
      this.props.onClearSelectedItems();
    }
  };

  componentDidUpdate() {
    if (this.state.expanded && this.inputNode) {
      this.inputNode.focus();
    }
  }

  @autobind
  getDropdownNodes() {
    const { dropdownToogleNode, dropdownBoxNode } = this;
    return { dropdownToogleNode, dropdownBoxNode };
  }

  render() {
    if (!this.props.enabled) {
      return (
        <div className='filter-dropdown'>
          <div className='filter-dropdown__value--disabled'>
            { this.getValueTitle(this.state.value) }
          </div>
        </div>
      );
    }

    const noSelectedItems = isEmpty(this.props.selectedItems);
    const textInputNotEmpty = this.state.filterValue !== '' && this.state.filterValue !== null;
    const inputClassNames = classNames('filter-dropdown__hidden-input', {
      'filter-dropdown__hidden-input--no-selection': noSelectedItems,
    });

    const dropDownCloseBlock = !noSelectedItems || textInputNotEmpty ?
      <div className='filter-dropdown__close' onClick={ this.handleClearInput } /> : null;

    const { selectedItems, itemCode, itemDescription } = this.props;
    const tagListItems = Object.values(selectedItems).map((item) => item);

    const listItems = tagListItems.map(item => (
      <TagsListItem
        key={ item.id || item[itemCode] }
        item={ item }
        itemCode={ itemCode }
        itemDescription={ itemDescription }
        onItemClick={ this.handleClickOnTag }
        onItemClose={ this.handleDeselectOption }
        singleItemSelected={ tagListItems.length === 1 }
      />
      )
    );
    const { expanded } = this.state;
    return (
      <DropdownContainer getDropdownNodes={ this.getDropdownNodes } expanded={ expanded } onClose={ this.onClose }>
        <div className='filter-dropdown'>
          <div
            className='filter-dropdown__value'
            onClick={ this.onToggle }
            ref={ node => this.dropdownToogleNode = node }
          >
            <span>{ this.getValueTitle(this.state.value) }</span>
            <div
              className={ classNames('filter-dropdown__container', {
                'filter-dropdown__container--expanded': expanded,
              }) }
              ref={ node => this.dropdownBoxNode = node }
              onClick={ this.handleClickOnDropDown }
            >
              <div
                className='filter-dropdown__input'
              >
                <div className='styled-dropdown__input-with-tags'>
                  { listItems }
                  <input
                    type='text'
                    className={ inputClassNames }
                    placeholder={
                      noSelectedItems && this.props.placeholderIntlId
                      ? this.props.intl.formatMessage({ id: this.props.placeholderIntlId })
                      : null
                    }
                    minLength={ 0 }
                    size={ 1 }
                    ref={ node => this.inputNode = node }
                    value={ this.state.filterValue }
                    onChange={ this.handleInputChange }
                  />
                </div>
                { dropDownCloseBlock }
              </div>
              { this.renderOptions(noSelectedItems) }
            </div>
          </div>
        </div>
      </DropdownContainer>
    );
  }

  renderOptions(noSelectedItems) {
    const options = this.props.items;
    if (this.state.expanded && options) {
      return (
        <div
          className='filter-dropdown__options'
          // ref={ node => this.optionsNode = node }
        >
          <div className='filter-options-header'>
            <div className='filter-options-header__code'>
              { this.props.intl.formatMessage({ id: 'dropdown.code-header' }) }
            </div>
            { this.renderDescription() }
          </div>
          <OptionsList
            items={ options }
            itemCode={ this.props.itemCode }
            itemDescription={ this.props.itemDescription }
            uniqueId={ ITEM_UNIQUE_ID }
            selectedItems={ this.props.selectedItems }
            onItemClick={ this.handleSelectOption }
            showDescriptionColumn={ this.props.showDescriptionColumn }
            styleModifier='filter-dropdown-option'
          />
        </div>
      );
    }
    return null;
  }

  renderDescription() {
    if (this.props.showDescriptionColumn) {
      return (
        <div className='filter-options-header__description'>
          { this.props.intl.formatMessage({ id: 'dropdown.description-header' }) }
        </div>
      );
    }
    return null;
  }

}

export default injectIntl(FilterDropdown);
