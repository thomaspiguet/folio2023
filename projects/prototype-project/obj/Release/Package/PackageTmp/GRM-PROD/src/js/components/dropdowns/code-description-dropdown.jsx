import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { filter, isEqual, isObject, isUndefined, pull, find, debounce } from 'lodash';
import { FormattedMessage } from 'react-intl';
import AnimateHeight from 'react-animate-height';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Field from '../../components/controls/field';
import StyledDropdown from '../controls/styled-dropdown';

import { defaultValidator } from '../../utils/components/form-validator';
import { makeSearchString } from '../../utils/utils';

export default class CodeDescriptionDropdown extends Component {
  static propTypes = {
    validator: PropTypes.object.isRequired,
    entities: PropTypes.array,
    isLoading: PropTypes.bool,
    getEntities: PropTypes.func.isRequired,
    value: PropTypes.any,
    editMode: PropTypes.bool.isRequired,
    labelIntlId: PropTypes.string,
    placeholderIntlId: PropTypes.string.isRequired,
    itemDescription: PropTypes.string,
    itemCode: PropTypes.string,
    uniqCode: PropTypes.string,
    itemValue: PropTypes.string,
    tagValue: PropTypes.string,
    fullSearch: PropTypes.bool,
    parameters: PropTypes.object,
    queryParameters: PropTypes.object,
    entitiesParameters: PropTypes.object,
    entitiesQueryParameters: PropTypes.object,
    entitiesMetadata: PropTypes.object,
    getEntitiesFiltered: PropTypes.func,
    serverSearch: PropTypes.bool,
    allItemsMode: PropTypes.bool,
    allItemsIntlId: PropTypes.string,
  };

  static defaultProps = {
    validator: defaultValidator,
    itemDescription: 'longDescription',
    itemCode: 'code',
    itemValue: 'code',
    fullSearch: false,
    parameters: {},
    entitiesParameters: {},
    queryParameters: {},
    entitiesQueryParameters: {},
    entitiesMetadata: {},
    serverSearch: false,
    allItemsMode: false,
    allItemsIntlId: 'dropdown-department.all',
  };

  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      value: undefined,
      selectedItems: [],
      keyword: '',
      allItemsExpanded: false,
    };
  }

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  componentDidUpdate() {
    const { allItemsExpanded } = this.state;
    if (this.expandableNode && this.expandableNode.contentElement && this.fieldNode && this.buttonNode && !allItemsExpanded) {
      if (this.expandableNode.contentElement.clientWidth < this.fieldNode.clientWidth) {
        this.buttonNode.style.display = 'none';
      } else {
        this.buttonNode.style.display = 'flex';
      }
    }
  }

  init(props, initial) {
    const { editMode, multiple, disabled } = props;
    if (!editMode || disabled) {
      return;
    }

    const { value, getEntities, entities, parameters, queryParameters, entitiesParameters, entitiesQueryParameters, entitiesMetadata, isLoading, validator: { metadata } } = props;
    if (metadata.endpoints && !isLoading && (!entities
        || !isEqual(metadata, entitiesMetadata)
        || !isEqual(parameters, entitiesParameters)
        || !isEqual(queryParameters, entitiesQueryParameters))) {
      getEntities(metadata, parameters, queryParameters, this.state.keyword);
      return;
    }

    if (multiple) {
      // update selectedItems if dropdown entities list or selected items has been changed
      let selectedItems = value ? [...value] : [];
      if (!isLoading && ((entities && !isEqual(entities, this.props.entities)) || !isEqual(value, this.props.value))) {
        selectedItems = filter(selectedItems, item => {
          const found = find(entities, entity => item.id === entity.id);
          return !isUndefined(found);
        });
      }

      if (!isEqual(selectedItems, this.state.selectedItems)) {
        this.setSelectedItems(selectedItems);
      }
    } else {
      this.setState({ value });
    }
    this.setFilter(props, this.state.keyword);
  }

  setSelectedItems(items) {
    this.setState({ selectedItems: items }, () => {
      this.setValue(items);
    });
  }

  @autobind
  onSelectItem(value) {
    const { multiple } = this.props;
    if (multiple) {
      const { selectedItems } = this.state;
      const selected = [...selectedItems, value];
      this.setSelectedItems(selected);
    } else {
      this.setValue(value);
    }
    this.setFilter(this.props, '');
  }

  setValue(value) {
    const { validator, index, onChange: moreOnChange } = this.props;
    if (validator) {
      const { onChange } = validator;
      onChange(value, index, null, () => {
        if (moreOnChange) {
          moreOnChange(value, index);
        }
      });
    } else if (moreOnChange) {
      moreOnChange(value, index);
    }
  }

  @autobind
  onDeselectItem(item) {
    const { multiple } = this.props;
    if (multiple) {
      const { selectedItems } = this.state;
      pull(selectedItems, item);
      this.setSelectedItems([...selectedItems]);
    } else {
      const value = undefined;
      const { validator: { onChange }, index, onChange: moreOnChange } = this.props;
      onChange(value, index, null, () => {
        if (moreOnChange) {
          moreOnChange(value, index);
        }
      });
    }
  }

  @autobind
  onClearSelectedItems() {
    const { multiple } = this.props;
    if (multiple) {
      this.setSelectedItems([]);
    } else {
      const value = undefined;
      const { validator: { onChange }, index, onChange: moreOnChange } = this.props;
      onChange(value, index, null, () => {
        if (moreOnChange) {
          moreOnChange(value, index);
        }
      });
    }
  }

  isFiltered(item, keyword, itemCode, itemDescription, fullSearch) {
    if (!item || !item[itemCode] || !keyword) {
      return true;
    }
    const code = makeSearchString(item[itemCode]);
    const descr = makeSearchString(item[itemDescription]);
    const word = makeSearchString(keyword);
    if (fullSearch) {
      return code.indexOf(word) >= 0 || descr.indexOf(word) >= 0;
    }
    // return startsWith(code, word);
    return code.indexOf(word) >= 0;
  }

  setFilter(props, keyword) {
    const {
      entities,
      itemCode,
      itemDescription,
      fullSearch,
      validator: { metadata },
      serverSearch,
      getEntities,
      parameters,
      queryParameters,
    } = props;
    const filtered = filter(entities, item => this.isFiltered(item, keyword, itemCode, itemDescription, fullSearch));
    const oldKeyword = this.state.keyword;

    this.setState({ keyword, filtered }, () => {
      if (serverSearch && !isUndefined(keyword) && !isEqual(keyword, oldKeyword)) {
        getEntities(metadata, parameters, queryParameters, keyword);
      }
    });
  }

  @autobind
  onFilterItems(keyword) {
    this.setFilter(this.props, keyword);
  }

  onFilterItemsDebounced = debounce(this.onFilterItems, 200);

  @autobind
  onShowSelectedItemsClick() {
    const { allItemsExpanded } = this.state;
    this.setState({ allItemsExpanded: !allItemsExpanded });
  }

  @autobind
  renderSelectedItemsList() {
    const { allItemsExpanded } = this.state;
    const { value } = this.props;
    const buttonClassName = classNames('selected-items__button', {
      'selected-items__button--expanded': allItemsExpanded,
    });

    const contentClassName = classNames('selected-items__list', {
      'selected-items__list--expanded': allItemsExpanded,
    });

    const values = Object.values(value.items).map((item) => <div key={ item.id } className='selected-items__list-item'>{ item.shortDescription }</div>);
    return (
      <div className='selected-items' ref={ node => this.fieldNode = node }>
        <AnimateHeight
          className='selected-items__expandable'
          contentClassName={ contentClassName }
          height={ allItemsExpanded ? 'auto' : 20 }
          duration={ 500 }
          ref={ node => this.expandableNode = node }
        >
          { values }
        </AnimateHeight>
        <div className={ buttonClassName } onClick={ this.onShowSelectedItemsClick } ref={ node => this.buttonNode = node } />
      </div>
    );
  }

  render() {
    const { editMode, validator: { getMandatory, getError }, labelIntlId, placeholderIntlId,
      itemDescription, itemCode, uniqCode, itemValue, tagValue, noSearch, hideTitle, index, isDataGridField,
      disabled, multiple, allItemsMode, allItemsIntlId } = this.props;
    if (!editMode || disabled) {
      const { value, itemValue } = this.props;
      let resultValue = isObject(value) ? value[itemValue] : value;
      if (allItemsMode && isObject(value)) {
        if (value.all) {
          resultValue = <FormattedMessage id={ allItemsIntlId } />;
        } else {
          resultValue = this.renderSelectedItemsList();
        }
      }
      return (
        <Field value={ resultValue } labelIntlId={ labelIntlId } disabled={ disabled } />
      );
    }

    const { value, filtered, selectedItems } = this.state;
    const items = multiple ? selectedItems : (value && value[itemCode]) ? [value] : [];
    const mandatory = getMandatory();
    const error = isDataGridField ? getError(index) : getError();

    return (
      <StyledDropdown
        labelIntlId={ labelIntlId }
        hideTitle={ hideTitle }
        placeholderIntlId={ placeholderIntlId }
        items={ filtered }
        itemDescription={ itemDescription }
        itemCode={ itemCode }
        uniqCode={ uniqCode }
        itemValue={ itemValue }
        tagValue={ tagValue }
        noSearch={ noSearch }
        selectedItems={ items }
        onSelectItem={ this.onSelectItem }
        onDeselectItem={ this.onDeselectItem }
        onClearSelectedItems={ this.onClearSelectedItems }
        onFilterItems={ this.onFilterItemsDebounced }
        single={ true }
        mandatory={ mandatory }
        isDataGridField={ isDataGridField }
        error={ error }
      />
    );
  }
}

