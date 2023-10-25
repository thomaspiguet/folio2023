import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Departments from '../../dropdowns/departments';
import Form from '../../general/form/form';
import FunctionalCenter from '../../dropdowns/functional-center';
import PrimaryCodeGroup from '../../dropdowns/primary-code-group';
import Program from '../../dropdowns/program';
import ResponsibleCenterLevelOne from '../../dropdowns/responsible-center-level-one';
import ResponsibleCenterLevelTwo from '../../dropdowns/responsible-center-level-two';
import ResponsibleCenterLevelThree from '../../dropdowns/responsible-center-level-three';
import Site from '../../dropdowns/site';
import SubDepartments from '../../dropdowns/sub-departments';
import SubProgram from '../../dropdowns/sub-program';

import { getId } from '../../../utils/selectors/id';

defineMessages({
  primaryCodeGroupsLabel: {
    id: 'financial-structure-copy.primary-code-groups.label',
    defaultMessage: 'Primary code groups:',
  },
  primaryCodeGroupsPlaceholder: {
    id: 'financial-structure-copy.primary-code-groups.placeholder',
    defaultMessage: 'Select Primary code groups...',
  },
  functionalCenterCode: {
    id: 'financial-structure-copy.functional-centers.label',
    defaultMessage: 'Functional centers:',
  },
  functionalCenterPlaceholder: {
    id: 'financial-structure-copy.functional-centers.placeholder',
    defaultMessage: 'Select functional centers...',
  },
});

class FinancialStructure extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    entry: PropTypes.object,
    validator: PropTypes.object,
    allItemsModeDropDowns: PropTypes.bool,
  };

  static defaultProps = {
    allItemsModeDropDowns: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { editMode, entry, validator, allItemsModeDropDowns } = this.props;
    const { flashErrors } = this.state;
    const { fields } = validator;

    const {
      departments,
      primaryCodeGroups,
      programs,
      responsibilityCentersLevel1,
      responsibilityCentersLevel2,
      responsibilityCentersLevel3,
      sites,
      subDepartments,
      subPrograms,
      targetFunctionalCenter,
    } = entry;

    return (
      <div>
        <Form.Row>
          <Form.Column2>
            <Departments
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ departments }
              validator={ fields.departments }
              allItemsMode={ allItemsModeDropDowns }
            />
          </Form.Column2>
          <Form.Column2>
            <SubDepartments
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ subDepartments }
              validator={ fields.subDepartments }
              allItemsMode={ allItemsModeDropDowns }
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <Program
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ programs }
              validator={ fields.programs }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
          <Form.Column2>
            <SubProgram
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              queryParameters={ {
                ProgramIds: map(programs, getId),
              } }
              value={ subPrograms }
              validator={ fields.subPrograms }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <ResponsibleCenterLevelOne
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ responsibilityCentersLevel1 }
              validator={ fields.responsibilityCentersLevel1 }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
          <Form.Column2>
            <ResponsibleCenterLevelTwo
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ responsibilityCentersLevel2 }
              validator={ fields.responsibilityCentersLevel2 }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <ResponsibleCenterLevelThree
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ responsibilityCentersLevel3 }
              validator={ fields.responsibilityCentersLevel3 }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
          <Form.Column2>
            <Site
              editMode={ editMode }
              flashErrors={ flashErrors }
              multiple
              value={ sites }
              validator={ fields.sites }
              allItemsMode={ allItemsModeDropDowns }
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <PrimaryCodeGroup
              editMode={ editMode }
              flashErrors={ flashErrors }
              labelIntlId='financial-structure-copy.primary-code-groups.label'
              multiple
              placeholderIntlId='financial-structure-copy.primary-code-groups.placeholder'
              value={ primaryCodeGroups }
              validator={ fields.primaryCodeGroups }
              allItemsMode={ allItemsModeDropDowns }
              allItemsIntlId='dropdown-department.every'
            />
          </Form.Column2>
          <Form.Column2>
            <FunctionalCenter
              editMode={ editMode }
              flashErrors={ flashErrors }
              labelIntlId='financial-structure-copy.functional-centers.label'
              multiple
              placeholderIntlId='financial-structure-copy.functional-centers.placeholder'
              queryParameters={ {
                departments,
                subDepartments,
                programs,
                subPrograms,
                primaryCodeGroups,
                responsibilityCentersLevel1,
                responsibilityCentersLevel2,
                responsibilityCentersLevel3,
                sites,
              } }
              value={ targetFunctionalCenter }
              validator={ fields.targetFunctionalCenter }
              allItemsMode={ allItemsModeDropDowns }
            />
          </Form.Column2>
        </Form.Row>
      </div>
    );
  }
}

export default injectIntl(FinancialStructure);
