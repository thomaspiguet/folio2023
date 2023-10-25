import { defineMessages } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setSearchKeyWord } from './actions';

import SearchSimple from '../../components/general/search/search-simple';

defineMessages({
  search: {
    id: 'budget-request.search-simple.placeholder',
    defaultMessage: 'Search by request number...',
  },
});

export default connect(state => ({
  keyWord: state.budgetRequests.searchKeyword,
  placeholderIntlId: 'budget-request.search-simple.placeholder',
}),
(dispatch) => bindActionCreators({
  search: setSearchKeyWord,
}, dispatch))(SearchSimple);
