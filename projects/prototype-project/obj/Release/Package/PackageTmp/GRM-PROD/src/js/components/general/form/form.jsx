import React, { Component, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { debounce, filter, find, isEqual, isNull, map } from 'lodash';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';

import './form.scss';

import GridLoading from '../data-grid/grid-loading';
import DataGridScrollable from '../data-grid/data-grid-scorllable';
import { focusKeyDown } from '../../../utils/components/keyboard';

defineMessages({
  edit: {
    id: 'action.edit',
    defaultMessage: 'EDIT',
  },
  add: {
    id: 'action.add',
    defaultMessage: 'ADD',
  },
  save: {
    id: 'action.save',
    defaultMessage: 'SAVE',
  },
  cancel: {
    id: 'action.cancel',
    defaultMessage: 'CANCEL',
  },
  restore: {
    id: 'action.restore',
    defaultMessage: 'INITIALIZE',
  },
  delete: {
    id: 'action.delete',
    defaultMessage: 'DELETE',
  },
  clear: {
    id: 'action.clear',
    defaultMessage: 'CLEAR',
  },
  search: {
    id: 'action.search',
    defaultMessage: 'SEARCH',
  },
  query: {
    id: 'action.query',
    defaultMessage: 'QUERY',
  },
  copy: {
    id: 'action.copy',
    defaultMessage: 'COPY',
  },
  ok: {
    id: 'action.ok',
    defaultMessage: 'OK',
  },
});

export default class Form extends PureComponent {
  render() {
    const { invalid, flashErrors, editMode, className } = this.props;
    return (
      <div className={ classNames('form', {
        'form--invalid': invalid,
        'form--flash': flashErrors,
        'form--edit': editMode,
      }, className) }
      >
        { this.props.children }
      </div>
    );
  }
}

Form.Actions = (props) => {
  return (
    <div className='form__actions'>
      { props.children }
    </div>
  );
};

Form.FooterActions = (props) => {
  const { shifted, className } = props;
  return (
    <div className={ classNames('form__footer-actions', {
      'form__footer-actions--shifted': shifted,
    }, className) }
    >
      { props.children }
    </div>
  );
};

Form.Box = (props) => {
  return (
    <div className={ classNames('form__box', props.classModifier) }>
      { props.children }
    </div>
  );
};

Form.Chain = (props) => {
  const { children } = props;
  let items = [];

  if (!children) return null;

  if (children.length) {
    items = children;
  } else {
    items.push(children);
  }

  return (
    <div className={ classNames('form__chain', props.classModifier) }>
      { items.map((item, idx) => {
        if (!item) {
          return null;
        }
        const isLast = (idx === item.length - 1);
        return (
          <div
            key={ idx } // eslint-disable-line react/no-array-index-key
            className={ classNames('form__chain-item', { 'form__chain-item--last': isLast }) }
          >
            { item }
          </div>
        );
      }) }
    </div>
  );
};

Form.Group = (props) => {
  return (
    <div className={ classNames('form__group', props.classModifier) }>
      { props.children }
    </div>
  );
};

Form.ActionsLeft = (props) => {
  return (
    <div className='form__actions-left'>
      { props.children }
    </div>
  );
};

Form.ActionsRight = (props) => {
  return (
    <div className='form__actions-right'>
      { props.children }
    </div>
  );
};

Form.Title = injectIntl((props) => {
  const { intl, message, intlId, intlValues, icon } = props;
  return (
    <div className={ classNames('form__title', `form__title--${ icon }`) }>
      { intlId && <span>{ intl.formatMessage({ id: intlId }, intlValues) }</span> }
      { message && <span> { message } </span> }
    </div>
  );
});

Form.InfoTitle = injectIntl((props) => {
  const { intl, message, intlId, intlValues } = props;
  return (
    <div className='form__info-title'>
      { intlId && <span>{ intl.formatMessage({ id: intlId }, intlValues) }</span> }
      { message && <span> { message } </span> }
    </div>
  );
});

class Action extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouse: false,
    };
  }

  @autobind
  onKeyDown(e) {
    const { onClick, validator, isLast } = this.props;
    focusKeyDown(e, { onTab: (validator && isLast) ? validator.setFirstFocus : null, onEnter: onClick });
  }

  @autobind
  onMouseDown(e) {
    this.setState({ mouse: true });
  }

  @autobind
  onMouseUp(e) {
    this.setState({ mouse: false });
  }

  render() {
    const { intl, children, intlId, intlValues, type, onClick, disabled } = this.props;
    const { mouse } = this.state;
    return (
      <div
        className={ classNames('form__action', `form__action--${ type }`, {
          'form__action--disabled': disabled,
          'form__action--mouse': mouse,
        }) }
        onClick={ disabled ? null : onClick }
        onKeyDown={ disabled ? null : this.onKeyDown }
        tabIndex={ disabled ? null : '0' }
        onMouseDown={ this.onMouseDown }
        onMouseUp={ this.onMouseUp }
      >
        {intlId && <span>{intl.formatMessage({ id: intlId }, intlValues)}</span>}
        {children && <span>{children}</span>}
      </div>
    );
  }
}

Form.Action = injectIntl(Action);

class FormTabs extends Component { // eslint-disable-line react/no-multi-comp

  constructor(props) {
    super(props);
    const { active } = props;
    this.state = { active };
  }

  @autobind
  onTabClick(active) {
    this.setState({ active });
  }

  componentDidUpdate() {
    const { validator } = this.props;
    if (validator && validator.firstNode !== this.firstNode) {
      validator.setFirstFocus();
      this.firstNode = validator.firstNode;
    }
  }

  render() {
    const { children, intl, hideTabsTitle, validator, editMode } = this.props;
    let { active } = this.state;

    const tabs = filter([].concat(children), (item) => !isNull(item));
    let tab = find(tabs, ({ props: { id, isHidden } }) => (id === active && !isHidden));
    if (!tab) {
      tab = find(tabs, ({ props: { isHidden } }) => (!isHidden));
      if (tab) {
        active = tab.props.id;
      }
    }
    let activeItem = null;
    const headers = map(tabs, (item) => {
      if (!item) {
        return null;
      }
      const { isHidden, id, intlId, intlValues, invalid, flashErrors, isLoading } = item.props;
      if (isHidden) {
        return null;
      }
      const isActive = id === active;
      if (isActive) {
        activeItem = item;
      }
      return (
        <div
          className={ classNames('form-tabs__header', {
            'form-tabs__header--active': isActive,
            'form-tabs__header--invalid': invalid && !isLoading,
            'form-tabs__header--flash': flashErrors && invalid && !isLoading,
          }) }
          key={ id }
          onClick={ this.onTabClick.bind(this, id) }
          ref={ (editMode && isActive && validator) ? validator.onRefFirstNode : null }
          tabIndex={ (editMode && isActive) ? '0' : null }
        >
          { intl.formatMessage({ id: intlId }, intlValues) }
        </div>
      );
    });

    return (
      <div className='form__tabs form-tabs'>
        <div className='form-tabs__headers'>
          { !hideTabsTitle && headers }
        </div>
        <div className='form-tabs__body'>
          { activeItem }
        </div>
      </div>
    );
  }
}

Form.Tabs = injectIntl(FormTabs);

Form.Tab = (props) => {
  const { children, isLoading, classModifier, invalid, flashErrors } = props;
  return (
    <div className={ classNames('form__tab', classModifier, {
      'form__tab--invalid': invalid && !isLoading,
      'form__tab--flash': flashErrors && invalid && !isLoading,
    }) }
    >
      { children }
      { isLoading && <div className='form__tab-loader'><GridLoading /></div> }
    </div>
  );
};

Form.Row = (props) => {
  const { children, single, noTopMargin, halfTopMargin, flexEnd } = props;
  return (
    <div
      className={ classNames('form__row', {
        'form__row--single': single,
        'form__row--no-top-margin': noTopMargin,
        'form__row--half-top-margin': halfTopMargin,
        'form__row--flex-end': flexEnd,
      }) }
    >
      { children }
    </div>
  );
};

function columnClassNames(props, name, columns) {
  const { bottom, noLeftPadding, noTitle, noPadding, marginBottom, withTitle, className } = props;
  return classNames('form__column', name, {
    'form__column--bottom': bottom,
    'form__column--no-left-padding': noLeftPadding,
    'form__column--no-title': noTitle,
    'form__column--no-padding': noPadding,
    'form__column--margin-bottom': marginBottom,
    'form__column--with-title': withTitle,
    'form__column--column2': columns === 2,
    'form__column--column3': columns === 3,
    'form__column--column4': columns === 4,
  }, className);
}

Form.Column = (props) => {
  const { children, columns } = props;
  return (
    <div className={ columnClassNames(props, undefined, columns) }>
      { children }
    </div>
  );
};

Form.Column2 = (props) => {
  const { children } = props;
  return (
    <div className={ columnClassNames(props, 'form__column--column2') }>
      { children }
    </div>
  );
};

Form.Column3 = (props) => {
  const { children } = props;
  return (
    <div className={ columnClassNames(props, 'form__column--column3') }>
      { children }
    </div>
  );
};

Form.Column4 = (props) => {
  const { children } = props;
  return (
    <div className={ columnClassNames(props, 'form__column--column4') }>
      { children }
    </div>
  );
};

Form.Column33 = (props) => {
  const { children } = props;
  return (
    <div className={ columnClassNames(props, 'form__column--column33') }>
      { children }
    </div>
  );
};

Form.Column66 = (props) => {
  const { children } = props;
  return (
    <div className={ columnClassNames(props, 'form__column--column66') }>
      { children }
    </div>
  );
};

Form.Separator = (props) => {
  const { children } = props;
  return (
    <div className='form__separator'>
      { children }
    </div>
  );
};

Form.Grid = class Form extends PureComponent {
  static defaultProps = {
    canAddRow: true,
    canRemoveRow: true,
    noNoData: true,
  };

  @autobind
  onClick() {
    const { validator, onAddRow } = this.props;
    const handler = onAddRow || validator.onAddRow;
    if (handler) {
      handler();
    }
  }

  @autobind
  onKeyDown(e) {
    focusKeyDown(e, { onEnter: this.onClick });
  }

  componentWillReceiveProps(props) {
    const { onChangeValue, editMode } = props;
    if (editMode && onChangeValue && !isEqual(props.rows, this.props.rows)) {
      onChangeValue(props.rows, this.props.rows);
    }
  }

  @autobind
  handleOnChangeChell() {
    const { onChange } = this.props;
    if (onChange) {
      onChange();
    }
  }

  onChangeCell = debounce(this.handleOnChangeChell, 1200);

  render() {
    const { editMode, validator, canAddRow, pageSize } = this.props;
    return (
      <div className='form__grid'>
        <DataGridScrollable
          { ...this.props }
          noPadding
          fill
          noPaging
          noThrottle
          pageSize={ pageSize }
          validator={ validator }
          onChangeCell={ this.onChangeCell }
        />
        {editMode && validator && canAddRow && (
          <div className='form__actions form__actions--bottom'>
            <div className='form__actions-left'>
              <div
                className='form__action form__action--add'
                onClick={ this.onClick }
                tabIndex='0'
                onKeyDown={ this.onKeyDown }
              >
                <FormattedMessage id='form-action.add' defaultMessage='ADD' />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

Form.GridWithPaging = (props) => {
  return (
    <DataGridScrollable
      { ...props }
    />
  );
};

Form.Expandable = injectIntl((props) => {
  const { expand, children, intl, intlId, intlValues, message, onToggle } = props;
  return (
    <div className='form__expandable'>
      <div
        className={ classNames('form__expandable-header', {
          'form__expandable-header--expanded': expand,
        }) }
        onClick={ onToggle }
      >
        { intlId && <span>{ intl.formatMessage({ id: intlId }, intlValues) }</span> }
        { message && <span> { message } </span> }
      </div>
      <AnimateHeight
        contentClassName='form__expandable-content'
        height={ expand ? 'auto' : 0 }
        duration={ 500 }
      >
        { children }
      </AnimateHeight>
    </div>
  );
});

Form.Section = injectIntl((props) => {
  const { children, intl, intlId, intlValues, message } = props;
  return (
    <div className='form__section'>
      <div className={ classNames('form__section-header', { 'form__section-header--empty': !intlId && !message }) }>
        { intlId && <span>{ intl.formatMessage({ id: intlId }, intlValues) }</span> }
        { message && <span> { message } </span> }
      </div>
      <div className='form__section-content'>
        { children }
      </div>
    </div>
  );
});

Form.SectionTitle = injectIntl((props) => {
  const { intl, message, intlId, intlValues } = props;
  return (
    <div className='form__section-title'>
      { intlId && <span>{ intl.formatMessage({ id: intlId }, intlValues) }</span> }
      { message && <span> { message } </span> }
    </div>
  );
});

