import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import Form from '../../components/general/form/form';

class Replacements extends PureComponent {

  render() {
    const {
      replacementsManagement,
      replacementsNonManagement,
    } = this.props;

    return (
      <div>
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage id='parameters-by-structure.item.management' defaultMessage='Management' />
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ replacementsManagement.rows }
              columns={ replacementsManagement.columns }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage id='parameters-by-structure.item.non-management' defaultMessage='Non-management' />
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ replacementsNonManagement.rows }
              columns={ replacementsNonManagement.columns }
            />
          </Form.Column4>
        </Form.Row>
      </div>
    );
  }
}

export default injectIntl(Replacements);
