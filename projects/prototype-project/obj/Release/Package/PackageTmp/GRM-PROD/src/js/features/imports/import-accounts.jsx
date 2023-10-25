import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import { routes } from '../app/app';

import { ScrollBox } from '../../components/general/scroll-box';
import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';

import { setImportAccountsGroups, setImportOtherScenariosGroups, getImportAccountsList } from './actions/imports';
import { getImport, getImportOtherScenarios } from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { extractAccounts, extractOtherScenarios } from './selectors/imports';
import { addScenarioIdToRoute } from '../../utils/utils';

import './imports.scss';
import '../../../styles/content-gradient.scss';

const titleIcon = 'position';

defineMessages({
  title: {
    id: 'imports.title',
    defaultMessage: 'Imports',
  },
  titleColon: {
    id: 'imports.title-colon',
    defaultMessage: 'Import:',
  },
  accountsTabTitle: {
    id: 'imports.accounts-tab-title',
    defaultMessage: 'Accounts',
  },
  otherScenariosTabTitle: {
    id: 'imports.other-scenarios-tab-title',
    defaultMessage: 'Other Scenarios',
  },
});

@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  entry: state.imports.entry,
  isLoading: state.imports.isLoading,
  previousScenarioId: state.imports.options.importScenarioId,
  previousImportScenarioId: state.importAccounts.options.importScenarioId,
  accountsTable: extractAccounts(state),
  accountsGroups: state.importAccounts.groups,
  accountsPaging: state.importAccounts.paging,
  isAccountsLoading: state.importAccounts.isLoading,
  otherScenariosTable: extractOtherScenarios(state),
  otherScenariosGroups: state.importOtherScenarios.groups,
  otherScenariosPaging: state.importOtherScenarios.paging,
  isOtherScenariosLoading: state.importOtherScenarios.isLoading,
  otherScenariosData: state.importOtherScenarios.data,
}), (dispatch) => bindActionCreators({
  getImport,
  getImportAccountsList,
  setImportAccountsGroups,
  getImportOtherScenarios,
  setImportOtherScenariosGroups,
  setTitle,
}, dispatch))
class ImportAccounts extends TrackablePage {
  static propTypes = {
    importScenarioId: PropTypes.string,
    previousImportScenarioId: PropTypes.number,
    accountsTable: PropTypes.object,
    accountsGroups: PropTypes.array,
    accountsPaging: PropTypes.object,
    isAccountsLoading: PropTypes.bool,
    scenariosGroups: PropTypes.array,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    scenarioId: PropTypes.number,
    previousScenarioId: PropTypes.number,
    getImport: PropTypes.func,
    getImportAccountsList: PropTypes.func,
    setImportAccountsGroups: PropTypes.func,
    getImportOtherScenarios: PropTypes.func,
    setImportOtherScenariosGroups: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props, true);
    this.onChangeProps(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.onChangeProps(props);
  }

  onChangeProps(props) {
    const { importNumber, comment } = props.entry;
    const { setTitle } = props;
    setTitle(this.getTitle(importNumber, comment));
  }


  init(props, initial) {
    const { isLoading, importScenarioId, previousImportScenarioId, accountsPaging, otherScenariosPaging } = props;

    if (importScenarioId !== previousImportScenarioId) {
      this.props.getImport(importScenarioId);
    } else if (!isLoading) {
      this.loadAccounts(props, accountsPaging.pageNo, accountsPaging.pageSize, initial);
    }

    if (!isEqual(importScenarioId, previousImportScenarioId)) {
      this.loadOtherScenarios(props, otherScenariosPaging.pageNo, otherScenariosPaging.pageSize);
    }
  }

  loadAccounts(props, pageNo, pageSize, force = false) {
    const { importScenarioId, isAccountsLoading, getImportAccountsList } = props;
    if (!isAccountsLoading) {
      getImportAccountsList(importScenarioId, pageNo, pageSize, force);
    }
  }

  loadOtherScenarios(props, pageNo, pageSize) {
    const { scenarioId, otherScenariosData, otherScenariosPaging, isOtherScenariosLoading } = props;
    const { importNumber } = this.props.entry;
    const newScenariosQuery = { scenarioId, pageNo, pageSize };
    const oldScenariosQuery = { scenarioId, pageNo: otherScenariosPaging.pageNo, pageSize: otherScenariosPaging.pageSize };

    if (importNumber !== undefined && !isEqual(newScenariosQuery, oldScenariosQuery) && (!isOtherScenariosLoading || !otherScenariosData)) {
      props.getImportOtherScenarios(scenarioId, importNumber, pageNo, pageSize);
    }
  }

  getTitle(importNumber, description) {
    const names = [importNumber, description];
    return names.join(' ');
  }

  @autobind
  onEdit() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onFetchAccounts(tableState) {
    this.loadAccounts(this.props, tableState.page + 1, tableState.pageSize);
  }

  @autobind
  onFetchOtherScenarios(tableState) {
    this.loadOtherScenarios(this.props, tableState.page + 1, tableState.pageSize);
  }

  @autobind
  setAccountsPageSize(pageSize) {
    const { accountsPaging } = this.props;
    this.loadAccounts(this.props, accountsPaging.pageNo, pageSize);
  }

  @autobind
  onAccountsPageChange(page) {
    const { accountsPaging } = this.props;
    this.loadAccounts(this.props, page + 1, accountsPaging.pageSize);
  }

  @autobind
  onAccountsRowClick(originalRow) {
    const { id, importId } = originalRow;
    const { scenarioId } = this.props;
    this.props.history.push(addScenarioIdToRoute(`${ routes.IMPORTS.path }/${ importId }/accounts/${ id }`, scenarioId));
  }

  @autobind
  setOtherScenariosPageSize(pageSize) {
    const { otherScenariosPaging } = this.props;
    this.loadOtherScenarios(this.props, otherScenariosPaging.pageNo, pageSize);
  }

  @autobind
  onOtherScenariosPageChange(page) {
    const { otherScenariosPaging } = this.props;
    this.loadOtherScenarios(this.props, page + 1, otherScenariosPaging.pageSize);
  }

  renderAccountsTab() {
    const { isAccountsLoading, accountsTable, accountsGroups, setImportAccountsGroups, accountsPaging } = this.props;

    return (
      <Form.Tab
        id='accounts'
        intlId='imports.accounts-tab-title'
        isLoading={ isAccountsLoading }
        classModifier='form__tab--imports'
      >
        <Form.GridWithPaging
          rows={ accountsTable.rows }
          columns={ accountsTable.columns }
          titleIntlId='imports.title'
          titleIcon='employees'
          isLoading={ isAccountsLoading }
          groups={ accountsGroups }
          setGroups={ setImportAccountsGroups }
          manual={ true }
          pages={ accountsPaging.pageCount }
          page={ accountsPaging.pageNo - 1 }
          pageSize={ accountsPaging.pageSize }
          onFetchData={ this.onFetchAccounts }
          setPageSize={ this.setAccountsPageSize }
          onPageChange={ this.onAccountsPageChange }
          onRowClick={ this.onAccountsRowClick }
          noGroups
          noCustomizeColumns
        />
      </Form.Tab>
    );
  }

  renderOtherScenariosTab() {
    const { isOtherScenariosLoading, otherScenariosTable, otherScenariosGroups, setImportOtherScenariosGroups, otherScenariosPaging } = this.props;

    return (
      <Form.Tab
        id='other-scenarios'
        intlId='imports.other-scenarios-tab-title'
        isLoading={ isOtherScenariosLoading }
        classModifier='form__tab--imports'
      >
        <Form.GridWithPaging
          rows={ otherScenariosTable.rows }
          columns={ otherScenariosTable.columns }
          titleIntlId='imports.title'
          titleIcon='employees'
          isLoading={ isOtherScenariosLoading }
          groups={ otherScenariosGroups }
          setGroups={ setImportOtherScenariosGroups }
          manual={ true }
          pages={ otherScenariosPaging.pageCount }
          page={ otherScenariosPaging.pageNo - 1 }
          pageSize={ otherScenariosPaging.pageSize }
          onFetchData={ this.onFetchOtherScenarios }
          setPageSize={ this.setOtherScenariosPageSize }
          onPageChange={ this.onOtherScenariosPageChange }
          noGroups
          noCustomizeColumns
        />
      </Form.Tab>
    );
  }

  renderTabs() {
    return (
      <Form.Tabs active='accounts'>
        { this.renderAccountsTab() }
        { this.renderOtherScenariosTab() }
      </Form.Tabs>
    );
  }

  render() {
    const { isLoading } = this.props;
    const { importNumber, comment, active } = this.props.entry;

    const activeLabel = (active
      ? <div className='imports__active'><FormattedMessage id='imports.other-scenarios-active' defaultMessage='Active' /></div>
      : <div className='imports__deleted'><FormattedMessage id='imports.other-scenarios-deleted' defaultMessage='Deleted' /></div>
    );

    return (
      <div className='imports'>
        <div className='imports__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='imports__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='imports.title-colon' message={ this.getTitle(importNumber, comment) } />
                  { !isLoading && active !== undefined && activeLabel }
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              { this.renderTabs() }
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(ImportAccounts);
