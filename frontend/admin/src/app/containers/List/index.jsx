import React, { Component } from 'react';
import Item from 'containers/Item';
import { getItems } from 'actions/Items';
import Preloader from 'components/Preloader';
import { loadingSwitch } from 'actions/App';
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.getItems = this.getItems.bind(this);
  }
  getItems() {
    loadingSwitch(true);
    getItems().then((resp) => {
      this.setState({
        items: resp
      }, () => {
        loadingSwitch(false);
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
          return <Item key={item.id} item={{...item}} />;
        })}
      </div>
    );
  }
}

export default List;
