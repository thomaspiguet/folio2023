import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TrackablePage from '../trackable-page/trackable-page';
import DataGridScrollable from '../data-grid/data-grid-scorllable';
import { GridExport } from '../../../features/app/effects/reports';
import Button from '../../controls/button';

import { selectSideMenu } from '../side-menu/actions';

import './base-list.scss';
import '../../../../styles/content-gradient.scss';

defineMessages({
  globalParametersTitle: {
    id: 'base-list.action-add',
    defaultMessage: 'ADD',
  },
});

@connect(state => ({
  sideMenuExpanded: state.sideMenu.menuExpanded,
}), (dispatch) => bindActionCreators({
  selectSideMenu,
}, dispatch))
class BaseList extends TrackablePage {
  static propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    groups: PropTypes.array,
    setGroups: PropTypes.func,
    titleIntlId: PropTypes.string,
    titleIcon: PropTypes.string,
    isLoading: PropTypes.any,
    menuItemId: PropTypes.string,
    menuSubitemId: PropTypes.string,
    doExport: PropTypes.func,
    onAdd: PropTypes.func,
    standalone: PropTypes.bool,
    noCustomizeColumns: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentRow: 0,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    this.props.selectSideMenu(props.menuItemId, props.menuSubitemId);
  }

  @autobind
  getColumnName(column) {
    if (column.intlId) {
      return this.props.intl.formatMessage({ id: column.intlId }, column.intlValues);
    }
    return column.id;
  }

  @autobind
  onExportExcel() {
    const gridExport = new GridExport();
    const body = gridExport.buildRequestBody(
      this.props.title,
      this.props.groups,
      this.getColumnName,
      this.props.columns
    );

    this.props.doExport(body);
  }

  render() {
    const { rows, columns, isLoading, groups, setGroups, titleIntlId, titleIcon,
      standalone, onAdd, SearchSimple, SearchAction, SearchAdvanced, doExport, noCustomizeColumns } = this.props;

    return (
      <div className='base-list'>
        { titleIntlId && <div className='base-list__gradient content-gradient' /> }
        <div className={ classNames('base-list__table', {
          'base-list__table--collapsed-sidebar': !this.props.sideMenuExpanded,
          'base-list__table--standalone': standalone,
        }) }
        >
          <DataGridScrollable
            { ...this.props }
            rows={ rows }
            columns={ columns }
            isLoading={ isLoading }
            groups={ groups }
            setGroups={ setGroups }
          >
            { titleIntlId &&
              <div className='base-list__actions'>
                <div className='base-list__actions-left'>
                  <div className={ classNames('base-list__title', `base-list__title--${ titleIcon }`) }>
                    <FormattedMessage id={ titleIntlId } />
                  </div>
                </div>
                <div className='base-list__actions-right'>
                  { SearchSimple &&
                    <div className='base-list__search-simple'>
                      <SearchSimple { ...this.props } />
                    </div>
                  }
                  { SearchAction &&
                    <div className='base-list__search-action'>
                      <SearchAction { ...this.props } />
                    </div>
                  }
                  { !noCustomizeColumns && <div className='base-list__action base-list__action--customize' /> }
                  { onAdd && <Button
                    classElementModifier='add'
                    labelIntlId='base-list.action-add'
                    onClick={ onAdd }
                  /> }
                  { doExport &&
                    <div className='base-list__action base-list__action--export-to-excel' onClick={ this.onExportExcel }>
                      <FormattedMessage id='base-list.action-export-to-excel' defaultMessage='EXPORT TO EXCEL' />
                    </div>
                  }
                </div>
              </div>
            }
            { SearchAdvanced &&
              <div className='base-list__search-advanced'>
                <SearchAdvanced { ...this.props } />
              </div>
            }
          </DataGridScrollable>
        </div>
      </div>
    );
  }
}

export default injectIntl(BaseList);
