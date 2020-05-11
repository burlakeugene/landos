import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles/styles.scss';

class Preloader extends Component {
  render() {
    let { visible } = this.props;
    return (
      <div
        className={[
          'landos-preloader',
          visible ? 'landos-preloader__visible' : '',
        ].join(' ')}
      >
        <div></div>
      </div>
    );
  }
}

Preloader = connect((state) => {
  return {
    visible: state.appReducer.preloader.visible || false,
  };
})(Preloader);

export default Preloader;
