import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleAdvancedSearch, clearActionAdvancedSearch } from './actions';
import SearchAction from '../../components/general/search/search-action';

export default connect(state => ({
  show: state.budgetRequests.showAdvancedSearch,
  have: state.budgetRequests.haveAdvancedSearch,
}), (dispatch) => bindActionCreators({
  toggle: toggleAdvancedSearch,
  clear: clearActionAdvancedSearch,
}, dispatch))(SearchAction);
