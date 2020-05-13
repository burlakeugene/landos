import React, { Component } from 'react';
import Button from 'components/Button';
import { setRemovingItem } from 'actions/Items';
class Item extends Component {
  render() {
    let { item } = this.props;
    return (
      <div>
        {item.id} {item.title} <Button to={'/item/' + item.id} text="Edit" />{' '}
        <Button
          onClick={() => {
            setRemovingItem(item.id);
          }}
          type="error"
          text="Delete"
        />
      </div>
    );
  }
}

export default Item;
