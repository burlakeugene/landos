import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/styles.scss';

class Button extends Component {
  render() {
    let { to, text, onClick, type = 'default' } = this.props,
      commonProps = {
        className: ['spotter-button', 'spotter-button__' + type].join(' '),
        onClick: onClick,
      };
    if (!to) return <button {...commonProps}>{text}</button>;
    return (
      <Link {...commonProps} to={to}>
        {text}
      </Link>
    );
  }
}

export default Button;
