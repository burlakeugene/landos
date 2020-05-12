import React, { Component } from 'react';
import Item from 'containers/Item';
import { getItems } from 'actions/Items';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
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
  }
  render() {
    let { items } = this.state;
    return (
      <div>
        <Link to={'/item'}>Imte</Link>
        {items.map((item, index) => {
          return <Item key={item.id} item={{ ...item }} />;
        })}
      </div>
    );
  }
}

export default List;
