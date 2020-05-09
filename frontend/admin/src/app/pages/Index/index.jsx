import React, { Component } from 'react';
import List from 'containers/List';
import Page from 'components/Page';
class Index extends Component {
  render() {
    return (
      <Page title="Landos" subtitle="List of landings">
        <List />
      </Page>
    );
  }
}

export default Index;