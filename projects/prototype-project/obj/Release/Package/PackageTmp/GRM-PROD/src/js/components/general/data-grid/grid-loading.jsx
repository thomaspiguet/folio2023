import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BrowserDetection from 'react-browser-detection';

const browserHandler = {
  ie: () => <circle className='grid-loading__ie-path' cx='12' cy='12' r='4.8' fill='none' />,
  default: () => <circle className='grid-loading__path' cx='12' cy='12' r='4.8' fill='none' />,
};

export default class GridLoading extends PureComponent {
  static propTypes = {
    noLoader: PropTypes.bool,
  };

  render() {
    return (
      <div className='grid-loading'>
        <div className='grid-loading__loader'>
          { !this.props.noLoader &&
            <svg className='grid-loading__circular'>
              <BrowserDetection>
                { browserHandler }
              </BrowserDetection>
            </svg>
          }
        </div>
      </div>
    );
  }
}
