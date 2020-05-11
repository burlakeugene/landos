import React, { Component } from 'react';
import Item from 'containers/Item';
import { getItems } from 'actions/Items';
import Preloader from 'components/Preloader';
import { loaderOff, loaderOn, messagePush } from 'actions/Status';
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.getItems = this.getItems.bind(this);
  }
  getItems() {
    loaderOn();
    getItems().then((resp) => {
      loaderOff();
      this.setState(
        {
          items: resp,
        },
        () => {
          messagePush({
            type: 'success',
            message: 'Landings loaded',
            delay: 3000,
          });
        }
      );
    });
  }
  componentDidMount() {
    this.getItems();
  }
  render() {
    let { items } = this.state;
    return (
      <div>
        {items.map((item, index) => {
          return <Item key={item.id} item={{ ...item }} />;
        })}
      </div>
    );
  }
}

export default List;
