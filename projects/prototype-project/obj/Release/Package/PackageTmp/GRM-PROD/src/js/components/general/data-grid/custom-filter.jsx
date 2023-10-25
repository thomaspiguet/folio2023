import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { autobind } from 'core-decorators';
import { map, filter, each, find, isFunction, isEqual } from 'lodash';

import { ScrollBox } from '../scroll-box';
import Button from '../../controls/button';
import Checkbox from '../../controls/checkbox';

import './custom-filter.scss';
import { accessElement } from '../../../utils/selectors/currency';
import { makeSearchString } from '../../../utils/utils';

defineMessages({
  clear: {
    id: 'custom-filter.clear',
    defaultMessage: 'CLEAR',
  },
  filter: {
    id: 'custom-filter.filter',
    defaultMessage: 'FILTER',
  },
  search: {
    id: 'custom-filter.search',
    defaultMessage: 'Search',
  },
});

class CustomFilter extends PureComponent {
  static propTypes = {
    filters: PropTypes.object,
    column: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      items: [],
    };
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocClick, true);
    document.addEventListener('dragstart', this.handleDocClick, true);
    document.addEventListener('dragstart', this.handleDocClick, false);
    document.addEventListener('wheel', this.onUnhandledEvent, true);
    document.addEventListener('wheel', this.onUnhandledEvent, false);
    document.addEventListener('scroll', this.onUnhandledEvent, true);
    document.addEventListener('scroll', this.onUnhandledEvent, false);
    this.init(this.props);
    if (this.inputNode) {
      this.inputNode.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocClick, true);
    document.removeEventListener('dragstart', this.handleDocClick, true);
    document.removeEventListener('dragstart', this.handleDocClick, false);
    document.removeEventListener('wheel', this.onUnhandledEvent, true);
    document.removeEventListener('wheel', this.onUnhandledEvent, false);
    document.removeEventListener('scroll', this.onUnhandledEvent, true);
    document.removeEventListener('scroll', this.onUnhandledEvent, false);
  }

  init(props) {
    const { filters, column } = props;
    const all = filters.all || {};
    const active = filters.active || {};
    const columnId = column.id;
    const allFilters = all[columnId];
    const activeFilters = active[columnId];
    const items = map(allFilters, (item) => ({
      name: columnId,
      item: accessElement(item, columnId),
      value: isFunction(column.accessor) ? column.accessor(item) : accessElement(item, columnId),
      selected: false,
    }));
    each(activeFilters, (aitem) => {
      const el = find(items, ({ name, item }) => isEqual({ name, value: item }, aitem));
      if (el) {
        el.selected = true;
      }
    });
    this.setState({ items });
  }

  isEventInComponent(event) {
    const { componentNode } = this;
    if (!componentNode) {
      return false;
    }
    const { target, type } = event;

    if (componentNode.contains(target)) {
      return true;
    }

    if (type === 'dragstart' || type === 'dragend') {
      return true;
    }

    return false;
  }

  @autobind
  handleDocClick(event) {
    if (!this.isEventInComponent(event)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const { onClose } = this.props;
      onClose();
    }
  }

  @autobind
  onUnhandledEvent(e) {
    if (!this.isEventInComponent(event)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  filterItems() {
    const {
      items,
      filter: filterValue,
    } = this.state;

    const selectedItems = filter(items, ({ selected }) => { return selected; });
    const filteredItems = filter(items, ({ value }) => makeSearchString(value).indexOf(makeSearchString(filterValue)) >= 0);

    const filtered = map(filteredItems, (item) => {
      const { selected: isSelected, value } = item;
      return (<Checkbox
        className={ 'custom-filter__item' }
        key={ value }
        value={ isSelected }
        label={ value }
        single
        editMode
        onToggle={ this.onToggleItem.bind(this, item) }
      />);
    });

    return { filtered, selected: selectedItems.length };
  }

  onToggleItem(item) {
    item.selected = !item.selected;
    this.setState({ items: [...this.state.items] });
  }

  @autobind
  onClear() {
    const items = [...this.state.items];
    each(items, item => {
      item.selected = false;
    });
    this.setState({ items });
  }

  @autobind
  onFilter() {
    const selectedItems = filter(this.state.items, ({ selected }) => selected);
    const filters = map(selectedItems, ({ name, item }) => ({ name, value: item }));
    const columnId = this.props.column.id;
    this.props.setFilters(columnId, filters);
    const { onClose } = this.props;
    onClose();
  }

  @autobind
  onInputChange(event) {
    const filter = event.target.value;
    this.setState({ filter });
  }

  componentDidUpdate() {
    if (this.itemsNode && this.scrollNode) {
      const height = Math.max(100, Math.min(270, this.itemsNode.getBoundingClientRect().height));
      const node = ReactDOM.findDOMNode(this.scrollNode);
      if (node) {
        node.style.height = `${ height }px`;
      }
    }
  }

  render() {
    const { filtered, selected } = this.filterItems();
    const { placeholderIntlId, intl } = this.props;
    return (
      <div className='custom-filter' ref={ node => this.componentNode = node }>
        <div className='custom-filter__search'>
          <input
            type='text'
            tabIndex={ 0 }
            className='custom-filter__input'
            value={ this.state.filter }
            onChange={ this.onInputChange }
            placeholder={ placeholderIntlId ? intl.formatMessage({ id: placeholderIntlId }) : null }
            ref={ node => this.inputNode = node }
          />
          <div className='custom-filter__icon' />
        </div>
        <div className='custom-filter__filters'>
          <ScrollBox style={ { height: '270px' } } ref={ node => this.scrollNode = node } >
            <div className='custom-filter__items' ref={ node => this.itemsNode = node }>
              { filtered }
            </div>
          </ScrollBox>
        </div>
        <div className='custom-filter__separator' />
        <div className='custom-filter__selected'>
          <span>{ selected }</span>
          <FormattedMessage id='custom-filter.selected' defaultMessage='items selected' />
        </div>
        <div className='custom-filter__actions'>
          <Button
            className='custom-filter__action custom-filter__action--clear'
            labelIntlId='custom-filter.clear'
            onClick={ this.onClear }
          />
          <Button
            className='custom-filter__action custom-filter__action--filter'
            labelIntlId='custom-filter.filter'
            onClick={ this.onFilter }
          />
        </div>
      </div>
    );
  }
}
export default injectIntl(CustomFilter);
