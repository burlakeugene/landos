import React, { Component } from 'react';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';

class Item extends Component {
  constructor(props){
    super(props);
    this.state = {
      item: props.item
    }
  }
  render() {
    let {item} = this.state;
    return (
      <div>
        {item.title}
      </div>
    );
  }
}

export default Item;