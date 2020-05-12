import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles/styles.scss';
import { hideMessage } from 'actions/Status';

class StatusPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      type: props.type,
      message: props.message,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.message !== prevState.message ||
      nextProps.type !== prevState.type ||
      nextProps.visible !== prevState.visible
    ) {
      return nextProps;
    }
    return null;
  }
  getIcon(type = '') {
    switch (type) {
      case 'loading':
        return (
          <svg viewBox="0 0 100 100">
            <path d="M10,50 a1,1 0 0,0 80,0" />
          </svg>
        );
      case 'success':
        return (
          <svg viewBox="0 0 512 512">
            <path
              d="M383.841,171.838c-7.881-8.31-21.02-8.676-29.343-0.775L221.987,296.732l-63.204-64.893
c-8.005-8.213-21.13-8.393-29.35-0.387c-8.213,7.998-8.386,21.137-0.388,29.35l77.492,79.561
c4.061,4.172,9.458,6.275,14.869,6.275c5.134,0,10.268-1.896,14.288-5.694l147.373-139.762
C391.383,193.294,391.735,180.155,383.841,171.838z"
            />
            <path
              d="M256,0C114.84,0,0,114.84,0,256s114.84,256,256,256s256-114.84,256-256S397.16,0,256,0z M256,470.487
c-118.265,0-214.487-96.214-214.487-214.487c0-118.265,96.221-214.487,214.487-214.487c118.272,0,214.487,96.221,214.487,214.487
C470.487,374.272,374.272,470.487,256,470.487z"
            />
          </svg>
        );
      case 'error':
        return (
          <svg viewBox="0 0 512 512">
            <path
              d="M256,0C114.84,0,0,114.84,0,256s114.84,256,256,256s256-114.84,256-256S397.16,0,256,0z M256,475.429
            c-120.997,0-219.429-98.432-219.429-219.429S135.003,36.571,256,36.571S475.429,135.003,475.429,256S376.997,475.429,256,475.429z
            "
            />
            <path
              d="M256,134.095c-10.1,0-18.286,8.186-18.286,18.286v207.238c0,10.1,8.186,18.286,18.286,18.286
            c10.1,0,18.286-8.186,18.286-18.286V152.381C274.286,142.281,266.1,134.095,256,134.095z"
            />
            <path
              d="M359.619,237.714H152.381c-10.1,0-18.286,8.186-18.286,18.286c0,10.1,8.186,18.286,18.286,18.286h207.238
            c10.1,0,18.286-8.186,18.286-18.286C377.905,245.9,369.719,237.714,359.619,237.714z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg viewBox="0 0 512 512">
            <path
              d="M256,0C114.51,0,0,114.497,0,256c0,141.49,114.497,256,256,256c141.49,0,256-114.497,256-256C512,114.51,397.503,0,256,0z
M256,477.867c-122.337,0-221.867-99.529-221.867-221.867S133.663,34.133,256,34.133S477.867,133.663,477.867,256
S378.337,477.867,256,477.867z"
            />
            <path
              d="M255.997,209.777c-9.425,0-17.067,7.641-17.067,17.067v143.969c0,9.425,7.641,17.067,17.067,17.067
s17.067-7.641,17.067-17.067V226.843C273.063,217.417,265.422,209.777,255.997,209.777z"
            />
            <path
              d="M256,124.122c-18.821,0-34.133,15.312-34.133,34.133s15.312,34.133,34.133,34.133s34.133-15.312,34.133-34.133
S274.821,124.122,256,124.122z"
            />
          </svg>
        );
      default:
        return null;
    }
  }
  render() {
    let { visible, message, type } = this.state;
    return (
      <div
        onClick={() => {
          if(type !== 'loading') hideMessage();
        }}
        className={[
          'spotter-status',
          type ? 'spotter-status__' + type : '',
          visible ? 'spotter-status__visible' : '',
        ].join(' ')}
      >
        {['success', 'error', 'info', 'loading'].map((type, index) => (
          <div
            className={[
              'spotter-status-icon',
              type ? 'spotter-status-icon__' + type : '',
            ].join(' ')}
          >
            {this.getIcon(type)}
          </div>
        ))}
        <div
          className={[
            'spotter-status-message'
          ].join(' ')}
        >
          {message}
        </div>
      </div>
    );
  }
}

class Status extends Component {
  render() {
    let { visible, type, message } = this.props;
    return <StatusPanel visible={visible} type={type} message={message} />;
  }
}

Status = connect((state) => {
  return {
    visible: state.statusReducer.status.visible || false,
    type: state.statusReducer.status.type || '',
    message: state.statusReducer.status.message || '',
  };
})(Status);

export default Status;
