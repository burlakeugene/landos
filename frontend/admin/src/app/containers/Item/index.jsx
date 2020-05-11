import React, { Component } from 'react';

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