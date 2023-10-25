import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';

import Form from '../../general/form/form';
import Field from '../../controls/field';
import Checkbox from '../../controls/checkbox';
import SearchInput from '../../controls/search-input';

import SecondaryCode from '../../dropdowns/secondary-code';

import BaseList from '../../general/base-list/base-list';
import { extractAccount } from './selectors';

import {
  getAccountsList,
  setSelectedAccount,
  clearAccountKeyword,
  filterAccountByKeyword,
} from './actions';

import './account.scss';

defineMessages({
  otherAccountTitle: {
    id: 'other-account.title',
    defaultMessage: 'Search: GL Account',
  },
  otherAccountTableTitle: {
    id: 'other-account.table-title',
    defaultMessage: 'Results:',
  },
  otherAccountTableKeyword: {
    id: 'other-account.table-keyword',
    defaultMessage: 'Keyword',
  },
  otherAccountSystemCode: {
    id: 'other-account.system-code',
    defaultMessage: 'System code:',
  },
  otherAccountPrimaryCode: {
    id: 'other-account.primary-code',
    defaultMessage: 'Primary code:',
  },
  otherAccountSecondaryCode: {
    id: 'other-account.secondary-code',
    defaultMessage: 'Secondary code:',
  },
  otherAccountsActiveAsOf: {
    id: 'other-account.accounts-active-as-of',
    defaultMessage: 'Accounts active as of:',
  },
  otherAccountIncludeInaccessibleAccounts: {
    id: 'other-account.include-inaccessible-accounts',
    defaultMessage: 'Include inaccessible accounts',
  },
});

@connect(state => ({
  tableAccount: extractAccount(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.account.isLoading,
  data: state.account.data,
  paging: state.account.paging,
  filterKeyword: state.account.filterKeyword,
}), (dispatch) => bindActionCreators({
  getAccountsList,
  setSelectedAccount,
  filterAccountByKeyword,
  clearAccountKeyword,
}, dispatch))
export default class Account extends Component {
  static propTypes = {
    scenarioId: PropTypes.number,
    isLoading: PropTypes.bool,
    data: PropTypes.array,
    paging: PropTypes.object,
    filterKeyword: PropTypes.string,
    filterByOrganizationId: PropTypes.bool,
    getAccountsList: PropTypes.func,
    setSelectedAccount: PropTypes.func,
    filterAccountByKeyword: PropTypes.func,
    clearAccountKeyword: PropTypes.func,
  };

  static defaultProps = {
    pageName: 'Other Account',
    filterByOrganizationId: false,
  };

  componentDidMount() {
    this.init(this.props, true);
    this.props.setSelectedAccount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging } = props;
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { filterByOrganizationId, isLoading, getAccountsList } = props;
    if (!isLoading) {
      getAccountsList(filterByOrganizationId, pageNo, pageSize, force);
    }
  }

  @autobind
  onFetchData(tableState) {
    // this.load(this.props, tableState.page + 1, tableState.pageSize);
  }

  @autobind
  setPageSize(pageSize) {
    const { paging } = this.props;
    this.load(this.props, paging.pageNo, pageSize);
  }

  @autobind
  onPageChange(page) {
    const { paging } = this.props;
    this.load(this.props, page + 1, paging.pageSize);
  }

  @autobind
  onRowClick(originalRow) {
    const { setSelectedAccount } = this.props;
    if (setSelectedAccount) {
      setSelectedAccount(originalRow);
    }
  }

  renderFilterSection() {
    return (
      <div className='other-account__filter'>
        <div className='other-account__title'>
          <FormattedMessage
            id='other-account.title'
            defaultMessage='Search: GL Account'
          />
        </div>
        <Form.Row>
          <Form.Column2>
            <Field.Input
              editMode
              value={ '001271' }
              // validator={ fields.description }
              labelIntlId='other-account.system-code'
            />
          </Form.Column2>
          <Form.Column2>
            <Field.DatePick
              editMode
              value={ '2017-12-13' }
              // values={ durationYears }
              // validator={ fields.startDate }
              labelIntlId='other-account.accounts-active-as-of'
              formNode={ this.formNode }
              // flashErrors={ flashErrors }
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <SecondaryCode
              editMode
              value={ '000153' }
              // validator={ fields.secondaryCode }
              // queryParameters={ originRowDetailId ?
              //   { budgetDetailsId: originRowDetailId, isAmountToDistribute } :
              //   { isAmountToDistribute }
              // }
              labelIntlId='other-account.primary-code'
              // flashErrors={ flashErrors }
            />
          </Form.Column2>
          <Form.Column2>
            <SecondaryCode
              editMode
              value={ '67510' }
              // validator={ fields.secondaryCode }
              // queryParameters={ originRowDetailId ?
              //   { budgetDetailsId: originRowDetailId, isAmountToDistribute } :
              //   { isAmountToDistribute }
              // }
              labelIntlId='other-account.secondary-code'
              // flashErrors={ flashErrors }
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Checkbox
              editMode
              value={ true }
              single={ true }
              // onToggle={ this.handleCalculatingBenefitsChange }
              labelIntlId='other-account.include-inaccessible-accounts'
            />
          </Form.Column4>
        </Form.Row>
      </div>
    );
  }

  render() {
    const { tableAccount, isLoading, paging, pageName } = this.props;
    const location = { pathname: window.location.pathname };
    return (
      <div className='other-account' ref={ (node) => { this.formNode = node; } }>
        { true ? null : this.renderFilterSection() }
        <Form.Separator />
        <div className='other-account__header'>
          { this.renderSearchKeyword() }
        </div>
        <div className='other-account__grid'>
          <BaseList
            pageName={ pageName }
            location={ location }
            rows={ tableAccount.rows }
            columns={ tableAccount.columns }
            selectedRow={ tableAccount.selectedRow }
            isLoading={ isLoading }
            manual={ true }
            pages={ paging.pageCount }
            page={ paging.pageNo - 1 }
            pageSize={ paging.pageSize }
            onFetchData={ this.onFetchData }
            setPageSize={ this.setPageSize }
            onPageChange={ this.onPageChange }
            onRowClick={ this.onRowClick }
            standalone
            noGroups
            noCustomizeColumns
          />
        </div>
      </div>
    );
  }

  renderSearchKeyword() {
    const { filterKeyword, filterAccountByKeyword, clearAccountKeyword } = this.props;
    return (
      <div className='other-account__keywords'>
        <div className='other-account__table-title'>
          <FormattedMessage id='other-account.table-title' defaultMessage='Results:' />
        </div>
        <SearchInput
          placeholderIntlId='other-account.table-keyword'
          inputStyleModificator='-benefits-model'
          onChangeKeyWord={ filterAccountByKeyword }
          onClearKeyWord={ clearAccountKeyword }
          keyWord={ filterKeyword }
        />
      </div>
    );
  }
}
