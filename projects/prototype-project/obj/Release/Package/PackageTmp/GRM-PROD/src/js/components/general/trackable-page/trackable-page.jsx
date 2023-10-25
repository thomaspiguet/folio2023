import { Component } from 'react';
import PropTypes from 'prop-types';
import { AppInsights } from 'applicationinsights-js';

export default class TrackablePage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    pageName: PropTypes.string.isRequired,
  };

  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
  }

  componentDidMount() {
    try {
      AppInsights.startTrackPage(this.props.pageName);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  }

  componentWillUnmount() {
    try {
      AppInsights.stopTrackPage(
        this.props.pageName,
        this.props.location.pathname
        // dimension dictionary (optional)
        // { prop1: 'prop1', prop2: 'prop2' },
        // metric dictionary (optional)
        // { measurement1: 1 }
      );
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  }

  render() {
    return null;
  }
}
