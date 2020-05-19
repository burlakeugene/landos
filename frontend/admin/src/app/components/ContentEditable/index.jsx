import React, { Component } from 'react';

class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.dom = props.domElement || 'div';
    this.emitChange = this.emitChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  emitChange() {
    var html = this.node.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange({
        target: {
          value: html,
        },
      });
    }
    this.lastHtml = html;
  }
  onClick(e){
    this.props.onClick && this.props.onClick(e);
  }
  focus() {
    let p = this.node;
    if (p.hasChildNodes()) {
      // if the element is not empty
      let s = window.getSelection();
      let r = document.createRange();
      let e = p.childElementCount > 0 ? p.lastChild : p;
      r.setStart(e, 1);
      r.setEnd(e, 1);
      s.removeAllRanges();
      s.addRange(r);
    } else {
      p.focus();
    }
  }
  blur(){
    let p = this.node;
    p.blur();
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.html !== this.node.innerHTML;
  }
  render() {
    return (
      <this.dom
        onInput={this.emitChange}
        onBlur={this.emitChange}
        onClick={this.onClick}
        contentEditable
        ref={(node) => (this.node = node)}
        dangerouslySetInnerHTML={{ __html: this.props.html }}
      ></this.dom>
    );
  }
}

export default ContentEditable;
