import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
// import DashboardChart from '../../components/dashboard/dashboard-chart';
import DashboardTable from './dashboard-table';
import LeftSideGradient from '../../components/general/side-menu/left-side-gradient';

import { selectSideMenu } from '../../components/general/side-menu/actions';

import './dashboard.scss';

@connect(state => ({
  sideMenuExpanded: state.sideMenu.menuExpanded,
}), (dispatch) => bindActionCreators({
  selectSideMenu,
}, dispatch))
export default class Dashboard extends TrackablePage {

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init() {
    this.props.selectSideMenu('dashboard');
  }


  render() {
    const contentClassName = classNames('dashboard__content', { 'dashboard__content--collapsed-sidebar': !this.props.sideMenuExpanded });
    // const chartClassName = classNames('dashboard__chart', { 'dashboard__chart--collapsed-sidebar': !this.props.sideMenuExpanded });
    return (
      <div className='dashboard'>
        <LeftSideGradient parentViewClassName='dashboard__gradient' />
        <div className={ contentClassName }>
          <DashboardTable>
            <div className='dashboard__title'>
              <FormattedMessage id='dashboard.title' defaultMessage='Dashboard' />
            </div>
            {/* <div className={ chartClassName }> */}
            {/* <DashboardChart /> */}
            {/* </div> */}
          </DashboardTable>
        </div>
      </div>
    );
  }
}

