import React, { Component } from 'react';
import Button from 'components/Button';
import './styles/styles.scss';

class Page extends Component {
  render() {
    let { title, subtitle, children, buttons } = this.props;
    return (
      <div className="spotter-page">
        {title && <h1 className="spotter-page-title">{title}</h1>}
        {subtitle && <h2 className="spotter-page-subtitle">{subtitle}</h2>}
        {children && <div className="spotter-page-content">{children}</div>}
        {buttons.length && (
          <div className="spotter-page-buttons">
            {buttons.map((button, index) => (
              <Button {...button} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Page;
