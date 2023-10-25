import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Field from '../../components/controls/field';
import Form from '../../components/general/form/form';

import FunctionalCenter from '../../components/dropdowns/functional-center';
import JobStatus from '../../components/dropdowns/job-status';
import JobTitle from '../../components/dropdowns/job-title';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import JobTypeMultiple from '../../components/dropdowns/job-type-multiple';

import SearchAdvanced from '../../components/general/search/search-advanced';

import { setSearchEntry, applyAdvancedSearch, clearAdvancedSearch } from './actions/required-attendances';
import { FormValidator } from '../../utils/components/form-validator';
import { popupOpen } from '../../components/general/popup/actions';
import { getDigit2Options } from '../../utils/selectors/currency';

const formOptions = {
  tabs: {
  },
  fields: {
    functionalCenter: {
      path: ['functionalCenter'],
      metadata: 'FunctionalCenterIds',
    },
    jobStatus: {
      path: ['jobStatus'],
      metadata: 'JobStatusIds',
    },
    jobTitle: {
      path: ['jobTitle'],
      metadata: 'JobTitleIds',
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
      metadata: 'JobTitleGroupIds',
    },
    jobType: {
      path: ['jobType'],
      metadata: 'JobTypeIds',
    },
    description: {
      path: ['description'],
      metadata: 'Description',
    },
  },
};

@connect(state => ({
  entry: state.requiredAttendances.advancedSearch,
  show: state.requiredAttendances.showAdvancedSearch,
  metadata: state.requiredAttendances.listMetadata,
  digit2Options: getDigit2Options(state),
}), (dispatch) => bindActionCreators({
  popupOpen,
  setEntry: setSearchEntry,
  apply: applyAdvancedSearch,
  clear: clearAdvancedSearch,
}, dispatch))
class SearchAdvancedRequiredAttendance extends PureComponent {
  static propTypes = {
    entry: PropTypes.object,
    editMode: PropTypes.bool,
    show: PropTypes.bool,
    metadata: PropTypes.object,
    digit2Options: PropTypes.object,
    validationErrors: PropTypes.object,
    apply: PropTypes.func,
    clear: PropTypes.func,
    popupOpen: PropTypes.func,
  };

  static defaultProps = {
    editMode: true,
    validationErrors: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { editMode, metadata, validationErrors, entry } = props;
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
  }

  render() {
    const { fields } = this.validator;
    const {
      show,
      clear,
      apply,
      entry,
    } = this.props;
    const {
      functionalCenter,
      jobStatus,
      jobTitleGroup,
      jobTitle,
      jobType,
      description,
    } = entry;
    return (
      <SearchAdvanced { ...{ show, clear, apply } } >
        <Form.Row single>
          <Form.Column>
            <FunctionalCenter
              editMode
              value={ functionalCenter }
              validator={ fields.functionalCenter }
              multiple
              labelIntlId='required-attendance.functional-center-code'
              placeholderIntlId='required-attendance.functional-center-placeholder'
            />
          </Form.Column>
          <Form.Column>
            <JobTitle
              editMode
              value={ jobTitle }
              validator={ fields.jobTitle }
              multiple
            />
          </Form.Column>
          <Form.Column>
            <JobTitleGroup
              editMode
              value={ jobTitleGroup }
              validator={ fields.jobTitleGroup }
              multiple
            />
          </Form.Column>
          <Form.Column>
            <JobStatus
              editMode
              value={ jobStatus }
              validator={ fields.jobStatus }
              multiple
            />
          </Form.Column>
        </Form.Row>
        <Form.Row single>
          <Form.Column2>
            <JobTypeMultiple
              editMode
              value={ jobType }
              validator={ fields.jobType }
              multiple
            />
          </Form.Column2>
          <Form.Column2>
            <Field.Input
              editMode
              labelIntlId='required-attendance.detail-reference-description'
              placeholderIntlId='required-attendance.description-placeholder'
              validator={ fields.description }
              value={ description }
            />
          </Form.Column2>
        </Form.Row>
      </SearchAdvanced>
    );
  }
}

export default injectIntl(SearchAdvancedRequiredAttendance);
