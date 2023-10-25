import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';
import { forEach, cloneDeep } from 'lodash';

import { ScrollBox } from '../scroll-box/index';

import CustomizeColumnsGroup from './column-groups';
import Button from '../../controls/button';
import DropdownContainer from '../../controls/dropdown-container';

import './customize-columns.scss';

defineMessages({
  customizeColumns: {
    id: 'customize-columns.customize-columns',
    defaultMessage: 'Customize Columns',
  },
  customizeColumnsButtonApply: {
    id: 'customize-columns.customize-columns-button-apply',
    defaultMessage: 'Apply',
  },
  customizeColumnsButtonRestoreToDefaults: {
    id: 'customize-columns.customize-columns-button-restore-to-defaults',
    defaultMessage: 'Restore to defaults',
  },
});

class CustomizeColumnsPopup extends PureComponent {

  constructor(props) {
    super(props);
    this.customizeColumnsNode = null;
  }

  @autobind
  handleClickOnCustomizeColumnsNode(e) {
    if (this.customizeColumnsNode && this.customizeColumnsNode.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @autobind
  setCustomizeColumnsNode(node) {
    this.customizeColumnsNode = node;
    this.props.setDropdownBoxNode(node);
  }

  render() {
    const { intl, customizedColumns, expanded, onExpandGroup, onCheckBoxChange, onGroupCheckBoxChange,
      onRestoreDefaults, onApplyCustomization } = this.props;

    const containerClassName = classNames('customize-columns', {
      'customize-columns--expanded': expanded,
    });

    const headerTitle = intl.formatMessage({ id: 'customize-columns.customize-columns' });

    const customColumns = [];
    forEach(customizedColumns, (columnGroup) => {
      columnGroup.forEach((column) => {
        customColumns.push(
          <CustomizeColumnsGroup
            item={ column }
            key={ column.id }
            toggleExpandGroup={ onExpandGroup }
            onChange={ onCheckBoxChange }
            onGroupChange={ onGroupCheckBoxChange }
          />
        );
      });
    });

    return (
      <div className={ containerClassName } ref={ this.setCustomizeColumnsNode } onClick={ this.handleClickOnCustomizeColumnsNode }>
        <div className='customize-columns__header'>{headerTitle}</div>
        <div className='customize-columns__separator' />
        <div className='customize-columns__columns'>
          <ScrollBox style={ { height: '428px' } }>
            {customColumns}
          </ScrollBox>
        </div>
        <div className='customize-columns__separator' />
        <div className='customize-columns__footer'>
          <Button
            key='customize-columns-restore-defaults-button'
            classElementModifier='customize-columns-restore-defaults'
            labelIntlId='customize-columns.customize-columns-button-restore-to-defaults'
            onClick={ onRestoreDefaults }
          />
          <Button
            key='customize-columns-apply-button'
            classElementModifier='customize-columns-apply'
            labelIntlId='customize-columns.customize-columns-button-apply'
            onClick={ onApplyCustomization }
          />
        </div>
      </div>
    );
  }
}

class CustomizeColumns extends Component {
  static propTypes = {
    columns: PropTypes.object.isRequired,
    onApplyColumnsChanges: PropTypes.func.isRequired,
    onRestoreDefaultColumns: PropTypes.func.isRequired,
  };

  static defaultProps = {
    columns: [],
  };

  state = {
    customizedColumns: this.props.columns,
    expanded: false,
  };

  @autobind
  onToggle(e) {
    this.setState({
      expanded: !this.state.expanded,
      customizedColumns: this.props.columns,
    });
  }

  @autobind
  onClose() {
    this.setState({
      expanded: false,
      customizedColumns: this.props.columns,
    });
  }

  @autobind
  onRestoreDefaults() {
    if (this.props.onRestoreDefaultColumns) {
      this.props.onRestoreDefaultColumns();
    }
    this.setState({ expanded: false });
  }

  @autobind
  onApplyCustomization() {
    if (this.props.onApplyColumnsChanges) {
      this.props.onApplyColumnsChanges(this.state.customizedColumns);
    }
    this.setState({ expanded: false });
  }

  @autobind
  onExpandGroup(groupId) {
    const customColumns = cloneDeep(this.state.customizedColumns);
    forEach(customColumns, (columnGroup) => {
      columnGroup.forEach((column) => {
        if (column.id === groupId) {
          column.expanded = !column.expanded;
        }
      });
    });
    this.setState({ customizedColumns: customColumns });
  }

  @autobind
  onCheckBoxChange(value, parentId, id) {
    const customColumns = cloneDeep(this.state.customizedColumns);
    if (parentId && id) {
      forEach(customColumns, (columnGroup) => {
        columnGroup.forEach((column) => {
          if (column.id === parentId && column.columns) {
            const columnIndex = column.columns.findIndex((item) => (item.id === id));
            column.columns[columnIndex].visible = value;
          }
        });
      });
    }
    this.setState({ customizedColumns: customColumns });
  }

  @autobind
  onGroupCheckBoxChange(value, id) {
    const customColumns = cloneDeep(this.state.customizedColumns);
    if (id) {
      forEach(customColumns, (columnGroup) => {
        columnGroup.forEach((column) => {
          if (column.id === id && column.columns) {
            column.columns.forEach((item) => { item.visible = value; });
          }
        });
      });
    }
    this.setState({ customizedColumns: customColumns });
  }

  @autobind
  getDropdownNodes() {
    const { dropdownToogleNode, dropdownBoxNode } = this;
    return { dropdownToogleNode, dropdownBoxNode };
  }

  @autobind
  setDropdownBoxNode(node) {
    this.dropdownBoxNode = node;
  }

  render() {

    const { intl } = this.props;
    const { customizedColumns, expanded } = this.state;

    return (
      <DropdownContainer containerClassNames={ ['customize-columns__container'] } getDropdownNodes={ this.getDropdownNodes } expanded={ expanded } onClose={ this.onClose }>
        <div
          className='salaries__action salaries__action--customize'
          onClick={ this.onToggle }
          ref={ node => { this.dropdownToogleNode = node; } }
        >
          { expanded &&
            <CustomizeColumnsPopup
              setDropdownBoxNode={ this.setDropdownBoxNode }
              intl={ intl }
              expanded={ expanded }
              customizedColumns={ customizedColumns }
              onExpandGroup={ this.onExpandGroup }
              onCheckBoxChange={ this.onCheckBoxChange }
              onGroupCheckBoxChange={ this.onGroupCheckBoxChange }
              onRestoreDefaults={ this.onRestoreDefaults }
              onApplyCustomization={ this.onApplyCustomization }
              onClose={ this.onClose }
              handleClickInside={ this.handleClickInside }
            />
          }
        </div>
      </DropdownContainer>
    );
  }
}

export default injectIntl(CustomizeColumns);
