import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleAdvancedSearch, clearActionAdvancedSearch } from './actions/required-attendances';
import SearchAction from '../../components/general/search/search-action';

export default connect(state => ({
  show: state.requiredAttendances.showAdvancedSearch,
  have: state.requiredAttendances.haveAdvancedSearch,
}), (dispatch) => bindActionCreators({
  toggle: toggleAdvancedSearch,
  clear: clearActionAdvancedSearch,
}, dispatch))(SearchAction);
