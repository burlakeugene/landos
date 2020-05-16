import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles/styles.scss';
import { hideMessage } from 'actions/Status';
import Icon from 'components/Icon';
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
  render() {
    let { visible, message, type } = this.state;
    return (
      <div
        onClick={() => {
          if (type !== 'loading') hideMessage();
        }}
        className={[
          'spotter-status',
          type ? 'spotter-status__' + type : '',
          visible ? 'spotter-status__visible' : '',
        ].join(' ')}
      >
        {['success', 'error', 'info', 'loading'].map((type, index) => (
          <div
            key={type}
            className={[
              'spotter-status-icon',
              type ? 'spotter-status-icon__' + type : '',
            ].join(' ')}
          >
            <Icon type={type} />
          </div>
        ))}
        <div className={['spotter-status-message'].join(' ')}>{message}</div>
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
