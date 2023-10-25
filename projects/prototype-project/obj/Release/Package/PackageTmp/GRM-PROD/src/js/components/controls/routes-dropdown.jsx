import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { each, eachRight, isUndefined } from 'lodash';

import { injectIntl } from 'react-intl';
import { addScenarioIdToRoute, addScenarioAndIdToRoute } from '../../utils/utils';
import { getHistory } from '../../features/app/app';

import Dropdown from './dropdown';
import { DropDownOption } from './dropdown-option';

import './routes-dropdown.scss';

export const DEFAULT_OPTIONS_LIST_VERTICAL_SHIFT = 0;
export const DEFAULT_OPTIONS_LIST_HORIZONTAL_SHIFT = 0;

export const BUTTON_TOP_MENU_OPTIONS_LIST_VERTICAL_SHIFT = 2;
export const BUTTON_TOP_MENU_OPTIONS_LIST_HORIZONTAL_SHIFT = 1;

export const BUTTON_IN_GRID_OPTIONS_LIST_VERTICAL_SHIFT = -7;


@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  history: getHistory(),
}), (dispatch) => bindActionCreators({}, dispatch))
class RoutesDropDown extends PureComponent {
  static propTypes = {
    editMode: PropTypes.bool.isRequired,
    scenarioId: PropTypes.number,
    history: PropTypes.object,
    values: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    selectedRouteItemId: PropTypes.number,
    optionsListVerticalShift: PropTypes.number,
    optionsListHorizontalShift: PropTypes.number,
    valueClass: PropTypes.string,
    optionClass: PropTypes.string,
    optionsClass: PropTypes.string,
  };

  static defaultProps = {
    selectedRouteItemId: undefined,
    valueClass: 'routes-dropdown__ellipsis',
    optionClass: 'routes-dropdown__option',
    optionsClass: 'routes-dropdown__options',
    optionsListVerticalShift: DEFAULT_OPTIONS_LIST_VERTICAL_SHIFT,
    optionsListHorizontalShift: DEFAULT_OPTIONS_LIST_HORIZONTAL_SHIFT,
  };

  @autobind
  onSelectItem(title, value) {
    const { editMode, scenarioId, history, selectedRouteItemId } = this.props;

    if (!editMode && value && value.active && value.route) {
      if (selectedRouteItemId) {
        history.push(addScenarioAndIdToRoute(value.route, scenarioId, selectedRouteItemId));
      } else {
        history.push(addScenarioIdToRoute(value.route, scenarioId));
      }
    }
  }

  renderDropDownOptions(props, state) {
    const { values, sortDescending, optionClass, intl } = props;
    const { value: currentValue, currentOpt } = state;

    const optionsList = [];

    const doEach = sortDescending ? eachRight : each;

    doEach(values, (opt, index) => {
      const selected = !isUndefined(opt) && opt.id === props.value && props.value.id;
      const title = (opt && opt.intlId ? intl.formatMessage({ id: opt.intlId }) : '');
      const option = (
        <DropDownOption
          selected={ selected }
          className={ optionClass }
          value={ index }
          index={ opt.id }
          title={ title }
          key={ opt.id }
          opt={ opt }
          setItem={ () => {} }
          exit={ props.onClose }
          currentValue={ currentValue }
          currentOpt={ currentOpt }
          onChange={ props.onChange }
          pageSize={ values.length }
          showIcon
        />
      );
      optionsList.push(option);
    });

    return optionsList;
  }

  render() {
    const {
      editMode,
      values,
      valueClass,
      optionClass,
      optionsClass,
      optionsListVerticalShift,
      optionsListHorizontalShift,
    } = this.props;

    return (
      <Dropdown
        valueClass={ valueClass }
        optionClass={ optionClass }
        optionsClass={ optionsClass }
        values={ values }
        onChange={ this.onSelectItem }
        disabled={ editMode }
        renderOptions={ this.renderDropDownOptions }
        optionsListVerticalShift={ optionsListVerticalShift }
        optionsListHorizontalShift={ optionsListHorizontalShift }
        disabledScrollBox
        hideTitle
        hideValue
        showIcon
      />
    );
  }
}

export default injectIntl(RoutesDropDown);
