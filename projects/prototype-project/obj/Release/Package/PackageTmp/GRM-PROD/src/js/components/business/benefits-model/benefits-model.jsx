import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';

import SearchInput from '../../controls/search-input';

import BaseList from '../../general/base-list/base-list';
import { getBenefitsModel } from '../../../api/actions';
import { extractModel, extractDistribution } from './selectors';

import DataGridScrollable from '../../general/data-grid/data-grid-scorllable';

import {
  setSelectedModel,
  filterBenefitsModelByKeyword,
  clearBenefitsModelKeyword,
} from './actions';

import './benefits-model.scss';

defineMessages({
  benefitsTitle: {
    id: 'benefits-model.title',
    defaultMessage: 'Search: Distribution Model',
  },
  benefitsTableTitle: {
    id: 'benefits-model.table-title',
    defaultMessage: 'Results:',
  },
  benefitsTableKeyword: {
    id: 'benefits-model.table-keyword',
    defaultMessage: 'Keyword',
  },
});

@connect(state => ({
  tableModel: extractModel(state),
  tableDistribution: extractDistribution(state),
  financialYearId: state.scenario.selectedScenario.yearId,
  previousFinancialYearId: state.benefitsModel.options.financialYearId,
  isLoading: state.benefitsModel.isLoading,
  data: state.benefitsModel.data,
  paging: state.benefitsModel.paging,
  searchKeyword: state.benefitsModel.searchKeyword,
  previousSearchKeyword: state.benefitsModel.options.searchKeyword,
}), (dispatch) => bindActionCreators({
  getBenefitsModel,
  setSelectedModel,
  filterBenefitsModelByKeyword,
  clearBenefitsModelKeyword,
}, dispatch))
export default class BenefitsModel extends Component {
  static defaultProps = {
    pageName: 'Benefits model',
    financialYearId: PropTypes.number,
    previousFinancialYearId: PropTypes.number,
    isLoading: PropTypes.bool,
    data: PropTypes.array,
    paging: PropTypes.object,
    searchKeyword: PropTypes.string,
    previousSearchKeyword: PropTypes.string,
    getBenefitsModel: PropTypes.func,
    setSelectedModel: PropTypes.func,
    filterBenefitsModelByKeyword: PropTypes.func,
    clearBenefitsModelKeyword: PropTypes.func,
  };

  componentDidMount() {
    this.init(this.props);
    this.props.setSelectedModel();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { financialYearId, previousFinancialYearId, searchKeyword, previousSearchKeyword, isLoading, paging } = props;

    if (!isEqual(
      { financialYearId, searchKeyword },
      { financialYearId: previousFinancialYearId, searchKeyword: previousSearchKeyword })
    ) {
      this.load(props, paging.pageNo, paging.pageSize, !isLoading);
    }
  }

  load(props, pageNo, pageSize, force) {
    const { financialYearId, searchKeyword, paging, isLoading, data, getBenefitsModel } = props;
    const newQuery = { pageNo, pageSize };
    const oldQuery = { pageNo: paging.pageNo, pageSize: paging.pageSize };
    if ((data || isLoading) && (isEqual(newQuery, oldQuery) && !force)) {
      return;
    }
    getBenefitsModel(financialYearId, searchKeyword, pageNo, pageSize);
  }

  @autobind
  onFetchData(tableState) {
    this.load(this.props, tableState.page + 1, tableState.pageSize);
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
    const { setSelectedModel } = this.props;
    if (setSelectedModel) {
      setSelectedModel(originalRow);
    }
  }

  render() {
    const { tableModel, tableDistribution, isLoading, paging, pageName } = this.props;
    const location = { pathname: window.location.pathname };
    return (
      <div className='benefits-model'>
        <div className='benefits-model__title'>
          <FormattedMessage
            id='benefits-model.title'
            defaultMessage='Search: Distribution Model'
          />
        </div>
        <div className='benefits-model__header'>
          { this.renderSearchKeyword() }
        </div>
        <div className='benefits-model__grid'>
          <div className='benefits-model__grid--left'>
            <BaseList
              pageName={ pageName }
              location={ location }
              rows={ tableModel.rows }
              columns={ tableModel.columns }
              selectedRow={ tableModel.selectedRow }
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
          <div className='benefits-model__grid--right'>
            <DataGridScrollable
              rows={ tableDistribution.rows }
              columns={ tableDistribution.columns }
              standalone
              noPaging
              smokyWhiteBackground
            />
          </div>
        </div>
      </div>
    );
  }

  renderSearchKeyword() {
    const { searchKeyword, filterBenefitsModelByKeyword, clearBenefitsModelKeyword } = this.props;
    return (
      <div className='benefits-model__keywords'>
        <div className='benefits-model__table-title'>
          <FormattedMessage id='benefits-model.table-title' defaultMessage='Results:' />
        </div>
        <SearchInput
          placeholderIntlId='benefits-model.table-keyword'
          inputStyleModificator='-benefits-model'
          onChangeKeyWord={ filterBenefitsModelByKeyword }
          onClearKeyWord={ clearBenefitsModelKeyword }
          keyWord={ searchKeyword }
        />
      </div>
    );
  }
}
