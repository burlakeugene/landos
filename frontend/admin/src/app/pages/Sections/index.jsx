import React, { Component } from 'react';
import Page from 'components/Page';
import Sections from 'containers/Sections';
class SectionsPage extends Component {
  render() {
    return (
      <Page
        title="Spotter"
        subtitle="Sections list"
        back
      >
        <Sections />
      </Page>
    );
  }
}

export default SectionsPage;