import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
import Page from 'components/Page';
import Item from 'containers/Item';

class ItemPage extends Component {
  render() {
    return (
      <Page>
        <Item {...this.props} />
      </Page>
    );
  }
}

export default ItemPage;
