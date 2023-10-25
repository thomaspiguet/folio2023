import { defineMessages } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setReferenceSearchKeyWord } from './actions/required-attendances';

import SearchSimple from '../../components/general/search/search-simple';

defineMessages({
  search: {
    id: 'required-attendance.search-simple.placeholder',
    defaultMessage: 'Search by reference...',
  },
});

export default connect(state => ({
  keyWord: state.requiredAttendances.referenceSearchKeyWord,
  placeholderIntlId: 'required-attendance.search-simple.placeholder',
}),
(dispatch) => bindActionCreators({
  search: setReferenceSearchKeyWord,
}, dispatch))(SearchSimple);
