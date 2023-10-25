import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NoData from './data-grid-no-data';
import GridLoading from './grid-loading';

export class TbodyWithLoader extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.any,
    children: PropTypes.any,
    noData: PropTypes.bool,
    noNoData: PropTypes.bool,
    noLoader: PropTypes.bool,
    customMessageIntlId: PropTypes.string,
  };

  render() {
    const { isLoading, noData, noLoader, customMessageIntlId, noNoData, children, style } = this.props;
    return (
      <div className='rt-tbody' style={ style }>
        { isLoading ? <GridLoading noLoader={ noLoader } />
          : ((noData && !noNoData) ? <NoData customMessageIntlId={ customMessageIntlId } /> : children) }
      </div>
    );
  }
}
