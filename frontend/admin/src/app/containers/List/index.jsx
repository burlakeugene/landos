import React, { Component } from 'react';
import Item from 'containers/Item';
import { getItems } from 'actions/Items';
import Preloader from 'components/Preloader';
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };
    this.getItems = this.getItems.bind(this);
  }
  getItems() {
    this.setState({
      loading: true,
    });
    getItems().then((resp) => {
      this.setState({
        items: resp,
        loading: false,
      });
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
          return <Item key={item.id} {...item} />;
        })}
      </div>
    );
  }
}

export default List;
