import React, { Component } from 'react';
import List from 'containers/List';
import Page from 'components/Page';
import Transactions from 'components/Transactions';
class Index extends Component {
  render() {
    return (
      <Page
        title="Spotter"
        subtitle="List of your landings"
        buttons={[
          {
            text: 'Add new',
            to: '/item',
            type: 'success',
          },
        ]}
      >
        <List />
      </Page>
    );
  }
}

export default Index;
