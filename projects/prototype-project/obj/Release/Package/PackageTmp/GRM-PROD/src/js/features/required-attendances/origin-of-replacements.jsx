import React, { PureComponent } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';

import Form from '../../components/general/form/form';

import { getOriginReplacements } from '../../api/actions';

@connect(state => ({
  financialYearId: state.scenario.selectedScenario.yearId,
}), (dispatch) => bindActionCreators({
  getOriginReplacements,
}, dispatch))
export class OriginReplacements extends PureComponent {
  static propTypes = {
    expand: PropTypes.bool,
    toggleExpand: PropTypes.func,
    editMode: PropTypes.bool,
    isLoading: PropTypes.bool,
    entry: PropTypes.object,
    originId: PropTypes.number,
    originType: PropTypes.string,
    originReplacements: PropTypes.object,
    getOriginReplacements: PropTypes.func,
    financialYearId: PropTypes.number,
  };

  static defaultProps = {
    editMode: false,
  };

  @autobind
  requestOriginReplacements() {
    const { originId, originType, entry, financialYearId, getOriginReplacements } = this.props;
    const {
      functionalCenter,
      jobType,
      jobTitle,
      jobTitleGroup,
    } = entry;

    const requestParameters = {
      originId,
      originType,
      financialYearId,
      jobTypeId: jobType ? jobType.id : null,
      functionalCenterId: functionalCenter ? functionalCenter.id : null,
    };
    if (jobTitle && jobTitle.id) {
      requestParameters.jobTitleId = jobTitle.id;
    }
    if (jobTitleGroup && jobTitleGroup.id) {
      requestParameters.jobTitleGroupId = jobTitleGroup.id;
    }
    getOriginReplacements(requestParameters);
  }

  @autobind
  toggleOriginOfReplacementsExpand() {
    const { expand, toggleExpand, isLoading } = this.props;
    if (!expand && !isLoading) {
      this.requestOriginReplacements();
    }
    toggleExpand();
  }

  render() {
    const { originReplacements, expand, isLoading } = this.props;

    const toggleClassNames = classNames('required-attendance__toggle-btn', {
      'required-attendance__toggle-btn--expanded': expand,
    });

    return (
      <div>
        <Form.Row>
          <Form.Column4>
            <div
              className={ toggleClassNames }
              onClick={ this.toggleOriginOfReplacementsExpand }
            >
              {
                expand ?
                  <FormattedMessage
                    id='required-attendance.hide-origin-of-replacements-toggle-button'
                    defaultMessage='Hide origin of replacements'
                  />
                  :
                  <FormattedMessage
                    id='required-attendance.show-origin-of-replacements-toggle-button'
                    defaultMessage='Show origin of replacements'
                  />
              }
            </div>
          </Form.Column4>
        </Form.Row>
        <AnimateHeight
          contentClassName='form__row'
          height={ expand ? 'auto' : 5 }
          duration={ 500 }
        >
          <Form.Column4>
            <Form.Grid
              rows={ originReplacements.rows }
              columns={ originReplacements.columns }
              isLoading={ isLoading }
            />
          </Form.Column4>
        </AnimateHeight>
      </div>
    );
  }
}
