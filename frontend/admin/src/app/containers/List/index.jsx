import React, { Component } from 'react';
import Item from 'containers/Item';
import { getItems } from 'actions/Items';
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
      this.setState({
        items: resp,
      });
    });
  }
  componentDidMount() {
    this.getItems();
    messagePush({
      message: 'test',
      delay: 3000
    })
    messagePush({
      message: 'test1',
      delay: 3000
    })
    messagePush({
      message: 'test2',
      delay: 3000
    })
    messagePush({
      message: 'test3',
      delay: 3000
    })

  }
  render() {
    let { items } = this.state,
      { buttons } = this.props;
    return (
      <div className="spotter-list">
        {items.length ? (
          items.map((item, index) => {
            return <Item key={item.id} item={{ ...item }} />;
          })
        ) : (
          <div className="spotter-list-empty">No one, yet</div>
        )}
      </div>
    );
  }
}

export default List;
