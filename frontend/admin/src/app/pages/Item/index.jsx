import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';

class Item extends Component {
  render() {
    return (
      <div>
        Item <Link to={'/'}>index</Link>
      </div>
    );
  }
}

export default Item;
