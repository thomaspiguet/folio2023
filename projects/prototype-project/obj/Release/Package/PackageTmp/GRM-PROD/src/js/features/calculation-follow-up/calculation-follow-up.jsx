import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import { autobind } from 'core-decorators';

import BaseList from '../../components/general/base-list/base-list';

import { getCalculationFollowUpList } from './actions';

import { extractData } from './selectors';

import './calculation-follow-up.scss';

defineMessages({
  title: {
    id: 'calculation-follow-up.title',
    defaultMessage: 'Calculation Follow-up',
  },
});

@connect(state => ({
  table: extractData(state),
  isLoading: state.calculationFollowUp.isLoading,
  paging: state.calculationFollowUp.paging,
}), (dispatch) => bindActionCreators({
  getCalculationFollowUpList,
}, dispatch))
export default class CalculationFollowUp extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
  };

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging } = props;
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { isLoading, getCalculationFollowUpList } = props;
    if (!isLoading) {
      getCalculationFollowUpList(pageNo, pageSize, force);
    }
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

  render() {
    const { table, isLoading, paging, pageName, location } = this.props;

    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='calculation-follow-up.title'
        titleIcon='employees'
        isLoading={ isLoading }
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        noPadding
      />
    );
  }
}
