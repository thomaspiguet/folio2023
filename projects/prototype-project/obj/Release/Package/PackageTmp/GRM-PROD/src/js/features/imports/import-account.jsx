import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import { ScrollBox } from '../../components/general/scroll-box';
import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';

import { getImportAccountDetails } from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { extractFinancialAccount, extractStatisticalAccounts } from './selectors/imports';

import './imports.scss';
import '../../../styles/content-gradient.scss';

const titleIcon = 'position';

defineMessages({
  titleItem: {
    id: 'imports.title-item',
    defaultMessage: 'Import',
  },
  accountTitleColon: {
    id: 'imports.account-title-colon',
    defaultMessage: 'Account:',
  },
  accountsTabTitle: {
    id: 'imports.accounts-tab-title',
    defaultMessage: 'Accounts',
  },
  otherScenariosTabTitle: {
    id: 'imports.other-scenarios-tab-title',
    defaultMessage: 'Other Scenarios',
  },
  financialAccountAccount: {
    id: 'imports.financial-account-account',
    defaultMessage: 'ACCOUNT',
  },
  financialAccount: {
    id: 'imports.financial-account',
    defaultMessage: 'FINANCIAL ACCOUNT',
  },
  statisticalAccountAccount: {
    id: 'imports.statistical-account-account',
    defaultMessage: 'ACCOUNT',
  },
  statisticalAccount: {
    id: 'imports.statistical-account',
    defaultMessage: 'STATISTICAL ACCOUNT',
  },
});

@connect(state => ({
  entry: state.imports.entry,
  isLoading: state.importAccounts.isAccountDetailsLoading,
  previousScenarioId: state.imports.options.importScenarioId,
  previousImportScenarioId: state.importAccounts.options.importScenarioId,
  financialAccount: extractFinancialAccount(state),
  financialAccountItem: state.importAccounts.entry.financailAccount,
  statisticalAccount: extractStatisticalAccounts(state),
  statisticalAccountItem: state.importAccounts.entry.statisticalAccount,
}), (dispatch) => bindActionCreators({
  getImportAccountDetails,
  setTitle,
}, dispatch))
class ImportAccount extends TrackablePage {
  static propTypes = {
    importScenarioId: PropTypes.string,
    accountId: PropTypes.string,
    previousImportScenarioId: PropTypes.number,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    getImportAccountDetails: PropTypes.func,
    financialAccount: PropTypes.object,
    statisticalAccount: PropTypes.object,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    super.componentDidMount();
    this.load(this.props);
    this.onChangeProps(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.onChangeProps(props);
  }

  onChangeProps(props) {
    const { setTitle } = props;
    setTitle(this.getImportTitle(props));
  }

  load(props, pageNo, pageSize) {
    const { importScenarioId, accountId } = props;
    // if (importScenarioId === previousImportScenarioId) {
    //   return;
    // }
    props.getImportAccountDetails(importScenarioId, accountId);
  }

  getImportTitle(props) {
    const { financialAccountItem, statisticalAccountItem } = props;
    const { accountNumber: financialAccountNumber, description: financialAccountDescription } = financialAccountItem;
    const { accountNumber: statisticalAccountNumber, description: statisticalAccountDescription } = statisticalAccountItem;

    const showFinancialAccount = !isEmpty(financialAccountItem);
    const showStatisticalAccount = !isEmpty(statisticalAccountItem);

    if (showFinancialAccount) {
      return this.getTitle(financialAccountNumber, financialAccountDescription);
    } else if (showStatisticalAccount && !showFinancialAccount) {
      return this.getTitle(statisticalAccountNumber, statisticalAccountDescription);
    }
    return '';
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

  renderAccountDetails() {
    const { isLoading, financialAccount, statisticalAccount, financialAccountItem, statisticalAccountItem } = this.props;
    const { accountNumber: financialAccountNumber, description: financialAccountDescription } = financialAccountItem;
    const { accountNumber: statisticalAccountNumber, description: statisticalAccountDescription } = statisticalAccountItem;

    const showFinancialAccount = !isEmpty(financialAccountItem);
    const showStatisticalAccount = !isEmpty(statisticalAccountItem);

    return (
      <Form.Tab id='details' intlId='imports.other-scenarios-tab-title' isLoading={ isLoading }>
        <Form.Row>
          { showFinancialAccount &&
            <Form.Column2>
              <Form.Box classModifier='form__box--import-account'>
                <Form.Group classModifier='form__group--import-account'>
                  <Field small wrap noBackground={ true } value={ financialAccountNumber } labelIntlId='imports.financial-account-account' />
                </Form.Group>
                <Form.Group classModifier='form__group--import-account'>
                  <Field small wrap noBackground={ true } value={ financialAccountDescription } labelIntlId='imports.financial-account' />
                </Form.Group>
              </Form.Box>
            </Form.Column2>
          }
          { showStatisticalAccount &&
            <Form.Column2>
              <Form.Box classModifier='form__box--import-account'>
                <Form.Group classModifier='form__group--import-account'>
                  <Field small wrap noBackground={ true } value={ statisticalAccountNumber } labelIntlId='imports.statistical-account-account' />
                </Form.Group>
                <Form.Group classModifier='form__group--import-account'>
                  <Field small wrap noBackground={ true } value={ statisticalAccountDescription } labelIntlId='imports.statistical-account' />
                </Form.Group>
              </Form.Box>
            </Form.Column2>
          }
          { !showFinancialAccount && <Form.Column2 /> }
          { !showStatisticalAccount && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          { showFinancialAccount &&
            <Form.Column2>
              <Form.Grid
                rows={ financialAccount.rows }
                columns={ financialAccount.columns }
              />
            </Form.Column2>
          }
          { showStatisticalAccount &&
            <Form.Column2>
              <Form.Grid
                rows={ statisticalAccount.rows }
                columns={ statisticalAccount.columns }
              />
            </Form.Column2>
          }
          { !showFinancialAccount && <Form.Column2 /> }
          { !showStatisticalAccount && <Form.Column2 /> }
        </Form.Row>
      </Form.Tab>
    );
  }

  renderTabs() {
    return (
      <Form.Tabs active='details' hideTabsTitle={ true } >
        { this.renderAccountDetails() }
      </Form.Tabs>
    );
  }

  render() {
    const { financialAccountItem, statisticalAccountItem } = this.props;
    const { accountNumber: financialAccountNumber, description: financialAccountDescription } = financialAccountItem;
    const { accountNumber: statisticalAccountNumber, description: statisticalAccountDescription } = statisticalAccountItem;

    const showFinancialAccount = !isEmpty(financialAccountItem);
    const showStatisticalAccount = !isEmpty(statisticalAccountItem);

    return (
      <div className='imports'>
        <div className='imports__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='imports__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  { showFinancialAccount &&
                    <Form.Title
                      icon={ titleIcon }
                      intlId='imports.account-title-colon'
                      message={ this.getTitle(financialAccountNumber, financialAccountDescription) }
                    />
                  }
                  { (showStatisticalAccount && !showFinancialAccount) &&
                    <Form.Title
                      icon={ titleIcon }
                      intlId='imports.account-title-colon'
                      message={ this.getTitle(statisticalAccountNumber, statisticalAccountDescription) }
                    />
                  }
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

export default injectIntl(ImportAccount);
