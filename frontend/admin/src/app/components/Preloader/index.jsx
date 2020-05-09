import React, { Component } from 'react';
import './styles/styles.scss';
class Preloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    if (nextProps.visible !== prevState.visible) {
      return {
        visible: nextProps.visible,
      };
    }
  }
  render() {
    let { visible } = this.state;
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

export default Preloader;
