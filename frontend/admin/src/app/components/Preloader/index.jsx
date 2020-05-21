import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles/styles.scss';

class Preloader extends Component {
  render() {
    let { visible } = this.props;
    return (
      <div
        className={['preloader', visible ? 'preloader__visible' : ''].join(' ')}
      >
        <div className="preloader-spinner">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10,50 a1,1 0 0,0 80,0"
              fill="transparent"
              strokeWidth="7px"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="0.5"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>
    );
  }
}

Preloader = connect((state) => {
  return {
    visible: state.preloaderReducer.status.visible || false,
  };
})(Preloader);

export default Preloader;
