import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { defineMessages, FormattedMessage } from 'react-intl';

import './additional-info.scss';

defineMessages({
  additionalInfoComment: {
    id: 'additional-info-comment',
    defaultMessage: 'COMMENT',
  },
  additionalInfoFileName: {
    id: 'additional-info-file-name',
    defaultMessage: 'FILE NAME',
  },
  additionalInfoFileFormat: {
    id: 'additional-info-file-format',
    defaultMessage: 'FILE FORMAT',
  },
  additionalInfoDateTime: {
    id: 'additional-info-date-time',
    defaultMessage: 'DATE/TIME',
  },
  additionalInfoUserName: {
    id: 'additional-info-user-name',
    defaultMessage: 'USER',
  },
  originOfValues: {
    id: 'additional-info-origin-of-values',
    defaultMessage: 'ORIGIN OF VALUES',
  },
  originOfDistributions: {
    id: 'additional-info-origin-of-distributions',
    defaultMessage: 'ORIGIN OF DISTRIBUTIONS',
  },
  originOfDistributionsHours: {
    id: 'additional-info-origin-of-distributions-hours',
    defaultMessage: 'ORIGIN OF DISTRIBUTIONS - HOURS',
  },
  originOfDistributionsAmounts: {
    id: 'additional-info-origin-of-distributions-amounts',
    defaultMessage: 'ORIGIN OF DISTRIBUTIONS - AMOUNTS',
  },
});

export class AdditionalInfo extends PureComponent {
  static propTypes = {
    info: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  @autobind
  handleMouseIn() {
    this.setState({ hover: true });
  }

  @autobind
  handleMouseOut() {
    this.setState({ hover: false });
  }

  componentDidUpdate() {
    if (this.popupNode && this.popupBoxNode && this.state.hover) {
      const { right, bottom, top } = this.popupNode.getBoundingClientRect();
      const { width: viewWidth, height: viewHeight } = document.body.getBoundingClientRect();
      const node = this.popupBoxNode;
      node.style.position = 'fixed';
      node.style.zIndex = '15';
      if (bottom < (viewHeight / 2)) {
        node.style.top = `${ bottom }px`;
        node.style.bottom = 'auto';
      } else {
        node.style.top = 'auto';
        node.style.bottom = `${ viewHeight - top }px`;
      }
      node.style.right = `${ viewWidth - right }px`;
    }
  }

  getLabel(id) {
    const labels = {
      comment: 'additional-info-comment',
      fileName: 'additional-info-file-name',
      fileFormat: 'additional-info-file-format',
      importDateTime: 'additional-info-date-time',
      userName: 'additional-info-user-name',
      originValue: 'additional-info-origin-of-values',
      originDistribution: 'additional-info-origin-of-distributions',
      originDistributionHour: 'additional-info-origin-of-distributions-hours',
      originDistributionAmount: 'additional-info-origin-of-distributions-amounts',
      premiumDescription: null,
    };

    return labels[id];
  }

  renderRows(rows) {
    return rows.map((row, index) => row.message && (
      <div key={ row.label }>
        { index !== 0 && <div className='additional-info__separator' /> }
        { row.label && <div className='additional-info__title'>
          <FormattedMessage id={ row.label } />
        </div> }
        <div className='additional-info__value'>{ row.message }</div>
      </div>
    ));
  }

  render() {
    const { hover: isVisible } = this.state;
    const { info } = this.props;
    const rows = [];

    for (const key in info) {
      if (info[key]) {
        rows.push({ label: this.getLabel(key), message: info[key] });
      }
    }

    return rows.length ? (
      <div className='additional-info'>
        <div
          className='additional-info__icon'
          onMouseOver={ this.handleMouseIn }
          onMouseOut={ this.handleMouseOut }
        />
        <div
          className={ classNames('additional-info__popup', {
            'additional-info__popup--show': isVisible,
          }) }
          ref={ (node) => { this.popupNode = node; } }
        >
          {isVisible &&
          <div
            className='additional-info__box'
            ref={ (node) => { this.popupBoxNode = node; } }
          >
            { this.renderRows(rows) }
          </div>
          }
        </div>
      </div>
    ) : null;
  }
}
