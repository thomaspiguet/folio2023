import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import { FormValidator } from '../../utils/components/form-validator';
import { ScrollBox } from '../../components/general/scroll-box';
import { popupOpen } from '../../components/general/popup/actions';
import {
  calculationDetailsOtherSectionToggle,
  calculationDetailsFinancialStructureSectionToggle,
} from './actions';
import { getCalculationFollowUpDetails } from '../../api/actions';

import Form from '../../components/general/form/form';
import FinancialStructure from '../../components/business/financial-structure/financial-structure';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import { getDigit2Options } from '../../utils/selectors/currency';
import { isZeroId } from '../../utils/utils';

import './calculation-follow-up.scss';


defineMessages({
  title: {
    id: 'calculation-follow-up.title',
    defaultMessage: 'Calculation Follow-up',
  },
  financialStructureSection: {
    id: 'calculation-follow-up.financial-section-title',
    defaultMessage: 'Financial Structure',
  },
  otherSection: {
    id: 'calculation-follow-up.other-section-title',
    defaultMessage: 'Other',
  },
});

const formOptions = {
  tabs: {
  },
  fields: {
    functionalCenters: {
      path: ['functionalCenters'],
    },
    departments: {
      path: ['departments'],
    },
    subDepartments: {
      path: ['subDepartments'],
    },
    programs: {
      path: ['programs'],
    },
    subPrograms: {
      path: ['subPrograms'],
    },
    primaryCodeGroups: {
      path: ['primaryCodeGroups'],
    },
    responsibilityCentersLevel1: {
      path: ['responsCentersLevel1'],
    },
    responsibilityCentersLevel2: {
      path: ['responsCentersLevel2'],
    },
    responsibilityCentersLevel3: {
      path: ['responsCentersLevel3'],
    },
    sites: {
      path: ['sites'],
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
    },
  },
};

@connect(state => ({
  digit2Options: getDigit2Options(state),
  isLoading: state.calculationFollowUpDetails.isLoading,
  editMode: state.calculationFollowUpDetails.editMode,
  entry: state.calculationFollowUpDetails.entry,
  prevCalculationId: state.calculationFollowUpDetails.calculationId,
  otherSectionExpanded: state.calculationFollowUpDetails.otherSectionExpanded,
  financialStructureSectionExpanded: state.calculationFollowUpDetails.financialStructureSectionExpanded,
}), (dispatch) => bindActionCreators({
  popupOpen,
  getCalculationFollowUpDetails,
  calculationDetailsOtherSectionToggle,
  calculationDetailsFinancialStructureSectionToggle,
}, dispatch))
class CalculationFollowUpDetails extends TrackablePage {
  static propTypes = {
    digit2Options: PropTypes.object,
    isLoading: PropTypes.bool,
    editMode: PropTypes.bool,
    entry: PropTypes.object,
    calculationId: PropTypes.string,
    prevCalculationId: PropTypes.string,
    otherSectionExpanded: PropTypes.bool,
    financialStructureSectionExpanded: PropTypes.bool,
    getCalculationFollowUpDetails: PropTypes.func,
    calculationDetailsOtherSectionToggle: PropTypes.func,
    calculationDetailsFinancialStructureSectionToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props, true);
    this.validator.onDidMount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.validator.onWillUnmount();
  }

  init(props, initial) {
    const { calculationId, prevCalculationId, isLoading, getCalculationFollowUpDetails } = props;
    if (calculationId === prevCalculationId || isLoading || isZeroId(calculationId)) {
      return;
    }
    getCalculationFollowUpDetails(calculationId);
  }

  render() {
    const { isLoading, editMode, entry, otherSectionExpanded, financialStructureSectionExpanded,
      calculationDetailsOtherSectionToggle, calculationDetailsFinancialStructureSectionToggle } = this.props;
    const { invalid, fields } = this.validator;
    const { flashErrors } = this.state;
    const { jobTitleGroup } = entry;

    return (
      <div className='required-attendance' ref={ (node) => { this.formNode = node; } }>
        <div className='required-attendance__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='required-attendance__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title intlId='calculation-follow-up.detail-title' />
                </Form.ActionsLeft>
              </Form.Actions>
              <Form.Section>
                <Form.Expandable
                  expand={ financialStructureSectionExpanded }
                  onToggle={ calculationDetailsFinancialStructureSectionToggle }
                  intlId='calculation-follow-up.financial-section-title'
                >
                  <FinancialStructure
                    editMode={ editMode }
                    entry={ entry }
                    validator={ this.validator }
                    allItemsModeDropDowns
                  />
                </Form.Expandable>
                <Form.Separator />
                <Form.Expandable
                  expand={ otherSectionExpanded }
                  onToggle={ calculationDetailsOtherSectionToggle }
                  intlId='calculation-follow-up.other-section-title'
                >
                  <Form.Row>
                    <Form.Column2>
                      <JobTitleGroup
                        editMode
                        disabled
                        validator={ fields.jobTitleGroup }
                        value={ jobTitleGroup }
                        multiple
                        allItemsMode
                        allItemsIntlId='dropdown-department.every'
                        flashErrors={ flashErrors }
                      />
                    </Form.Column2>
                    <Form.Column2 />
                  </Form.Row>
                </Form.Expandable>
              </Form.Section>
              <Form.FooterActions>
                { editMode && <Form.Action type='cancel' intlId='action.cancel' disabled={ isLoading } onClick={ this.onCancel } /> }
                { editMode && <Form.Action type='ok' intlId='action.ok' disabled={ isLoading } onClick={ this.onRun } validator={ this.validator } isLast /> }
              </Form.FooterActions>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(CalculationFollowUpDetails);
