import React, { Component } from 'react';
import Dashboard from 'containers/Dashboard';
import Page from 'components/Page';
class Index extends Component {
  render() {
    return (
      <Page
        title="Spotter"
        subtitle="Landing constructor"
      >
        <Dashboard />
      </Page>
    );
  }
}

export default Index;
