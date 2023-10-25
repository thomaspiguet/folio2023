import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';

import { setRoute } from './actions';

import './breadcrumbs.scss';

const BreadcrumbItem = ({ item, intl, isLast }) => {
  let message = item.title;
  if (!message) {
    message = item.route.intlId ? intl.formatMessage({ id: item.route.intlId }) : '';
  }
  return (
    <div className='breadcrumbs__item'>
      {isLast ?
        <div className='breadcrumbs__active'> {message } </div>
        :
        <Link className='breadcrumbs__link' to={ item.path }>
          {message}
        </Link>
      }
    </div>
  );
};

@connect(state => ({
  items: state.breadcrumbs.items,
  scenarioId: state.scenario.selectedScenario.scenarioId,
}), (dispatch) => bindActionCreators({
  setRoute,
}, dispatch))
class Breadcrumbs extends PureComponent {

  componentDidMount() {
    const { location, history, setRoute, scenarioId } = this.props;
    this.unlisten = history.listen(this.onChangeRoute);
    const { pathname } = location;
    setRoute(pathname, scenarioId);
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }
  }

  @autobind
  onChangeRoute(location, action) {
    const { setRoute, scenarioId } = this.props;
    const { pathname } = location;
    setRoute(pathname, scenarioId);
  }

  componentWillReceiveProps(props) {
  }

  render() {
    const { items, intl } = this.props;
    return (
      <div className='breadcrumbs' >
        { map(items, (item, index, coll) => (<BreadcrumbItem item={ item } key={ item.path } intl={ intl } isLast={ index === (coll.length - 1) } />)) }
      </div>
    );
  }
}

class BreadcrumbsRoute extends PureComponent {
  render() {
    return (
      <Route path='/:path' component={ injectIntl(Breadcrumbs) } />
    );
  }
}

export default BreadcrumbsRoute;
