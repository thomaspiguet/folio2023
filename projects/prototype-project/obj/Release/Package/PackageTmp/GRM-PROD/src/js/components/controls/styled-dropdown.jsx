import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { isEmpty, orderBy } from 'lodash';

import DropdownContainer from './dropdown-container';
import OptionsList from './options-list';
import TagsListItem from './tags-list-item';
import RelativePortal from '../general/relative-portal/relative-portal';
import CustomTooltip from '../general/custom-tooltip/custom-tooltip';
import './styled-dropdown.scss';

defineMessages({
  code: {
    id: 'dropdown.code-header',
    defaultMessage: 'Code',
  },
  description: {
    id: 'dropdown.description-header',
    defaultMessage: 'Description',
  },
});

class StyledDropdown extends Component {
  static propTypes = {
    labelIntlId: PropTypes.string,
    placeholderIntlId: PropTypes.string,
    items: PropTypes.any,
    itemCode: PropTypes.string,
    uniqCode: PropTypes.string,
    itemValue: PropTypes.string,
    tagValue: PropTypes.string,
    itemDescription: PropTypes.string,
    selectedItems: PropTypes.array,
    onFilterItems: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onDeselectItem: PropTypes.func.isRequired,
    onClearSelectedItems: PropTypes.func.isRequired,
    sortDescending: PropTypes.bool,
    showDescriptionColumn: PropTypes.bool,
    mandatory: PropTypes.bool,
    single: PropTypes.bool,
    isDataGridField: PropTypes.bool,
  };

  static defaultProps = {
    itemCode: 'code',
    itemDescription: 'description',
    showDescriptionColumn: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      mouseHovered: false,
      keyword: '',
      active: false,
    };

    this.fieldCenter = 0;
  }

  // handle click on tag from selected tags list
  handleClickOnTag = () => {
  };

  // add selected option
  handleSelectOption = (option) => {
    const { selectedItems, onSelectItem, single } = this.props;
    if (!selectedItems.find(item => item.id === option.id)) {
      this.setFilter('');
      if (onSelectItem) {
        onSelectItem(option);
      }
      if (single) {
        this.setExpanded(false);
      }
    }
  };

  // remove selected option
  handleDeselectOption = (option) => {
    const { onDeselectItem, single } = this.props;
    if (onDeselectItem) {
      onDeselectItem(option);
    }
    if (single) {
      this.setExpanded(false);
    }
  };

  // filter options list with given keyword
  handleInputChange = (e) => {
    const { expanded } = this.state;
    if (!expanded) {
      this.setExpanded(true);
    }
    const value = e.target.value;
    if (value || value === '') {
      this.setFilter(value);
    }
  };

  setFilter(value) {
    const { noSearch, onFilterItems } = this.props;
    if (noSearch) {
      return;
    }
    this.setState({ keyword: value }, () => {
      if (onFilterItems) {
        onFilterItems(value);
      }
    });

  }

  @autobind
  setExpanded(expanded, done) {
    this.setState({ expanded }, () => {
      if (this.inputNode) {
        this.inputNode.focus();
      }
      if (done) {
        done();
      }
    });
    if (!expanded) {
      this.setFilter('');
    }
  }

  // clear input text and selected options
  handleClearInput = () => {
    if (this.state.keyword !== '' && this.state.keyword !== null) {
      this.setFilter('');
    }
    if (this.props.onClearSelectedItems) {
      this.props.onClearSelectedItems();
    }
  };

  componentDidMount() {
    if (this.node) {
      this.fieldCenter = this.node.getBoundingClientRect().width / 2;
    }
  }

  @autobind
  setFirstItem() {
    if (this.optionsList) {
      this.optionsList.setItem(0);
      if (this.inputNode) {
        this.inputNode.blur();
        this.forceUpdate();
      }
    }
  }

  @autobind
  onClose() {
    this.setExpanded(false);
  }

  @autobind
  onToggle(e) {
    const { expanded, keyword } = this.state;
    const { type, key } = e;
    if (type === 'keydown') {
      if (expanded) {
        if (key === 'Escape') {
          this.setExpanded(false);
        } else if (this.isOpenKey(key)) {
          this.setFirstItem();
        }
      } else if (this.isOpenKey(key)) {
        this.setExpanded(true, this.setFirstItem);
      }
      return;
    }
    if (type === 'click') {
      if (expanded && keyword !== '') {
        return;
      }
    }
    this.setExpanded(!expanded);
  }

  isOpenKey(key) {
    return key === 'ArrowDown' || key === 'Enter';
  }

  @autobind
  handleKeyDown(e) {
    this.onToggle(e);
  }

  @autobind
  onMouseOut(e) {
    this.setState({ mouseHovered: false });
  }

  @autobind
  onMouseOver(e) {
    this.setState({ mouseHovered: true });
  }

  @autobind
  getDropdownNodes() {
    const { popupNode, dropdownBoxNode } = this;
    return { dropdownToogleNode: popupNode, dropdownBoxNode };
  }

  handleInputBlur = () => {
    this.setState({ active: false });
  };

  handleInputFocus = () => {
    this.setState({ active: true });
  };

  componentDidUpdate() {
    if (this.popupNode && this.dropdownBoxNode && this.state.expanded) {
      const { right, bottom, top, width: popupWidth } = this.popupNode.getBoundingClientRect();
      const { width: viewWidth, height: viewHeight } = document.body.getBoundingClientRect();
      const { width: optionsWidth, height: optionsHeight } = this.optionsNode.getBoundingClientRect();
      const dropdownHeight = Math.min(optionsHeight + 40, 240);
      const dropdownWidth = Math.max(optionsWidth, popupWidth);
      const node = this.dropdownBoxNode;
      node.style.position = 'fixed';
      if (bottom < (viewHeight - dropdownHeight)) {
        node.style.top = `${ bottom }px`;
        node.style.bottom = `${ viewHeight - bottom - dropdownHeight }px`;
      } else {
        node.style.top = `${ top - dropdownHeight }px`;
        node.style.bottom = `${ viewHeight - top }px`;
      }
      node.style.right = `${ viewWidth - right }px`;
      node.style.left = `${ right - dropdownWidth }px`;
    }
  }

  renderError(error) {
    const { isDataGridField } = this.props;
    const { mouseHovered } = this.state;

    const errorClassName = classNames(
      { 'field__error': !isDataGridField },
      { 'field__error-tooltip': isDataGridField }
    );

    if (error) {
      return (
        isDataGridField
          ? (mouseHovered && <RelativePortal top={ 0 } left={ 0 }><CustomTooltip errorClassName={ errorClassName } error={ error } isDataGridField={ isDataGridField } fieldCenter={ this.fieldCenter } /></RelativePortal>)
          : <div className={ errorClassName } aria-label={ error } > { error } </div>
      );
    }

    return null;
  }

  render() {
    const noSelectedItems = isEmpty(this.props.selectedItems);
    const textInputNotEmpty = this.state.keyword !== '' && this.state.keyword !== null;
    const inputClassNames = classNames('styled-dropdown__hidden-input', {
      'styled-dropdown__hidden-input--no-selection': noSelectedItems,
    });

    const dropDownCloseBlock = !noSelectedItems || textInputNotEmpty ?
      <div className='styled-dropdown__close' onClick={ this.handleClearInput } /> : null;

    let listItems = null;
    if (!noSelectedItems) {
      const { selectedItems, itemCode, itemDescription, itemValue, tagValue, single } = this.props;
      const tagListItems = Object.values(selectedItems).map((item) => item);

      listItems = tagListItems.map(item => (
        <TagsListItem
          key={ item.id || item[itemCode] }
          item={ item }
          single={ single }
          itemCode={ itemCode }
          itemValue={ tagValue || itemValue }
          itemDescription={ itemDescription }
          onItemClick={ this.handleClickOnTag }
          onItemClose={ this.handleDeselectOption }
          singleItemSelected={ tagListItems.length === 1 }
        />
        )
      );
    }

    const { error } = this.props;
    const { expanded } = this.state;
    const styledDropdownInputClassName = classNames('styled-dropdown__input', {
      'styled-dropdown__input--error': error,
      'styled-dropdown__input--expanded': expanded,
      'styled-dropdown__input--active': this.state.active,
    });
    const isInputActive = this.inputNode && this.inputNode === document.activeElement;

    return (
      <DropdownContainer getDropdownNodes={ this.getDropdownNodes } expanded={ expanded } onClose={ this.onClose }>
        <div
          className='styled-dropdown'
          ref={ (node) => { this.node = node; } }
        >
          { this.renderTitle() }
          <div
            className={ styledDropdownInputClassName }
            ref={ (node) => this.popupNode = node }
            onMouseOver={ !expanded ? this.onMouseOver : null }
            onMouseOut={ this.onMouseOut }
          >
            <div
              className='styled-dropdown__input-with-tags'
            >
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
                ref={ (inputNode) => this.inputNode = inputNode }
                value={ this.state.keyword }
                onChange={ this.handleInputChange }
                onClick={ this.onToggle }
                onBlur={ this.handleInputBlur }
                onFocus={ this.handleInputFocus }
                onKeyDown={ this.handleKeyDown }
              />
            </div>
            { dropDownCloseBlock }
            { this.renderOptions(noSelectedItems, isInputActive) }
          </div>
          { this.renderError(error) }
        </div>
      </DropdownContainer>
    );
  }

  renderTitle() {
    const { mandatory, labelIntlId, hideTitle } = this.props;
    if (hideTitle) {
      return null;
    }
    return (
      <div
        className={ classNames('styled-dropdown__title', {
          'styled-dropdown__title--mandatory': mandatory,
        }) }
      >
        { labelIntlId && <FormattedMessage id={ this.props.labelIntlId } /> }
      </div>
    );
  }

  renderOptions(noSelectedItems, isInputActive) {
    const { intl, items, itemCode, uniqCode, itemDescription, selectedItems, sortDescending, showDescriptionColumn } = this.props;
    const { expanded } = this.state;
    if (expanded && items) {
      let options = [];
      if (sortDescending) {
        options = orderBy(items, [itemCode], ['desc']);
      } else {
        options = Object.values(items).map((item) => item);
      }

      const dropDownStyles = (!noSelectedItems && this.popupNode
        ? { top: `${ this.popupNode.offsetHeight }px` }
        : null);

      return (
        <div
          className='styled-dropdown__options'
          style={ dropDownStyles }
          ref={ (node) => { this.dropdownBoxNode = node; } }
        >
          <div className='styled-options-header'>
            <div className='styled-options-header__code'>
              { intl.formatMessage({ id: 'dropdown.code-header' }) }
            </div>
            { this.renderDescription() }
          </div>
          <OptionsList
            setOptionsNode={ (node) => { this.optionsNode = node; } }
            ref={ (instance) => { this.optionsList = instance; } }
            items={ options }
            itemCode={ itemCode }
            itemDescription={ itemDescription }
            uniqueId={ uniqCode || itemCode }
            selectedItems={ selectedItems }
            onItemClick={ this.handleSelectOption }
            showDescriptionColumn={ showDescriptionColumn }
            styleModifier='styled-dropdown-option'
            exit={ this.onClose }
            isInputActive={ isInputActive }
          />
        </div>
      );
    }
    return null;
  }

  renderDescription() {
    if (this.props.showDescriptionColumn) {
      return (
        <div className='styled-options-header__description'>
          { this.props.intl.formatMessage({ id: 'dropdown.description-header' }) }
        </div>
      );
    }
    return null;
  }

}

export default injectIntl(StyledDropdown);
