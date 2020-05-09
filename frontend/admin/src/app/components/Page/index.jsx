import React, { Component } from 'react';
import './styles/styles.scss';
class Page extends Component {
  render() {
    let { title, subtitle, children } = this.props;
    return (
      <div className="landos-page">
        {title && <h1 className="landos-page-title">{title}</h1>}
        {subtitle && <h2 className="landos-page-subtitle">{subtitle}</h2>}
        {children}
      </div>
    );
  }
}

export default Page;
