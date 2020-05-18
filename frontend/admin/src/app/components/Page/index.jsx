import React, { Component } from 'react';
import Button from 'components/Button';
import history from 'core/history';
import './styles/styles.scss';

class Page extends Component {
  render() {
    let { title, subtitle, children, buttons, back } = this.props;
    return (
      <div className="spotter-page">
        {(title || subtitle) && (
          <div className="spotter-page-header">
            {back && (
              <button
                className="spotter-page-back"
                onClick={() => {
                  history.goBack();
                }}
              ></button>
            )}
            {title && <h1 className="spotter-page-title">{title}</h1>}
            {subtitle && <h2 className="spotter-page-subtitle">{subtitle}</h2>}
          </div>
        )}
        {children && <div className="spotter-page-content">{children}</div>}
        {buttons && buttons.length && (
          <div className="spotter-page-buttons">
            {buttons.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Page;
