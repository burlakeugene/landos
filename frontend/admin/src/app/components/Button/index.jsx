import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/styles.scss';

class Button extends Component {
  render() {
    let { to, text, onClick, type = 'default' } = this.props;
    return (
      <Link
        className={['spotter-button', 'spotter-button__' + type].join(' ')}
        onClick={onClick}
        to={to}
      >
        {text}
      </Link>
    );
  }
}

export default Button;
